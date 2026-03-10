/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DSG (Dick's Sporting Goods) cleanup.
 * Removes non-authorable content from ProTips article pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove spacers that may interfere with block parsing
    // Found in captured DOM: <div class="spacer ..."><div class="defaultSpacer ..."></div></div>
    // and <div class="spacer hmf-pb-..."><div class="cmp-spacer"></div></div>
    WebImporter.DOMUtils.remove(element, ['.spacer']);

    // Remove dividers/separators between product sections
    // Found in captured DOM: <div class="divider separator cmp-separator--border-medium ...">
    WebImporter.DOMUtils.remove(element, ['.divider.separator']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove experience fragment (search bar navigation)
    // Found in captured DOM: <section class="experiencefragment ...">
    WebImporter.DOMUtils.remove(element, ['section.experiencefragment']);

    // Remove navigation within experience fragment
    // Found in captured DOM: <nav id="navigation-5fbb88a29c" class="cmp-navigation ...">
    WebImporter.DOMUtils.remove(element, ['nav.cmp-navigation']);

    // Remove dynamic product placement sections (sidebar)
    // Found in captured DOM: <div class="dynamicproductplacement accordion cmp-productlist--title-featured ...">
    WebImporter.DOMUtils.remove(element, ['.dynamicproductplacement']);

    // Remove Recently Viewed product section
    // Found in captured DOM: <div class="productlist aem-GridColumn ..."> containing "Recently Viewed"
    WebImporter.DOMUtils.remove(element, ['.productlist']);

    // Remove iframes
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove noscript and link elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);

    // Clean up empty paragraphs with just &nbsp;
    const emptyPs = element.querySelectorAll('p');
    emptyPs.forEach((p) => {
      const text = p.textContent.trim();
      if (text === '' || text === '\u00a0') {
        p.remove();
      }
    });
  }
}
