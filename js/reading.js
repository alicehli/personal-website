/**
 * Books and Reading: a card per reading project, with the book galaxy linked underneath.
 */

import data from './data.js';
import { $, linkAttrs } from './dom.js';

export function renderReading() {
    const grid = $('.reading-projects');
    if (!grid) return;

    grid.innerHTML = data.readingProjects.map(project => `
        <a ${linkAttrs(project.href)} class="reading-card">
            <h3 class="reading-card-title">${project.title}</h3>
            <p class="reading-card-blurb">${project.blurb}</p>
        </a>
    `).join('');

    const { galaxy } = data;
    $('.reading-galaxy').innerHTML = `
        <a ${linkAttrs(galaxy.href)} class="galaxy-card">
            <span class="galaxy-card-title">${galaxy.title} &rarr;</span>
            <span class="galaxy-card-blurb">${galaxy.blurb}</span>
        </a>
    `;
}
