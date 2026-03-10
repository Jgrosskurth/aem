/* eslint-disable */
/* global WebImporter */

/**
 * Parser: table-comparison
 * Base block: table
 * Source: https://www.dickssportinggoods.com/protips/sports-and-activities/baseball/best-bbcor-bats
 * Generated: 2026-03-10
 *
 * Parses comparison stats table into a Table block.
 * 4 columns: BAT | EXIT VELOCITY AVG. | DISTANCE AVG. | HR LAUNCH ANGLE AVG.
 * Header row + 8 data rows of bat performance stats.
 *
 * Source DOM: .text.cmp-text_table-one > .cmp-text > table > tbody > tr > td > p
 * Target: Table block with header row and data rows.
 * Note: Live URL blocked by bot detection. Parser validated against captured DOM.
 */
export default function parse(element, { document }) {
  const sourceTable = element.querySelector('table');
  if (!sourceTable) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'table-comparison', cells: [] });
    element.replaceWith(block);
    return;
  }

  const rows = sourceTable.querySelectorAll('tr');
  const cells = [];

  rows.forEach((row) => {
    const tds = row.querySelectorAll('td, th');
    const rowCells = [];
    tds.forEach((td) => {
      const bold = td.querySelector('b, strong');
      if (bold) {
        rowCells.push(bold.textContent.trim());
      } else {
        const p = td.querySelector('p');
        rowCells.push(p ? p.textContent.trim() : td.textContent.trim());
      }
    });
    if (rowCells.length > 0) cells.push(rowCells);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-comparison', cells });
  element.replaceWith(block);
}
