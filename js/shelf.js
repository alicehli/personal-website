/**
 * Bookshelf: one shelf per year, one spine per book. A spine takes its colour
 * from the cover, its thickness from the page count, and five-star books get a
 * pink ribbon. Hovering a spine shows the cover; clicking opens it on Goodreads.
 * Data comes from data/books.json, written by build-books.mjs.
 */

import { $ } from './dom.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEFAULT_PAGES = 300;   // for books Goodreads has no page count for

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shortTitle = title => title.split(':')[0];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

const spineWidth = book => Math.round(Math.min(40, Math.max(15, 10 + (book.pages || DEFAULT_PAGES) / 22)));
// Heights vary a little per book (the same on every visit) so the shelf looks hand-stacked
const spineHeight = book => 140 + (hash(book.id) % 5) * 9 + Math.min(20, (book.pages || DEFAULT_PAGES) / 40);

const formatDate = iso => {
    const [y, m, d] = iso.split('-');
    return `${MONTHS[m - 1]} ${+d}, ${y}`;
};

const stars = rating => rating
    ? `${'★'.repeat(rating)}<span class="book-card-stars-empty">${'★'.repeat(5 - rating)}</span>`
    : '';

const groupBy = (list, key) => list.reduce((groups, item) => {
    const k = key(item);
    (groups.get(k) || groups.set(k, []).get(k)).push(item);
    return groups;
}, new Map());

function spine(book) {
    return `<a class="spine${book.rating === 5 ? ' five-star' : ''}" href="${book.url}" target="_blank" rel="noopener noreferrer"
        data-id="${book.id}" aria-label="${esc(book.title)} by ${esc(book.author)}"
        style="width: ${spineWidth(book)}px; height: ${spineHeight(book)}px; --spine: ${book.color}; --ink: ${book.ink}"><span class="spine-face">${esc(shortTitle(book.title))}</span></a>`;
}

function shelfRow(year, books) {
    const months = groupBy(books, b => +b.read.slice(5, 7));
    return `
        <div class="shelf-year">
            <div class="shelf-label"><span class="shelf-label-year">${year}</span>${books.length} books</div>
            <div class="shelf-scroll">
                <div class="shelf">
                    ${[...months].map(([month, list]) => `
                        <div class="shelf-month">
                            ${list.map(spine).join('')}
                            <span class="shelf-month-label">${MONTHS[month - 1]}</span>
                        </div>`).join('')}
                </div>
            </div>
        </div>`;
}

export async function renderShelf() {
    const shelf = $('.bookshelf');
    if (!shelf) return;

    const books = await (await fetch('/data/books.json')).json();
    const byId = new Map(books.map(b => [b.id, b]));
    const years = [...groupBy(books, b => b.read.slice(0, 4))].sort(([a], [b]) => b.localeCompare(a));
    shelf.innerHTML = years.map(([year, list]) => shelfRow(year, list)).join('');

    initBookCard(shelf, byId);
}

/**
 * Card with the cover, title, author, rating and date, shown above the hovered
 * or focused spine. Covers load only when their spine is hovered.
 */
function initBookCard(shelf, byId) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.hidden = true;
    document.body.appendChild(card);
    let active = null;

    function show(el) {
        if (active === el) return;
        hide();
        active = el;
        el.classList.add('active');
        const book = byId.get(el.dataset.id);
        card.innerHTML = `
            ${book.cover ? `<img src="${book.cover}" alt="" />` : ''}
            <div class="book-card-text">
                <div class="book-card-title">${esc(book.title)}</div>
                <div class="book-card-meta">${esc(book.author)}</div>
                <div class="book-card-stars">${stars(book.rating)}</div>
                <div class="book-card-meta">finished ${formatDate(book.read)}</div>
            </div>`;
        card.hidden = false;

        // Above the spine, kept inside the window; below it if there's no room
        const r = el.getBoundingClientRect();
        const { offsetWidth: w, offsetHeight: h } = card;
        const x = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12);
        const y = r.top - h - 12 >= 12 ? r.top - h - 12 : r.bottom + 12;
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
    }

    function hide() {
        active?.classList.remove('active');
        active = null;
        card.hidden = true;
    }

    shelf.addEventListener('pointerover', e => {
        const el = e.target.closest('.spine');
        if (el) show(el);
    });
    // Checked on every move rather than on pointerout, which can be missed when
    // the spine slides up from under the pointer
    document.addEventListener('pointermove', e => {
        if (active && !e.target.closest?.('.spine')) hide();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    // Keyboard focus only: a clicked spine keeps focus, and refocusing it when
    // you come back from Goodreads shouldn't bring the card back
    shelf.addEventListener('focusin', e => {
        const el = e.target.closest('.spine');
        if (el?.matches(':focus-visible')) show(el);
    });
    shelf.addEventListener('focusout', hide);
    addEventListener('blur', hide);
    addEventListener('scroll', hide, { passive: true });
    shelf.addEventListener('scroll', hide, { capture: true, passive: true });
}
