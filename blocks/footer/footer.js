/**
 * loads and decorates the footer with DSG footer image
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'footer';

  const img = document.createElement('img');
  img.src = '/content/dsg-footer.png';
  img.alt = "DICK'S Sporting Goods Footer";
  img.loading = 'lazy';
  wrapper.append(img);

  block.append(wrapper);
}
