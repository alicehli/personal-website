/**
 * Alice Li Portfolio - JavaScript
 * Handles navigation, smooth scrolling, content rendering, and interactive features
 */

(function() {
    'use strict';

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        renderContent();
        initNavigation();
        initScrollTracking();
        console.log('Alice Portfolio initialized ✨');
    });

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

        navContainer.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                if (scrollToSection(targetId)) {
                    updateActiveNavLink(link);
                }
            }
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
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
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
    async function renderContent() {
        if (typeof portfolioData === 'undefined') {
            console.error('portfolioData not found. Make sure data.js is loaded.');
            return;
        }

        renderNavigation();
        renderHero();
        await renderReading();
        renderContact();
    }

    /**
     * Render navigation links
     */
    function renderNavigation() {
        const navLinksContainer = document.querySelector('.nav-links');
        if (!navLinksContainer) return;

        const currentHash = window.location.hash || '#home';

        navLinksContainer.innerHTML = portfolioData.navLinks.map(link => {
            const isActive = link.href === currentHash;
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
    async function renderReading() {
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

        // Show loading state
        readingWidget.innerHTML = `
            <div class="books-carousel-loading">
                <p>Loading your favorite books...</p>
            </div>
        `;

        try {
            // Fetch book data from Google Books API
            const booksData = await Promise.all(
                books.map(async (book) => {
                    try {
                        const bookInfo = await fetchBookFromGoogleBooks(book.title, book.author);
                        return {
                            ...book,
                            coverUrl: bookInfo.thumbnail || '',
                            googleBooksUrl: bookInfo.infoLink || '',
                            description: bookInfo.description || ''
                        };
                    } catch (error) {
                        console.warn(`Failed to fetch data for "${book.title}":`, error);
                        return {
                            ...book,
                            coverUrl: '',
                            googleBooksUrl: '',
                            description: ''
                        };
                    }
                })
            );

            // Render the carousel
            readingWidget.innerHTML = `
                <div class="books-carousel-container">
                    <div class="books-carousel">
                        ${booksData.map(book => `
                            <div class="book-item-carousel">
                                <a href="${book.goodreadsUrl || book.googleBooksUrl || '#'}" 
                                   class="book-link" 
                                   ${book.goodreadsUrl ? '' : book.googleBooksUrl ? 'target="_blank" rel="noopener noreferrer"' : ''}
                                   ${book.goodreadsUrl || book.googleBooksUrl ? '' : 'onclick="return false;"'}>
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
        } catch (error) {
            console.error('Error loading books:', error);
            readingWidget.innerHTML = `
                <div class="reading-widget-placeholder">
                    <p>Error loading books. Please try again later.</p>
                </div>
            `;
        }
    }

    /**
     * Fetch book data from Google Books API
     */
    async function fetchBookFromGoogleBooks(title, author) {
        // Construct search query
        const query = `${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                const volumeInfo = item.volumeInfo;
                
                // Get thumbnail image (prefer medium, fallback to small)
                const thumbnail = volumeInfo.imageLinks?.thumbnail 
                    ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://').replace('&edge=curl', '')
                    : (volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://') || '');
                
                return {
                    thumbnail: thumbnail,
                    infoLink: volumeInfo.infoLink || '',
                    description: volumeInfo.description || ''
                };
            }
            
            return { thumbnail: '', infoLink: '', description: '' };
        } catch (error) {
            console.warn(`Error fetching book "${title}":`, error);
            return { thumbnail: '', infoLink: '', description: '' };
        }
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

})();
