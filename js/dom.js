/**
 * Small DOM helpers shared by the renderers.
 */

export const $ = (selector, root = document) => root.querySelector(selector);

export const isExternal = href => /^https?:\/\//.test(href);

// Attributes for a link, opening external URLs in a new tab
export const linkAttrs = href =>
    `href="${href}"${isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
