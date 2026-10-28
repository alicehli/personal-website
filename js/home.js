/**
 * Home page: hero (with contact links) and book carousel.
 */

import data from './data.js';
import { icon } from './icons.js';
import { $, linkAttrs } from './dom.js';

const CYCLE_OUT_MS = 220;   // how long the old word takes to slide out

// Photos on the pile cover roughly the same area whatever their shape: a photo's
// width is sqrt(aspect ratio) times a square's, kept within these bounds so very
// tall or wide photos still fit the pile
const PILE_MIN_SCALE = 0.72;
const PILE_MAX_SCALE = 1.35;

export function renderHome() {
    if (!$('.hero')) return;
    renderHero();
    renderIntro();
    renderHeroNotes();
    renderBooks();
}

const accent = (text, color) => `<span class="accent-${color}">${text}</span>`;

const contactLink = link => {
    const href = link.email ? `mailto:${link.email}` : link.href;
    return `<a ${linkAttrs(href)} class="contact-link" title="${link.email || link.label}">${icon(link.icon)}</a>`;
};

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
        <span class="contact-links">${data.contactLinks.map(contactLink).join('')}</span>
    `;
}

/**
 * "I'm a ___ in NYC." Clicking the word slides it out and the next one in. The
 * button is as wide as the longest word, so the rest of the line never moves.
 */
function renderIntro() {
    const { prefix, words, suffix } = data.hero.intro;
    const intro = $('.hero-intro');
    const sizers = words.map(w => `<span class="cycle-sizer" aria-hidden="true">${w}</span>`).join('');
    intro.innerHTML = `${prefix}<button class="cycle-word" type="button" title="Click for another">${sizers}<span class="cycle-current" aria-live="polite">${words[0]}</span></button>${suffix}`;

    const button = $('.cycle-word', intro);
    const word = $('.cycle-current', button);
    let index = 0;

    button.addEventListener('click', () => {
        if (button.classList.contains('leaving')) return;
        button.classList.add('leaving');
        setTimeout(() => {
            index = (index + 1) % words.length;
            word.textContent = words[index];
            button.classList.replace('leaving', 'entering');
            // Two frames so the browser paints the entering position before sliding in
            requestAnimationFrame(() => requestAnimationFrame(() => button.classList.remove('entering')));
        }, CYCLE_OUT_MS);
    });
}

// Sets --k on `card`: its width relative to a square photo (CSS turns that into
// pixels from the pile's current width)
function sizeByArea(card, media) {
    const fit = (w, h) => {
        const scale = Math.sqrt(w / h);
        card.style.setProperty('--k', Math.min(PILE_MAX_SCALE, Math.max(PILE_MIN_SCALE, scale)).toFixed(3));
    };
    if (media.tagName === 'VIDEO') {
        if (media.videoWidth) fit(media.videoWidth, media.videoHeight);
        else media.addEventListener('loadedmetadata', () => fit(media.videoWidth, media.videoHeight), { once: true });
    } else if (media.complete && media.naturalWidth) {
        fit(media.naturalWidth, media.naturalHeight);
    } else {
        media.addEventListener('load', () => fit(media.naturalWidth, media.naturalHeight), { once: true });
    }
}

/**
 * Travel and type 2 fun lists, with a photo pile in a column to their right.
 * Hovering (or focusing, or tapping) an underlined phrase drops its polaroid on
 * top of the pile, where it develops; one already on the pile comes back to the top.
 */
const PILE_TILT = [
    { r: -4, x: -10, y: 6 },
    { r: 3, x: 12, y: -4 },
    { r: -1.5, x: -4, y: 10 },
    { r: 5, x: 8, y: 0 },
    { r: -3, x: 6, y: -8 },
    { r: 2, x: -12, y: 4 },
];

function renderHeroNotes() {
    const { travel, type2Fun } = data.hero;

    // Everything that can go on the pile, in the order it appears in the text
    const shots = [];
    const trigger = (text, shot) => {
        shots.push(shot);
        return `<span class="note-trigger" tabindex="0" data-shot="${shots.length - 1}">${text}</span>`;
    };
    const placeLine = p =>
        `${p.before}${trigger(p.link, { photo: p.photo, alt: p.place, caption: p.caption })}${p.after}`;
    const funLine = item => item.video || item.photo
        ? trigger(item.text, { ...item, alt: item.caption })
        : item.text;

    const notes = $('.hero-notes');
    notes.innerHTML = `
        <div class="hero-notes-text">
            <p>${travel.intro}</p>
            <ul>${travel.items.map(p => `<li>${placeLine(p)}</li>`).join('')}</ul>
            <p>${placeLine(travel.home)}</p>
            <p>${type2Fun.intro}</p>
            <ul>${type2Fun.items.map(item => `<li>${funLine(item)}</li>`).join('')}</ul>
        </div>
        <div class="photo-pile"></div>
    `;

    const pile = $('.photo-pile', notes);
    let top = 0;
    let active = null;

    function addToPile(i, animate = true) {
        let card = $(`[data-shot="${i}"]`, pile);
        if (!card) {
            const shot = shots[i];
            const tilt = PILE_TILT[pile.children.length % PILE_TILT.length];
            card = document.createElement('div');
            card.className = `pile-polaroid${animate ? ' dropping' : ''}`;
            card.dataset.shot = i;
            card.style.cssText = `--r: ${tilt.r}deg; --x: ${tilt.x}px; --y: ${tilt.y}px`;
            card.innerHTML = `${shot.video
                ? `<video src="${shot.video}" muted loop playsinline autoplay aria-label="${shot.alt}"></video>`
                : `<img src="${shot.photo}" alt="${shot.alt}" />`}
                <span class="polaroid-caption">${shot.caption}</span>`;
            sizeByArea(card, $('img, video', card));
            pile.appendChild(card);
        }
        card.style.zIndex = ++top;
    }

    function activate(el) {
        if (active === el) return;
        deactivate();
        active = el;
        el.classList.add('active');
        addToPile(+el.dataset.shot);
    }

    function deactivate() {
        active?.classList.remove('active');
        active = null;
    }

    notes.addEventListener('pointerover', e => {
        const el = e.target.closest('.note-trigger');
        if (el) activate(el);
    });
    notes.addEventListener('pointerout', e => {
        if (e.pointerType === 'mouse' && e.target.closest('.note-trigger')) deactivate();
    });
    notes.addEventListener('focusin', e => {
        const el = e.target.closest('.note-trigger');
        if (el) activate(el);
    });
    notes.addEventListener('focusout', deactivate);

    // Start with the first place already on the pile so the column isn't empty
    addToPile(0, false);
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
