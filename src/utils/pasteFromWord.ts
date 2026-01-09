/**
 * Paste from Word - Clean formatting utility
 * 
 * Features:
 * - Removes MS Word formatting
 * - Strips inline styles
 * - Converts to clean HTML
 * - Preserves basic formatting (bold, italic, lists)
 * - Removes comments, metadata, custom XML
 */

export type CleanPasteOptions = {
  preserveLists?: boolean;
  preserveLinks?: boolean;
  preserveBasicFormatting?: boolean; // bold, italic, underline
  preserveHeadings?: boolean;
  maxHeadingLevel?: number; // e.g., 3 = only h1, h2, h3
};

const DEFAULT_OPTIONS: CleanPasteOptions = {
  preserveLists: true,
  preserveLinks: true,
  preserveBasicFormatting: true,
  preserveHeadings: true,
  maxHeadingLevel: 3,
};

/**
 * Main function to clean pasted content from Word
 */
export function cleanPasteFromWord(
  html: string,
  options: CleanPasteOptions = DEFAULT_OPTIONS
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove Word-specific elements
  removeWordElements(temp);

  // Remove all inline styles
  removeInlineStyles(temp);

  // Remove classes and IDs
  removeClassesAndIds(temp);

  // Clean up formatting based on options
  if (!opts.preserveBasicFormatting) {
    removeBasicFormatting(temp);
  }

  if (!opts.preserveLists) {
    convertListsToPlainText(temp);
  }

  if (!opts.preserveLinks) {
    convertLinksToPlainText(temp);
  }

  if (!opts.preserveHeadings) {
    convertHeadingsToPlainText(temp);
  } else if (opts.maxHeadingLevel) {
    limitHeadingLevels(temp, opts.maxHeadingLevel);
  }

  // Remove empty elements
  removeEmptyElements(temp);

  // Normalize whitespace
  normalizeWhitespace(temp);

  return temp.innerHTML;
}

/**
 * Remove Word-specific elements and attributes
 */
function removeWordElements(element: HTMLElement) {
  // Remove XML tags
  const xmlTags = element.querySelectorAll(
    'xml, w\\:*, v\\:*, o\\:*, m\\:*, st1\\:*'
  );
  xmlTags.forEach((tag) => tag.remove());

  // Remove Word comments
  const comments = element.querySelectorAll('[class^="Mso"]');
  comments.forEach((comment) => comment.remove());

  // Remove meta tags
  const metaTags = element.querySelectorAll('meta, link, style');
  metaTags.forEach((tag) => tag.remove());

  // Remove data attributes
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el) => {
    const attrs = Array.from(el.attributes);
    attrs.forEach((attr) => {
      if (
        attr.name.startsWith('data-') ||
        attr.name.startsWith('v:') ||
        attr.name.startsWith('o:') ||
        attr.name.startsWith('w:')
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

/**
 * Remove all inline styles
 */
function removeInlineStyles(element: HTMLElement) {
  const elementsWithStyle = element.querySelectorAll('[style]');
  elementsWithStyle.forEach((el) => {
    el.removeAttribute('style');
  });
}

/**
 * Remove classes and IDs
 */
function removeClassesAndIds(element: HTMLElement) {
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el) => {
    el.removeAttribute('class');
    el.removeAttribute('id');
  });
}

/**
 * Remove basic formatting (b, i, u, strong, em)
 */
function removeBasicFormatting(element: HTMLElement) {
  const formattingTags = element.querySelectorAll('b, strong, i, em, u');
  formattingTags.forEach((tag) => {
    const textNode = document.createTextNode(tag.textContent || '');
    tag.parentNode?.replaceChild(textNode, tag);
  });
}

/**
 * Convert lists to plain text
 */
function convertListsToPlainText(element: HTMLElement) {
  const lists = element.querySelectorAll('ul, ol');
  lists.forEach((list) => {
    const items = Array.from(list.querySelectorAll('li'));
    const text = items.map((item) => `• ${item.textContent}`).join('\n');
    const textNode = document.createTextNode(text);
    list.parentNode?.replaceChild(textNode, list);
  });
}

/**
 * Convert links to plain text
 */
function convertLinksToPlainText(element: HTMLElement) {
  const links = element.querySelectorAll('a');
  links.forEach((link) => {
    const textNode = document.createTextNode(link.textContent || '');
    link.parentNode?.replaceChild(textNode, link);
  });
}

/**
 * Convert headings to plain text
 */
function convertHeadingsToPlainText(element: HTMLElement) {
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${heading.innerHTML}</strong>`;
    heading.parentNode?.replaceChild(p, heading);
  });
}

/**
 * Limit heading levels (e.g., h4-h6 become h3)
 */
function limitHeadingLevels(element: HTMLElement, maxLevel: number) {
  for (let level = maxLevel + 1; level <= 6; level++) {
    const headings = element.querySelectorAll(`h${level}`);
    headings.forEach((heading) => {
      const newHeading = document.createElement(`h${maxLevel}`);
      newHeading.innerHTML = heading.innerHTML;
      heading.parentNode?.replaceChild(newHeading, heading);
    });
  }
}

/**
 * Remove empty elements
 */
function removeEmptyElements(element: HTMLElement) {
  const allElements = Array.from(element.querySelectorAll('*'));
  allElements.reverse().forEach((el) => {
    if (
      !el.textContent?.trim() &&
      !el.querySelector('img, br, hr') &&
      el.tagName !== 'BR'
    ) {
      el.remove();
    }
  });
}

/**
 * Normalize whitespace
 */
function normalizeWhitespace(element: HTMLElement) {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  textNodes.forEach((textNode) => {
    if (textNode.textContent) {
      // Replace multiple spaces with single space
      textNode.textContent = textNode.textContent.replace(/\s+/g, ' ');
      
      // Remove leading/trailing whitespace from text nodes
      if (textNode.textContent === ' ') {
        const prev = textNode.previousSibling;
        const next = textNode.nextSibling;
        if (!prev || !next || prev.nodeName === 'BR' || next.nodeName === 'BR') {
          textNode.remove();
        }
      }
    }
  });
}

/**
 * Detect if pasted content is from MS Word
 */
export function isWordContent(html: string): boolean {
  return (
    html.includes('urn:schemas-microsoft-com') ||
    html.includes('MsoNormal') ||
    html.includes('<w:') ||
    html.includes('<o:') ||
    html.includes('<v:') ||
    html.includes('class="Mso')
  );
}

/**
 * Handle paste event and clean Word content
 */
export function handlePaste(
  event: ClipboardEvent,
  cleanFormatting: boolean,
  options?: CleanPasteOptions
): string | null {
  const clipboardData = event.clipboardData;
  if (!clipboardData) return null;

  const html = clipboardData.getData('text/html');
  const text = clipboardData.getData('text/plain');

  // If no HTML or clean formatting is disabled, return plain text
  if (!html || !cleanFormatting) {
    return text;
  }

  // If it's Word content, clean it
  if (isWordContent(html)) {
    return cleanPasteFromWord(html, options);
  }

  // For non-Word HTML, still do basic cleaning if requested
  if (cleanFormatting) {
    return cleanPasteFromWord(html, { ...options, preserveBasicFormatting: true });
  }

  return html;
}
