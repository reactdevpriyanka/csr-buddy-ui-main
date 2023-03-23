/**
 * Convert a `rem` value to `px`.
 * @param {Number}
 * @return {Number}
 */
export default function remToPx(rem) {
  if (window) {
    const documentFontSize = getComputedStyle(document.documentEl).getPropertyValue('font-size');
    const fontSize = Number.parseInt(documentFontSize, 10);
    return rem * fontSize;
  }
}
