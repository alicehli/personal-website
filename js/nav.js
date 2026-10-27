/**
 * Top navigation, built from data.navLinks.
 */

import data from './data.js';
import { icon } from './icons.js';
import { $, isExternal, linkAttrs } from './dom.js';

// "/photography/", "/photography.html" and "/photography" all become "/photography"; "/" becomes ""
const normalize = path => path.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '');

function isActive(link, path) {
    if (isExternal(link.href)) return false;
    return [link.href, ...(link.activeOn || [])]
        .map(normalize)
        .some(p => path === p || (p !== '' && path.startsWith(p + '/')));
}

export function renderNav() {
    const list = $('.nav-links');
    if (!list) return;

    const path = normalize(window.location.pathname);
    list.innerHTML = data.navLinks.map(link => `
        <li>
            <a ${linkAttrs(link.href)} class="nav-link${isActive(link, path) ? ' active' : ''}">
                <span class="nav-icon">${icon(link.icon)}</span>
                ${link.label}
            </a>
        </li>
    `).join('');
}
