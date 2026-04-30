/**
 * Alice Li Portfolio - JavaScript
 * Handles navigation, smooth scrolling, content rendering, and interactive features
 */

(function() {
    'use strict';

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        initThemeToggle();
        renderContent();
        initNavigation();
        initScrollTracking();
        console.log('Alice Portfolio initialized ✨');
    });

    /**
     * Initialize light/dark theme toggle
     */
    function initThemeToggle() {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        // Determine initial theme
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', theme);
        btn.innerHTML = theme === 'dark' ? icons.sun : icons.moon;

        btn.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            btn.innerHTML = next === 'dark' ? icons.sun : icons.moon;
        });
    }

    /**
     * Helper function to scroll to a section by ID
     */
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            return true;
        }
        return false;
    }

    /**
     * Initialize navigation with smooth scrolling
     */
    function initNavigation() {
        const navContainer = document.querySelector('.nav-links');
        if (!navContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navContainer.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link');
            if (!link) return;

            const href = link.getAttribute('href');

            // Check if the link points to a hash on the current page
            if (href.includes('#')) {
                const [linkPage, linkHash] = href.split('#');
                const onSamePage = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html') || linkPage === '';
                if (onSamePage && linkHash) {
                    e.preventDefault();
                    if (scrollToSection(linkHash)) {
                        updateActiveNavLink(link);
                    }
                }
            }
            // Non-hash links (e.g. "writing.html") navigate normally
        });
    }

    /**
     * Track scroll position and update active navigation link
     */
    function initScrollTracking() {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveNavOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 80;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.id;
            }
        });
        
        if (current) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const activeLink = document.querySelector(`.nav-link[href="${currentPage}#${current}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    }

    /**
     * Update active navigation link
     */
    function updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }


    /**
     * Helper function for safe DOM updates
     */
    function updateElement(selector, content, method = 'innerHTML') {
        const element = document.querySelector(selector);
        if (element && content !== undefined) {
            element[method] = content;
        }
        return element;
    }

    /**
     * Render all content from data.js
     */
    function renderContent() {
        if (typeof portfolioData === 'undefined') {
            console.error('portfolioData not found. Make sure data.js is loaded.');
            return;
        }

        renderNavigation();
        renderHero();
        renderReading();
        renderContact();
        renderTripsGrid();
        renderGallery();
    }

    /**
     * Render navigation links
     */
    function renderNavigation() {
        const navLinksContainer = document.querySelector('.nav-links');
        if (!navLinksContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;

        navLinksContainer.innerHTML = portfolioData.navLinks.map(link => {
            let isActive = false;
            if (link.href.includes('#')) {
                // Link with hash (e.g. "index.html#home") — active if we're on that page and hash matches
                const [linkPage, linkHash] = link.href.split('#');
                const onSamePage = currentPage === linkPage || (currentPage === '' && linkPage === 'index.html');
                if (onSamePage) {
                    isActive = currentHash === '#' + linkHash || (!currentHash && linkHash === 'home');
                }
            } else {
                // Plain page link (e.g. "writing.html") — active if we're on that page
                isActive = currentPage === link.href;
                // gallery.html is a sub-page of photography
                if (link.href === 'photography.html' && currentPage === 'gallery.html') {
                    isActive = true;
                }
            }
            return `
                <li>
                    <a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">
                        <span class="nav-icon">${icons[link.icon] || ''}</span>
                        ${link.label}
                    </a>
                </li>
            `;
        }).join('');
    }

    /**
     * Render hero section
     */
    function renderHero() {
        const { hero, heroPhotos, personal } = portfolioData;

        // Hero content
        updateElement('.hero-subtitle', hero.subtitle, 'textContent');
        updateElement('.hero-title', `
            ${hero.title.text} 
            <span class="accent-${hero.title.accent1.color}">${hero.title.accent1.text}</span> / 
            <span class="accent-${hero.title.accent2.color}">${hero.title.accent2.text}</span>
        `);
        
        if (hero.description) {
            updateElement('#hero-description', hero.description, 'textContent');
        }
        
        updateElement('.hero-meta', `
            <span>
                <span class="icon-inline">${icons.mapPin}</span>
                ${personal.location}
            </span>
            <span>• ${personal.tagline}</span>
        `);

        // Initialize interactive features
        initTypewriter();
        initCurrentlyWorkingBubble();

        // Hero photos with flip-card functionality
        const photoGrid = document.querySelector('.photo-grid');
        if (photoGrid) {
            photoGrid.innerHTML = heroPhotos.map((photo, index) => `
                <div class="photo-item-flip" data-index="${index}">
                    <div class="photo-item-inner">
                        <div class="photo-item-front">
                            ${photo.featured ? '<div class="featured-badge">Featured photo</div>' : ''}
                            <img src="${photo.src}" alt="${photo.alt}" />
                            <div class="photo-overlay">
                                <div class="photo-title">${photo.title}</div>
                                <div class="photo-meta">${photo.meta}</div>
                            </div>
                        </div>
                        <div class="photo-item-back">
                            <div class="photo-back-content">
                                <div class="photo-back-title">${photo.title}</div>
                                <div class="photo-back-description">${photo.description || 'No description available.'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add click handlers for flip functionality
            const flipCards = photoGrid.querySelectorAll('.photo-item-flip');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });
        }
    }

    /**
     * Render reading section with horizontal scrolling book carousel
     */
    function renderReading() {
        const readingWidget = document.querySelector('.reading-widget');
        if (!readingWidget) return;

        const books = portfolioData.favoriteBooks || [];

        if (books.length === 0) {
            readingWidget.innerHTML = `
                <div class="reading-widget-placeholder">
                    <p>No books to display. Add your favorite books to data.js</p>
                </div>
            `;
            return;
        }

        readingWidget.innerHTML = `
            <div class="books-carousel-container">
                <div class="books-carousel">
                    ${books.map(book => `
                        <div class="book-item-carousel">
                            <a href="${book.goodreadsUrl || '#'}"
                               class="book-link"
                               ${book.goodreadsUrl ? '' : 'onclick="return false;"'}>
                                <div class="book-cover-carousel">
                                    ${book.coverUrl
                                        ? `<img src="${book.coverUrl}" alt="${book.title}" loading="lazy" />`
                                        : `<div class="book-cover-placeholder">${book.title.charAt(0)}</div>`
                                    }
                                </div>
                                <div class="book-info-carousel">
                                    <div class="book-title-carousel" title="${book.title}">${book.title}</div>
                                    <div class="book-author-carousel">${book.author}</div>
                                </div>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Initialize typewriter effect for rotating text
     * Only the middle word changes while prefix and suffix remain static
     */
    function initTypewriter() {
        const typewriterElement = document.getElementById('typewriter-text');
        if (!typewriterElement || !portfolioData.hero.typewriter) return;

        const { prefix, words, suffix = '' } = portfolioData.hero.typewriter;
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 50;
        let deletingSpeed = 30;
        let pauseTime = 2000;

        function type() {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                // Delete characters from the word
                const displayWord = currentWord.substring(0, currentCharIndex - 1);
                typewriterElement.innerHTML = prefix + displayWord + suffix + '<span class="typewriter-cursor"></span>';
                currentCharIndex--;
                typingSpeed = deletingSpeed;
            } else {
                // Type characters into the word
                const displayWord = currentWord.substring(0, currentCharIndex + 1);
                typewriterElement.innerHTML = prefix + displayWord + suffix + '<span class="typewriter-cursor"></span>';
                currentCharIndex++;
                typingSpeed = 50;
            }

            if (!isDeleting && currentCharIndex === currentWord.length) {
                // Finished typing, pause then start deleting
                typewriterElement.innerHTML = prefix + currentWord + suffix + '<span class="typewriter-cursor"></span>';
                typingSpeed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                // Finished deleting, move to next word
                typewriterElement.innerHTML = prefix + suffix + '<span class="typewriter-cursor"></span>';
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before starting next word
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing
        type();
    }

    /**
     * Initialize rotating bubble for "Currently working on" items with slot machine effect
     */
    function initCurrentlyWorkingBubble() {
        const bubbleElement = document.getElementById('currently-working-bubble');
        if (!bubbleElement || !portfolioData.hero.currentlyWorkingOn) return;

        const items = portfolioData.hero.currentlyWorkingOn;
        let currentItemIndex = 0;
        let isAutoRotating = true;
        let autoRotationInterval = null;
        let isAnimating = false;

        // Initialize HTML structure
        bubbleElement.innerHTML = `
            <span class="bubble-label">Currently working on:</span>
            <div class="bubble-text-wrapper">
                <span class="bubble-text slot-active">${items[0]}</span>
            </div>
        `;

        const textWrapper = bubbleElement.querySelector('.bubble-text-wrapper');
        let currentTextElement = textWrapper.querySelector('.bubble-text');

        function updateBubble(immediate = false) {
            if (isAnimating) return;
            
            // Move to next item
            currentItemIndex = (currentItemIndex + 1) % items.length;
            const nextItem = items[currentItemIndex];
            isAnimating = true;

            // Create new text element that will enter from bottom
            const newTextElement = document.createElement('span');
            newTextElement.className = 'bubble-text slot-enter';
            newTextElement.textContent = nextItem;
            textWrapper.appendChild(newTextElement);

            // Trigger slot machine animation
            // First, exit current text
            requestAnimationFrame(() => {
                currentTextElement.classList.remove('slot-active');
                currentTextElement.classList.add('slot-exit');
            });

            // Then, after a brief delay, enter new text (to avoid overlap)
            setTimeout(() => {
                requestAnimationFrame(() => {
                    newTextElement.classList.remove('slot-enter');
                    newTextElement.classList.add('slot-active');
                });
            }, immediate ? 100 : 200);

            // Clean up old element after animation
            const animationDuration = immediate ? 300 : 600;
            setTimeout(() => {
                if (currentTextElement && currentTextElement.parentNode) {
                    currentTextElement.remove();
                }
                currentTextElement = newTextElement;
                isAnimating = false;
            }, animationDuration);
        }

        // Click handler to advance one item
        bubbleElement.addEventListener('click', function() {
            // Reset auto-rotation timer so it waits a full interval after the click
            if (autoRotationInterval) {
                clearInterval(autoRotationInterval);
            }
            updateBubble(true);
            autoRotationInterval = setInterval(updateBubble, 3000);
        });

        // Start rotation after initial delay (display first item for a bit)
        setTimeout(() => {
            if (isAutoRotating) {
                autoRotationInterval = setInterval(updateBubble, 3000); // Change every 3 seconds
            }
        }, 2500);
    }

    /**
     * Render contact section
     */
    function renderContact() {
        const { personal } = portfolioData;
        updateElement('.contact-links', `
            <a href="mailto:${personal.email}" class="contact-link contact-link-icon" title="${personal.email}">
                ${icons.mail}
            </a>
            <a href="${personal.linkedin}" class="contact-link contact-link-icon" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                ${icons.linkedin}
            </a>
            <a href="${personal.github}" class="contact-link contact-link-icon" target="_blank" rel="noopener noreferrer" title="GitHub">
                ${icons.github}
            </a>
            <a href="${personal.goodreads}" class="contact-link contact-link-icon" target="_blank" rel="noopener noreferrer" title="Goodreads">
                ${icons.goodreads}
            </a>
        `);
    }

    /**
     * Fetch the photo list for a trip from its photos.json manifest
     */
    function fetchTripPhotos(folder) {
        return fetch(folder + '/photos.json')
            .then(function(res) { return res.json(); })
            .catch(function() { return []; });
    }

    /**
     * Render trips grid on photography.html
     */
    function renderTripsGrid() {
        const grid = document.querySelector('.trips-grid');
        if (!grid) return;

        const trips = portfolioData.photoTrips || [];

        grid.innerHTML = trips.map(function(trip) {
            const cover = trip.cover ? trip.folder + '/' + trip.cover : '';
            return '<a href="gallery.html?trip=' + trip.slug + '" class="trip-card">' +
                '<img src="' + cover + '" alt="' + trip.title + '" loading="lazy" />' +
                '<div class="trip-card-overlay">' +
                    '<h3 class="trip-card-title">' + trip.title + '</h3>' +
                    '<span class="trip-card-year">' + trip.year + '</span>' +
                '</div>' +
            '</a>';
        }).join('');
    }

    /**
     * Render masonry gallery on gallery.html
     */
    function renderGallery() {
        const gallery = document.querySelector('.masonry-gallery');
        if (!gallery) return;

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('trip');
        const trips = portfolioData.photoTrips || [];
        const trip = trips.find(t => t.slug === slug);

        if (!trip) {
            gallery.innerHTML = '<p class="writing-placeholder">Trip not found.</p>';
            return;
        }

        // Update page title and header
        document.title = `${trip.title} - Alice Li`;
        updateElement('.gallery-subtitle', `${trip.title}, ${trip.year}`, 'textContent');
        updateElement('.gallery-title', trip.title, 'textContent');

        fetchTripPhotos(trip.folder).then(function(photos) {
            const photoPaths = photos.map(p => `${trip.folder}/${p}`);

            gallery.innerHTML = photoPaths.map((src, i) => `
                <div class="masonry-item">
                    <img src="${src}" alt="${trip.title} photo ${i + 1}" loading="lazy" data-index="${i}" />
                </div>
            `).join('');

            // Click to open lightbox
            gallery.addEventListener('click', function(e) {
                const img = e.target.closest('img[data-index]');
                if (!img) return;
                openLightbox(photoPaths, parseInt(img.dataset.index, 10));
            });
        });
    }

    /**
     * Full-screen lightbox with arrow navigation
     */
    function openLightbox(photos, startIndex) {
        let current = startIndex;

        // Create overlay
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

        function show(index) {
            current = index;
            img.src = photos[current];
        }

        function next() {
            show((current + 1) % photos.length);
        }

        function prev() {
            show((current - 1 + photos.length) % photos.length);
        }

        function close() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        }

        function onKey(e) {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        }

        document.addEventListener('keydown', onKey);

        overlay.querySelector('.lightbox-close').addEventListener('click', close);
        overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
        overlay.querySelector('.lightbox-next').addEventListener('click', next);

        // Click on backdrop (not on img or buttons) to close
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });
    }

})();
