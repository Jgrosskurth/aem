var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-protips-article.js
  var import_protips_article_exports = {};
  __export(import_protips_article_exports, {
    default: () => import_protips_article_default
  });

  // tools/importer/parsers/cards-product.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-single-product__image, .prod-spec img, img");
    const titleEl = element.querySelector('.cmp-single-product__title, [class*="product__title"]');
    const descEl = element.querySelector('.cmp-single-product__description, [class*="product__description"]');
    const priceEl = element.querySelector('.cmp-single-product__price, [class*="product__price"]');
    const specsEl = element.querySelector('.cmp-single-product__specifications ul, [class*="specifications"] ul');
    const ctaLink = element.querySelector('a.cmp-single-product__learn-more, a[class*="learn-more"]');
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }
    const contentCell = [];
    if (titleEl) {
      const h3 = document.createElement("h3");
      h3.textContent = titleEl.textContent.trim();
      contentCell.push(h3);
    }
    if (descEl) {
      contentCell.push(descEl);
    }
    if (priceEl) {
      const priceP = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = priceEl.textContent.trim();
      priceP.append(strong);
      contentCell.push(priceP);
    }
    if (specsEl) {
      contentCell.push(specsEl);
    }
    if (ctaLink) {
      const linkP = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim() || "Learn More";
      linkP.append(a);
      contentCell.push(linkP);
    }
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feedback.js
  function parse2(element, { document }) {
    const grid = element.querySelector('.hmf-grid, .grid-system, [role="grid"]');
    const columns = grid ? grid.querySelectorAll(':scope > .hmf-col, :scope > div[class*="hmf-col"]') : element.querySelectorAll(".hmf-col");
    const col1Cell = [];
    if (columns.length > 0) {
      const imgCol = columns[0];
      const badgeImg = imgCol.querySelector("img");
      if (badgeImg) col1Cell.push(badgeImg);
      const heading = imgCol.querySelector("h3, .cmp-title__text");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col1Cell.push(h3);
      }
    }
    const col2Cell = [];
    if (columns.length > 1) {
      const textCol = columns[1];
      const textBlocks = textCol.querySelectorAll(":scope > .text, :scope > div > .cmp-text");
      textBlocks.forEach((textBlock) => {
        const cmpText = textBlock.querySelector(".cmp-text") || textBlock;
        const paragraphs = cmpText.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") col2Cell.push(p);
        });
      });
    }
    const cells = [[col1Cell, col2Cell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feedback", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-comparison.js
  function parse3(element, { document }) {
    const sourceTable = element.querySelector("table");
    if (!sourceTable) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "table-comparison", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const rows = sourceTable.querySelectorAll("tr");
    const cells = [];
    rows.forEach((row) => {
      const tds = row.querySelectorAll("td, th");
      const rowCells = [];
      tds.forEach((td) => {
        const bold = td.querySelector("b, strong");
        if (bold) {
          rowCells.push(bold.textContent.trim());
        } else {
          const p = td.querySelector("p");
          rowCells.push(p ? p.textContent.trim() : td.textContent.trim());
        }
      });
      if (rowCells.length > 0) cells.push(rowCells);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table-comparison", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dsg-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".spacer"]);
      WebImporter.DOMUtils.remove(element, [".divider.separator"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["section.experiencefragment"]);
      WebImporter.DOMUtils.remove(element, ["nav.cmp-navigation"]);
      WebImporter.DOMUtils.remove(element, [".dynamicproductplacement"]);
      WebImporter.DOMUtils.remove(element, [".productlist"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
      const emptyPs = element.querySelectorAll("p");
      emptyPs.forEach((p) => {
        const text = p.textContent.trim();
        if (text === "" || text === "\xA0") {
          p.remove();
        }
      });
    }
  }

  // tools/importer/transformers/dsg-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload || {};
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        if (section.id === template.sections[0].id) return;
        let sectionStart = null;
        if (section.defaultContent && section.defaultContent.length > 0) {
          for (const sel of section.defaultContent) {
            try {
              sectionStart = element.querySelector(sel);
              if (sectionStart) break;
            } catch (e) {
            }
          }
        }
        if (!sectionStart && section.blocks && section.blocks.length > 0) {
          const allBlocks = template.blocks || [];
          for (const blockName of section.blocks) {
            const blockDef = allBlocks.find((b) => b.name === blockName);
            if (blockDef && blockDef.instances) {
              for (const sel of blockDef.instances) {
                try {
                  sectionStart = element.querySelector(sel);
                  if (sectionStart) break;
                } catch (e) {
                }
              }
            }
            if (sectionStart) break;
          }
        }
        if (sectionStart) {
          const hr = (element.ownerDocument || document).createElement("hr");
          sectionStart.before(hr);
          if (section.style) {
            const sectionMetadata = WebImporter.Blocks.createBlock(
              element.ownerDocument || document,
              { name: "Section Metadata", cells: { style: section.style } }
            );
            hr.after(sectionMetadata);
          }
        }
      });
    }
  }

  // tools/importer/import-protips-article.js
  var PAGE_TEMPLATE = {
    name: "protips-article",
    description: "ProTips sports article page with product recommendations and expert advice",
    urls: [
      "https://www.dickssportinggoods.com/protips/sports-and-activities/baseball/best-bbcor-bats"
    ],
    blocks: [
      {
        name: "cards-product",
        instances: [".singleproduct"]
      },
      {
        name: "columns-feedback",
        instances: ["main .aem-Grid > div:nth-child(3) .aem-Grid > .container.responsivegrid"]
      },
      {
        name: "table-comparison",
        instances: [".text.cmp-text_table-one"]
      }
    ],
    sections: [
      {
        id: "hero-intro",
        name: "Hero & Introduction",
        selector: "main .aem-Grid > div:nth-child(3) .aem-Grid",
        style: null,
        blocks: [],
        defaultContent: [
          ".title--wrapper:first-child",
          ".text.cmp-text_table-three",
          ".datepicker",
          ".image.pad-0",
          ".aem-Grid > div:nth-child(9).text"
        ]
      },
      {
        id: "product-reviews",
        name: "Product Reviews",
        selector: "main .aem-Grid > div:nth-child(3) .aem-Grid",
        style: null,
        blocks: ["cards-product", "columns-feedback"],
        defaultContent: [
          ".title--wrapper:nth-child(11)",
          ".aem-Grid > div:nth-child(12).text"
        ]
      },
      {
        id: "comparison",
        name: "Side-by-Side Comparison",
        selector: "main .aem-Grid > div:nth-child(3) .aem-Grid",
        style: null,
        blocks: ["table-comparison"],
        defaultContent: [
          ".title--wrapper:nth-child(46)",
          ".aem-Grid > div:nth-child(47).text",
          ".aem-Grid > div:nth-child(51).text"
        ]
      }
    ]
  };
  var parsers = {
    "cards-product": parse,
    "columns-feedback": parse2,
    "table-comparison": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
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
  var import_protips_article_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_protips_article_exports);
})();
