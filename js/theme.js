/**
 * Light/dark theme toggle, remembered in localStorage.
 */

import { icon } from './icons.js';
import { $ } from './dom.js';

export function initTheme() {
    const nav = $('nav');
    if (!nav) return;

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle theme');
    nav.appendChild(btn);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const apply = theme => {
        document.documentElement.dataset.theme = theme;
        btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    };

    apply(localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light'));

    btn.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        apply(next);
    });
}
