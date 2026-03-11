import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Adds social sharing icons to the sidebar section.
 * @param {Element} main The main element
 */
function buildSocialShare(main) {
  const sidebar = main.querySelector('.section.sidebar');
  if (!sidebar) return;
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const shares = [
    { name: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { name: 'X', icon: 'x', href: `https://x.com/intent/tweet?url=${url}&text=${title}` },
    { name: 'Email', icon: 'email', href: `mailto:?subject=${title}&body=${url}` },
    { name: 'Pinterest', icon: 'pinterest', href: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}` },
    { name: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
  ];
  const nav = document.createElement('nav');
  nav.className = 'social-share';
  nav.setAttribute('aria-label', 'Share this article');
  shares.forEach(({ name, icon, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `Share on ${name}`);
    a.innerHTML = `<span class="icon icon-${icon}"><img data-icon-name="${icon}" src="/icons/${icon}.svg" alt="${name}" loading="lazy"></span>`;
    nav.append(a);
  });
  sidebar.prepend(nav);
}

/**
 * Adds featured product recommendations to the sidebar section.
 * @param {Element} main The main element
 */
function buildFeaturedProducts(main) {
  const sidebar = main.querySelector('.section.sidebar');
  if (!sidebar) return;
  const products = [
    {
      name: "Nike Kids' Hyperdiamond 4 Keystone Softball Cleats",
      price: '$29.99',
      href: 'https://www.dickssportinggoods.com/p/nike-kids-hyperdiamond-4-keystone-softball-cleats-21nikywhyprdmnd4krbb/21nikywhyprdmnd4krbb',
      img: 'https://dks.scene7.com/is/image/dkscdn/21NIKYWHYPRDMND4KRBB_Pure_Platinum_Grey_White_is',
    },
    {
      name: "New Balance Men's Fresh Foam X 3000 V7 Molded Baseball Cleats",
      price: '$94.99 - $104.99',
      href: 'https://www.dickssportinggoods.com/p/new-balance-mens-fresh-foam-x-3000-v7-molded-baseball-cleats-24nwbmfrshfm3000vclta/24nwbmfrshfm3000vclta',
      img: 'https://dks.scene7.com/is/image/dkscdn/24NWBMFRSHFM3000VCLTA_Red_White_is',
    },
    {
      name: "Nike Kids' Dri-FIT Multi Woven Shorts",
      price: '$12.97 - $25.00',
      href: 'https://www.dickssportinggoods.com/p/nike-kids-dri-fit-multi-woven-shorts-22nikbbnkdfmltshraot/22nikbbnkdfmltshraot',
      img: 'https://dks.scene7.com/is/image/dkscdn/22NIKBBNKDFMLTSHRAOT_Cannon_White_is',
    },
  ];
  const section = document.createElement('div');
  section.className = 'featured-products';
  section.innerHTML = `<h3>Featured Products</h3><ul>${products.map((p) => `<li><a href="${p.href}" target="_blank" rel="noopener noreferrer"><img src="${p.img}" alt="${p.name}" loading="lazy" width="90" height="90"><div><span class="fp-name">${p.name}</span><span class="fp-price">${p.price}</span></div></a></li>`).join('')}</ul>`;
  // Insert after social share, before Related Products
  const socialShare = sidebar.querySelector('.social-share');
  if (socialShare && socialShare.nextSibling) {
    sidebar.insertBefore(section, socialShare.nextSibling);
  } else {
    sidebar.prepend(section);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  buildSocialShare(main);
  buildFeaturedProducts(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
