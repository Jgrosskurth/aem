/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // Social icons row
  const socialRow = document.createElement('div');
  socialRow.className = 'footer-social';
  const socials = [
    { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/user/dickssportinggoods' },
    { name: 'X', icon: 'x', url: 'https://x.com/DLOSSTOREDIGITAL' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/dickssportinggoods' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/dickssportinggoods/' },
  ];
  socials.forEach(({ name, icon, url }) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', name);
    a.innerHTML = `<span class="icon icon-${icon}"><img data-icon-name="${icon}" src="/icons/${icon}.svg" alt="${name}" loading="lazy"></span>`;
    socialRow.append(a);
  });
  footer.append(socialRow);

  // Logo + copyright
  const bottomBar = document.createElement('div');
  bottomBar.className = 'footer-bottom';
  bottomBar.innerHTML = `
    <p class="footer-copyright">&copy; 2026 DICK'S Sporting Goods</p>
    <nav class="footer-legal" aria-label="Legal links">
      <a href="https://www.dickssportinggoods.com/s/terms-of-use">Terms of Use</a>
      <a href="https://www.dickssportinggoods.com/s/privacy-policy">Privacy Policy</a>
      <a href="https://www.dickssportinggoods.com/s/accessibility-policy">Accessibility Policy</a>
    </nav>
  `;
  footer.append(bottomBar);

  block.append(footer);
}
