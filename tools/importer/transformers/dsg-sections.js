/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DSG section breaks.
 * Adds section breaks (<hr>) between sections defined in page-templates.json.
 * Runs in afterTransform only.
 *
 * Template sections (from page-templates.json):
 * 1. hero-intro - Hero & Introduction (no style)
 * 2. product-reviews - Product Reviews (no style)
 * 3. comparison - Side-by-Side Comparison (no style)
 *
 * All sections have style: null, so no section-metadata blocks are needed.
 * Only <hr> section breaks are inserted.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Skip the first section (no <hr> before first section)
      if (section.id === template.sections[0].id) return;

      // Find the first element that belongs to this section using defaultContent or block selectors
      let sectionStart = null;

      // Try defaultContent selectors first
      if (section.defaultContent && section.defaultContent.length > 0) {
        for (const sel of section.defaultContent) {
          try {
            sectionStart = element.querySelector(sel);
            if (sectionStart) break;
          } catch (e) {
            // Invalid selector, skip
          }
        }
      }

      // If not found via defaultContent, try finding via block instances
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
                // Invalid selector, skip
              }
            }
          }
          if (sectionStart) break;
        }
      }

      if (sectionStart) {
        // Insert <hr> before the section start element
        const hr = (element.ownerDocument || document).createElement('hr');
        sectionStart.before(hr);

        // Add section-metadata if section has a style
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(
            element.ownerDocument || document,
            { name: 'Section Metadata', cells: { style: section.style } },
          );
          // Insert section-metadata after the last element of this section (before the next hr or at end)
          // For simplicity, insert right before the hr we just added, then move hr before it
          hr.after(sectionMetadata);
        }
      }
    });
  }
}
