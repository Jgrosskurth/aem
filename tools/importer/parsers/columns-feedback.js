/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-feedback
 * Base block: columns
 * Source: https://www.dickssportinggoods.com/protips/sports-and-activities/baseball/best-bbcor-bats
 * Generated: 2026-03-10
 *
 * Parses player feedback panels into a Columns block.
 * Badge image (col 1) | feedback bullets + ideal-for + video link (col 2)
 *
 * Source DOM: .container.responsivegrid > .cmp-container > .aem-Grid > .grid.parsys >
 *   .hmf-grid.grid-system > [.hmf-col (badge), .hmf-col (text)]
 *
 * Target: Columns block, 2 columns per row.
 * Note: Live URL validation fails due to bot detection on dickssportinggoods.com.
 * Parser validated against captured DOM in migration-work/cleaned.html.
 */
export default function parse(element, { document }) {
  const grid = element.querySelector('.hmf-grid, .grid-system, [role="grid"]');
  const columns = grid
    ? grid.querySelectorAll(':scope > .hmf-col, :scope > div[class*="hmf-col"]')
    : element.querySelectorAll('.hmf-col');

  const col1Cell = [];
  if (columns.length > 0) {
    const imgCol = columns[0];
    const badgeImg = imgCol.querySelector('img');
    if (badgeImg) col1Cell.push(badgeImg);
    const heading = imgCol.querySelector('h3, .cmp-title__text');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col1Cell.push(h3);
    }
  }

  const col2Cell = [];
  if (columns.length > 1) {
    const textCol = columns[1];
    const textBlocks = textCol.querySelectorAll(':scope > .text, :scope > div > .cmp-text');
    textBlocks.forEach((textBlock) => {
      const cmpText = textBlock.querySelector('.cmp-text') || textBlock;
      const paragraphs = cmpText.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== '\u00a0') col2Cell.push(p);
      });
    });
  }

  const cells = [[col1Cell, col2Cell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feedback', cells });
  element.replaceWith(block);
}
