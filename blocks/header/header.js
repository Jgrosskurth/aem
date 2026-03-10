/**
 * loads and decorates the header with DSG header image
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  const img = document.createElement('img');
  img.src = '/content/dsg-header.png';
  img.alt = "DICK'S Sporting Goods";
  img.loading = 'eager';
  wrapper.append(img);

  block.append(wrapper);
}
