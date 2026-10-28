/**
 * Entry point. Every page loads this module; each renderer is a no-op
 * when its container isn't on the current page.
 */

import { initTheme } from './theme.js';
import { renderNav } from './nav.js';
import { renderHome } from './home.js';
import { renderShelf } from './shelf.js';
import { renderTrips, renderGallery } from './photography.js';

initTheme();
renderNav();
renderHome();
renderShelf();
renderTrips();
renderGallery();
