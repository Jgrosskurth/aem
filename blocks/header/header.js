const DSG_BASE = 'https://www.dickssportinggoods.com';

const UTILITY_LINKS = [
  { text: 'Sneaker Release Calendar', href: '/s/sneaker-release-calendar' },
  { text: 'ScoreRewards® Credit Card', href: '/s/scorecard' },
  { text: 'Services', href: '/s/store-services' },
  { text: 'Pickup & Delivery', href: '/s/pickup-and-delivery' },
  { text: 'Find Stores', href: '/s/stores' },
  { text: 'Gift Cards', href: '/s/gift-cards' },
  { text: 'Lists', href: '/MyAccount/Lists' },
  { text: 'Track Order', href: '/TrackOrder' },
  { text: 'Help', href: '/s/help-desk' },
];

const CATEGORY_LINKS = [
  { text: 'New & Trending', href: '/c/new-arrivals' },
  { text: 'Sports', href: '/c/sports' },
  { text: 'Golf', href: '/c/golf' },
  { text: 'Shoes', href: '/c/shoes' },
  { text: 'Women', href: '/c/women' },
  { text: 'Men', href: '/c/men' },
  { text: 'Kids', href: '/c/kids' },
  { text: 'Accessories', href: '/c/accessories' },
  { text: 'Fan Shop', href: '/c/fan-shop' },
  { text: 'Exercise & Wellness', href: '/c/exercise-and-wellness' },
  { text: 'Outdoor', href: '/c/outdoor' },
  { text: 'Sale', href: '/f/sale' },
];

const BREADCRUMBS = [
  { text: 'Pro Tips', href: '/protips' },
  { text: 'Sports & Activities', href: '/protips/sports-and-activities' },
  { text: 'Baseball', href: '/protips/sports-and-activities/baseball' },
];

/* inline SVG icons */
const ICONS = {
  search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  store: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  location: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  cart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
};

function buildPromoBanner() {
  const div = document.createElement('div');
  div.className = 'hdr-promo';
  div.innerHTML = `<a href="${DSG_BASE}/f/sale">Up to 50% Off Styles from Top Brands. Save on select styles. <strong>Shop Now</strong></a>`;
  return div;
}

function buildUtilityNav() {
  const nav = document.createElement('nav');
  nav.className = 'hdr-utility';
  nav.setAttribute('aria-label', 'Utility navigation');
  nav.innerHTML = UTILITY_LINKS.map(
    (l) => `<a href="${DSG_BASE}${l.href}">${l.text}</a>`,
  ).join('');
  return nav;
}

function buildMainHeader() {
  const div = document.createElement('div');
  div.className = 'hdr-main';
  div.innerHTML = `
    <a href="${DSG_BASE}" class="hdr-logo" aria-label="DICK'S Sporting Goods home">
      <img src="https://images.dickssportinggoods.com/assets/logo/prod/dsg/logo.svg" alt="DICK'S Sporting Goods" width="147" height="77" loading="eager" fetchpriority="high">
    </a>
    <div class="hdr-search">
      <span class="hdr-search-icon">${ICONS.search}</span>
      <span class="hdr-search-text">What are you looking for?</span>
    </div>
    <div class="hdr-actions">
      <a href="${DSG_BASE}/s/stores" class="hdr-action" aria-label="Find a store">
        <span class="hdr-action-icon">${ICONS.store}</span>
        <span class="hdr-action-label">Find a Store</span>
      </a>
      <a href="${DSG_BASE}/s/stores" class="hdr-action" aria-label="Delivery location">
        <span class="hdr-action-icon">${ICONS.location}</span>
        <span class="hdr-action-label">Delivery Location</span>
      </a>
      <a href="${DSG_BASE}/MyAccount" class="hdr-action" aria-label="My Account">
        <span class="hdr-action-icon">${ICONS.user}</span>
        <span class="hdr-action-label">My Account</span>
      </a>
      <a href="${DSG_BASE}/OrderItemDisplay" class="hdr-action" aria-label="Cart">
        <span class="hdr-action-icon">${ICONS.cart}</span>
        <span class="hdr-action-label">Cart</span>
      </a>
    </div>`;
  return div;
}

function buildCategoryNav() {
  const nav = document.createElement('nav');
  nav.className = 'hdr-categories';
  nav.setAttribute('aria-label', 'Main categories');
  nav.innerHTML = CATEGORY_LINKS.map((l) => {
    const cls = l.text === 'Sale' ? ' class="hdr-sale"' : '';
    return `<a href="${DSG_BASE}${l.href}"${cls}>${l.text}</a>`;
  }).join('');
  return nav;
}

function buildProTipsBar() {
  const div = document.createElement('div');
  div.className = 'hdr-protips';
  div.innerHTML = `
    <a href="${DSG_BASE}/protips" class="hdr-protips-logo" aria-label="DICK'S Pro Tips">
      <img src="https://s7d6.scene7.com/is/content/DSGAEMSites/dicks-pro-tips-logo" alt="DICK'S Pro Tips" width="196" height="24" loading="eager">
    </a>
    <div class="hdr-protips-search">
      <span class="hdr-search-icon">${ICONS.search}</span>
      <span class="hdr-search-text">...</span>
    </div>
    <button class="hdr-protips-menu" aria-label="Menu">${ICONS.menu}<span>MENU</span></button>`;
  return div;
}

function buildBreadcrumb() {
  const nav = document.createElement('nav');
  nav.className = 'hdr-breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const title = document.querySelector('h1');
  const currentPage = title ? title.textContent.trim() : 'Best BBCOR Bats of 2026';
  const crumbs = BREADCRUMBS.map(
    (b) => `<a href="${DSG_BASE}${b.href}">${b.text}</a>`,
  );
  crumbs.push(`<span aria-current="page">${currentPage}</span>`);
  nav.innerHTML = crumbs.join('<span class="hdr-bc-sep" aria-hidden="true">|</span>');
  return nav;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  wrapper.append(buildPromoBanner());
  wrapper.append(buildUtilityNav());
  wrapper.append(buildMainHeader());
  wrapper.append(buildCategoryNav());
  wrapper.append(buildProTipsBar());
  wrapper.append(buildBreadcrumb());

  block.append(wrapper);
}
