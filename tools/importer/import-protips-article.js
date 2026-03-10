/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsProductParser from './parsers/cards-product.js';
import columnsFeedbackParser from './parsers/columns-feedback.js';
import tableComparisonParser from './parsers/table-comparison.js';

// TRANSFORMER IMPORTS
import dsgCleanupTransformer from './transformers/dsg-cleanup.js';
import dsgSectionsTransformer from './transformers/dsg-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'protips-article',
  description: 'ProTips sports article page with product recommendations and expert advice',
  urls: [
    'https://www.dickssportinggoods.com/protips/sports-and-activities/baseball/best-bbcor-bats',
  ],
  blocks: [
    {
      name: 'cards-product',
      instances: ['.singleproduct'],
    },
    {
      name: 'columns-feedback',
      instances: ['main .aem-Grid > div:nth-child(3) .aem-Grid > .container.responsivegrid'],
    },
    {
      name: 'table-comparison',
      instances: ['.text.cmp-text_table-one'],
    },
  ],
  sections: [
    {
      id: 'hero-intro',
      name: 'Hero & Introduction',
      selector: 'main .aem-Grid > div:nth-child(3) .aem-Grid',
      style: null,
      blocks: [],
      defaultContent: [
        '.title--wrapper:first-child',
        '.text.cmp-text_table-three',
        '.datepicker',
        '.image.pad-0',
        '.aem-Grid > div:nth-child(9).text',
      ],
    },
    {
      id: 'product-reviews',
      name: 'Product Reviews',
      selector: 'main .aem-Grid > div:nth-child(3) .aem-Grid',
      style: null,
      blocks: ['cards-product', 'columns-feedback'],
      defaultContent: [
        '.title--wrapper:nth-child(11)',
        '.aem-Grid > div:nth-child(12).text',
      ],
    },
    {
      id: 'comparison',
      name: 'Side-by-Side Comparison',
      selector: 'main .aem-Grid > div:nth-child(3) .aem-Grid',
      style: null,
      blocks: ['table-comparison'],
      defaultContent: [
        '.title--wrapper:nth-child(46)',
        '.aem-Grid > div:nth-child(47).text',
        '.aem-Grid > div:nth-child(51).text',
      ],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'cards-product': cardsProductParser,
  'columns-feedback': columnsFeedbackParser,
  'table-comparison': tableComparisonParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  dsgCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [dsgSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
