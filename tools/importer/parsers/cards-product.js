/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source: https://www.dickssportinggoods.com/protips/sports-and-activities/baseball/best-bbcor-bats
 * Generated: 2026-03-10
 *
 * Parses .singleproduct elements into a Cards block.
 * Each product card has: image (col 1) | title + description + price + specs + CTA (col 2)
 *
 * Source DOM structure (from captured HTML):
 *   <div class="singleproduct ...">
 *     <div><div class="prod">
 *       <div class="cmp-single-product__content hmf-body-l">
 *         <div class="cmp-single-product__title hmf-header-bold-m">Title</div>
 *         <div class="cmp-single-product__description hmf-mt-xxs"><p>Description</p></div>
 *         <div class="prod-spec">
 *           <img class="cmp-single-product__image" src="..." alt="...">
 *           <div class="price-spec ...">
 *             <div class="cmp-single-product__price hmf-display-xs">$XXX.XX</div>
 *             <div class="cmp-single-product__specifications hmf-mt-s"><ul><li>...</li></ul></div>
 *             <a href="..." class="... cmp-single-product__learn-more ...">Learn More</a>
 *             <a class="cmp-single-product__button ...">ADD TO CART</a>
 *           </div>
 *         </div>
 *       </div>
 *     </div></div>
 *   </div>
 *
 * Target block structure (Cards - 2 columns per row):
 *   Row 1: [block name]
 *   Row 2: [image] | [title + description + price + CTA]
 *
 * Note: Validation against live URL fails due to bot detection on dickssportinggoods.com.
 * Parser is validated against captured DOM in migration-work/cleaned.html.
 */
export default function parse(element, { document }) {
  // Extract product image
  const img = element.querySelector('.cmp-single-product__image, .prod-spec img, img');

  // Extract title
  const titleEl = element.querySelector('.cmp-single-product__title, [class*="product__title"]');

  // Extract description
  const descEl = element.querySelector('.cmp-single-product__description, [class*="product__description"]');

  // Extract price
  const priceEl = element.querySelector('.cmp-single-product__price, [class*="product__price"]');

  // Extract specifications list
  const specsEl = element.querySelector('.cmp-single-product__specifications ul, [class*="specifications"] ul');

  // Extract Learn More CTA link
  const ctaLink = element.querySelector('a.cmp-single-product__learn-more, a[class*="learn-more"]');

  // Build image cell
  const imageCell = [];
  if (img) {
    imageCell.push(img);
  }

  // Build content cell - title + description + price + specs + CTA
  const contentCell = [];

  if (titleEl) {
    const h3 = document.createElement('h3');
    h3.textContent = titleEl.textContent.trim();
    contentCell.push(h3);
  }

  if (descEl) {
    contentCell.push(descEl);
  }

  if (priceEl) {
    const priceP = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = priceEl.textContent.trim();
    priceP.append(strong);
    contentCell.push(priceP);
  }

  if (specsEl) {
    contentCell.push(specsEl);
  }

  if (ctaLink) {
    const linkP = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim() || 'Learn More';
    linkP.append(a);
    contentCell.push(linkP);
  }

  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
