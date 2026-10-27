/**
 * Full-screen photo viewer: arrow keys / buttons to navigate, Esc or backdrop click to close.
 */

export function openLightbox(photos, startIndex) {
    let current = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-arrow lightbox-prev" aria-label="Previous">&lsaquo;</button>
        <img class="lightbox-img" src="${photos[current]}" alt="Photo" />
        <button class="lightbox-arrow lightbox-next" aria-label="Next">&rsaquo;</button>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const img = overlay.querySelector('.lightbox-img');
    const step = delta => {
        current = (current + delta + photos.length) % photos.length;
        img.src = photos[current];
    };

    function close() {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
    }

    const keys = { Escape: close, ArrowRight: () => step(1), ArrowLeft: () => step(-1) };
    function onKey(e) {
        keys[e.key]?.();
    }
    document.addEventListener('keydown', onKey);

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
    overlay.querySelector('.lightbox-next').addEventListener('click', () => step(1));
    overlay.addEventListener('click', e => {
        if (e.target === overlay) close();
    });
}
