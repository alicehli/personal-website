/**
 * Home page: hero with contact links, travel notes and photo pile.
 */

import data from './data.js';
import { icon } from './icons.js';
import { $, linkAttrs } from './dom.js';

const CYCLE_OUT_MS = 220;   // how long the old word takes to slide out
const CYCLE_EVERY_MS = 2800;   // auto-rotation; a click moves on now and restarts the count
const FIRST_PHOTO_DELAY_MS = 1000;   // matches the hero text fading in

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
}

const accent = (text, color) => `<span class="accent-${color}">${text}</span>`;

const contactLink = link => {
    const href = link.email ? `mailto:${link.email}` : link.href;
    return `<a ${linkAttrs(href)} class="contact-link" title="${link.email || link.label}">${icon(link.icon)}</a>`;
};

function renderHero() {
    const { hero } = data;

    $('.hero-subtitle').textContent = hero.subtitle;
    $('.hero-title').innerHTML =
        `${hero.title.text} ${hero.title.accents.map(a => accent(a.text, a.color)).join(' / ')}`;

    renderDescription(hero.description);

    $('.hero-meta').innerHTML = `
        <span class="contact-links">${data.contactLinks.map(contactLink).join('')}</span>
    `;
}

/**
 * Stretchtext: a short sentence whose coloured phrases open up into the longer
 * version when clicked.
 */
function renderDescription({ text, expand }) {
    const description = $('.hero-description');
    description.innerHTML = text.replace(/\{(\w+)\}/g, (_, key) =>
        `<button class="stretch accent-${expand[key].color}" type="button" data-key="${key}">${expand[key].label}</button>`);

    description.addEventListener('click', e => {
        const button = e.target.closest('.stretch');
        if (!button) return;
        // The phrase keeps its colour; the words it opens up into are plain
        const { label, more, color } = expand[button.dataset.key];
        const grown = document.createElement('span');
        grown.className = 'stretched';
        grown.innerHTML = `${accent(label, color)}${more.slice(label.length)}`;
        button.replaceWith(grown);
    });
}

/**
 * "I'm a ___ in NYC." The word slides out and the next one in every few seconds,
 * or on click. The button is as wide as the longest word, so the line never moves.
 */
function renderIntro() {
    const { prefix, words, suffix } = data.hero.intro;
    const intro = $('.hero-intro');
    const sizers = words.map(w => `<span class="cycle-sizer" aria-hidden="true">${w}</span>`).join('');
    intro.innerHTML = `${prefix}<button class="cycle-word" type="button" title="Click for another">${sizers}<span class="cycle-current" aria-live="polite">${words[0]}</span></button>${suffix}`;

    const button = $('.cycle-word', intro);
    const word = $('.cycle-current', button);
    let index = 0;
    let timer;

    // Rotates on its own (unless the visitor prefers less motion); a click
    // moves on straight away and restarts the countdown
    const autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const restartTimer = () => {
        clearInterval(timer);
        if (autoRotate) timer = setInterval(next, CYCLE_EVERY_MS);
    };

    function next() {
        if (button.classList.contains('leaving')) return;
        button.classList.add('leaving');
        setTimeout(() => {
            index = (index + 1) % words.length;
            word.textContent = words[index];
            button.classList.toggle('pink', index % 2 === 1);   // alternate green and pink
            button.classList.replace('leaving', 'entering');
            // Two frames so the browser paints the entering position before sliding in
            requestAnimationFrame(() => requestAnimationFrame(() => button.classList.remove('entering')));
        }, CYCLE_OUT_MS);
    }

    button.addEventListener('click', () => {
        next();
        restartTimer();
    });
    restartTimer();
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
 * Travel and type 2 fun lists, with a photo pile in the hero's right-hand column.
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
    `;

    // The pile sits beside the whole hero, not just these lists (see .hero-content)
    const pile = document.createElement('div');
    pile.className = 'photo-pile';
    notes.after(pile);
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

    // Drop and develop the first place once the text has faded in, so the column
    // isn't empty (unless a hover has already put something there)
    setTimeout(() => {
        if (!pile.children.length) addToPile(0);
    }, FIRST_PHOTO_DELAY_MS);
}
