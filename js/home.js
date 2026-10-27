/**
 * Home page: hero, photo grid, book carousel and contact links.
 */

import data from './data.js';
import { icon } from './icons.js';
import { $, linkAttrs } from './dom.js';

const TYPE_DELAY = 50;         // ms per character typed
const DELETE_DELAY = 30;       // ms per character deleted
const HOLD_DELAY = 2000;       // pause on a fully typed word
const NEXT_WORD_DELAY = 500;   // pause on an empty line before the next word

const BUBBLE_INTERVAL = 3000;      // auto-rotate period
const BUBBLE_FIRST_DELAY = 2500;   // how long the first item shows before auto-rotation starts

export function renderHome() {
    if (!$('.hero')) return;
    renderHero();
    renderPhotoGrid();
    renderBooks();
    renderContact();
    initTypewriter();
    initWorkingBubble();
}

const accent = (text, color) => `<span class="accent-${color}">${text}</span>`;

function renderHero() {
    const { hero, personal } = data;

    $('.hero-subtitle').textContent = hero.subtitle;
    $('.hero-title').innerHTML =
        `${hero.title.text} ${hero.title.accents.map(a => accent(a.text, a.color)).join(' / ')}`;

    $('.hero-description').innerHTML = Object.entries(hero.highlights || {})
        .reduce((html, [phrase, color]) => html.replace(phrase, accent(phrase, color)), hero.description);

    $('.hero-meta').innerHTML = `
        <span><span class="icon-inline">${icon('mapPin', 12)}</span> ${personal.location}</span>
        <span>• ${personal.tagline}</span>
    `;
}

function renderPhotoGrid() {
    const grid = $('.photo-grid');
    grid.innerHTML = data.heroPhotos.map(photo => `
        <div class="photo-item-flip">
            <div class="photo-item-inner">
                <div class="photo-item-front">
                    <img src="${photo.src}" alt="${photo.alt}" />
                    <div class="photo-overlay">
                        <div class="photo-title">${photo.title}</div>
                        <div class="photo-meta">${photo.meta}</div>
                    </div>
                </div>
                <div class="photo-item-back">
                    <div class="photo-back-content">
                        <div class="photo-back-title">${photo.title}</div>
                        <div class="photo-back-description">${photo.description}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    grid.addEventListener('click', e => e.target.closest('.photo-item-flip')?.classList.toggle('flipped'));
}

function renderBooks() {
    $('.books-carousel').innerHTML = data.favoriteBooks.map(book => `
        <div class="book-item-carousel">
            <a href="${book.goodreadsUrl}" class="book-link">
                <div class="book-cover-carousel">
                    ${book.coverUrl
                        ? `<img src="${book.coverUrl}" alt="${book.title}" loading="lazy" />`
                        : `<div class="book-cover-placeholder">${book.title.charAt(0)}</div>`}
                </div>
                <div class="book-info-carousel">
                    <div class="book-title-carousel" title="${book.title}">${book.title}</div>
                    <div class="book-author-carousel">${book.author}</div>
                </div>
            </a>
        </div>
    `).join('');
}

function renderContact() {
    $('.contact-links').innerHTML = data.contactLinks.map(link => {
        const href = link.email ? `mailto:${link.email.replace(' [at] ', '@')}` : link.href;
        return `<a ${linkAttrs(href)} class="contact-link" title="${link.email || link.label}">${icon(link.icon)}</a>`;
    }).join('');
}

/**
 * Types each word after a fixed prefix, holds, deletes it, then moves to the next.
 */
function initTypewriter() {
    const { prefix, words } = data.hero.typewriter;
    const text = document.createTextNode(prefix);
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    $('#typewriter-text').replaceChildren(text, cursor);

    let wordIndex = 0;
    let length = 0;
    let deleting = false;

    (function tick() {
        const word = words[wordIndex];
        length += deleting ? -1 : 1;
        text.data = prefix + word.slice(0, length);

        let delay = deleting ? DELETE_DELAY : TYPE_DELAY;
        if (!deleting && length === word.length) {
            deleting = true;
            delay = HOLD_DELAY;
        } else if (deleting && length === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = NEXT_WORD_DELAY;
        }
        setTimeout(tick, delay);
    })();
}

/**
 * "Currently working on" bubble: rotates items with a slot-machine animation;
 * clicking advances immediately (with a faster animation) and restarts the timer.
 */
function initWorkingBubble() {
    const bubble = $('#currently-working-bubble');
    const items = data.hero.currentlyWorkingOn;

    bubble.innerHTML = `
        <span class="bubble-label">Currently working on:</span>
        <div class="bubble-text-wrapper">
            <span class="bubble-text slot-active">${items[0]}</span>
        </div>
    `;

    const wrapper = $('.bubble-text-wrapper', bubble);
    let current = $('.bubble-text', wrapper);
    let index = 0;
    let animating = false;
    let timer = null;

    function advance(fast = false) {
        if (animating) return;
        animating = true;
        index = (index + 1) % items.length;

        const next = document.createElement('span');
        next.className = 'bubble-text slot-enter';
        next.textContent = items[index];
        wrapper.appendChild(next);

        requestAnimationFrame(() => current.classList.replace('slot-active', 'slot-exit'));
        // Enter slightly after the exit starts so the two don't overlap
        setTimeout(() => requestAnimationFrame(() => next.classList.replace('slot-enter', 'slot-active')), fast ? 100 : 200);
        setTimeout(() => {
            current.remove();
            current = next;
            animating = false;
        }, fast ? 300 : 600);
    }

    const startRotation = () => {
        clearInterval(timer);
        timer = setInterval(advance, BUBBLE_INTERVAL);
    };

    bubble.addEventListener('click', () => {
        advance(true);
        startRotation();
    });
    setTimeout(startRotation, BUBBLE_FIRST_DELAY);
}
