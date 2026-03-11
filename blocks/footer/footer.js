/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // Copyright + legal links
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
