#!/usr/bin/env node
// Pulls my Goodreads "read" shelf from its RSS feed (the API is gone) and writes
// data/books.json for the homepage bookshelf. Covers are saved locally under
// images/book-covers/goodreads/ so the page doesn't depend on Goodreads' CDN,
// and so the browser can read their colours for the spines.
//
// Usage: node build-books.mjs                 (fetches the live feed)
//        node build-books.mjs feed1.xml ...   (uses feed pages saved earlier,
//                                              e.g. when Goodreads is down)

import { mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const FEED = 'https://www.goodreads.com/review/list_rss/146347228';
const SINCE = '2023-01-01';         // first day shown on the shelf
const COVER_DIR = 'images/book-covers/goodreads';
const PER_PAGE = 200;               // the feed's maximum
const COVER_MAX = 300;              // px on the longest side; spines only need a few colours
// Goodreads answers 404 to Node's default User-Agent
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (personal site book sync)' };

const field = (item, tag) => {
    const m = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
    return m ? m[1].trim() : '';
};

const decode = s => s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const isoDate = s => (s ? new Date(s).toISOString().slice(0, 10) : '');

async function fetchShelf(shelf) {
    const items = [];
    for (let page = 1; ; page++) {
        const res = await fetch(`${FEED}?shelf=${shelf}&per_page=${PER_PAGE}&page=${page}`, { headers: HEADERS });
        if (!res.ok) throw new Error(`Goodreads returned ${res.status} for page ${page}`);
        const pageItems = (await res.text()).match(/<item>[\s\S]*?<\/item>/g) || [];
        items.push(...pageItems);
        if (pageItems.length < PER_PAGE) return items;
    }
}

// Spine colour for a cover: shrink it to a few pixels with sips, average them,
// and lean toward the most saturated pixel so busy covers don't all turn brown
async function spineColor(path) {
    const tmp = `${path}.bmp`;
    execFileSync('sips', ['-z', '6', '4', '-s', 'format', 'bmp', path, '--out', tmp], { stdio: 'ignore' });
    const bmp = await readFile(tmp);
    await rm(tmp);
    const start = bmp.readUInt32LE(10);
    const bytesPerPixel = bmp.readUInt16LE(28) / 8;
    const pixels = [];
    for (let i = start; i + 2 < bmp.length; i += bytesPerPixel) {
        pixels.push([bmp[i + 2], bmp[i + 1], bmp[i]]);   // stored as BGR(A)
    }
    const avg = [0, 1, 2].map(c => pixels.reduce((s, p) => s + p[c], 0) / pixels.length);
    const sat = p => Math.max(...p) - Math.min(...p);
    const vivid = pixels.reduce((a, b) => (sat(b) > sat(a) ? b : a));
    const rgb = sat(vivid) > 90 ? avg.map((v, c) => v * 0.45 + vivid[c] * 0.55) : avg;
    const hex = '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    const light = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2] > 150;
    return { color: hex, ink: light ? '#1a1a1a' : '#fafafa' };
}

const exists = path => access(path).then(() => true, () => false);

async function saveCover(id, url) {
    const path = `${COVER_DIR}/${id}.jpg`;
    if (!url || url.includes('nophoto')) return '';
    if (!(await exists(path))) {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return '';
        await writeFile(path, Buffer.from(await res.arrayBuffer()));
        // Some covers come back full size; shrink them the same way build-photos.sh does (macOS sips)
        execFileSync('sips', ['-Z', String(COVER_MAX), path], { stdio: 'ignore' });
    }
    return `/${path}`;
}

const savedFeeds = process.argv.slice(2);
const items = savedFeeds.length
    ? (await Promise.all(savedFeeds.map(f => readFile(f, 'utf8'))))
        .flatMap(xml => xml.match(/<item>[\s\S]*?<\/item>/g) || [])
    : await fetchShelf('read');
await mkdir(COVER_DIR, { recursive: true });
await mkdir('data', { recursive: true });

let undated = 0;
const books = [];
for (const item of items) {
    const read = isoDate(field(item, 'user_read_at'));
    if (!read) { undated++; continue; }
    if (read < SINCE) continue;

    const id = field(item, 'book_id');
    const pages = parseInt(field(item, 'num_pages'), 10);
    const cover = await saveCover(id, field(item, 'book_large_image_url'));
    books.push({
        id,
        title: decode(field(item, 'title')).replace(/\s*\([^)]*#[^)]*\)$/, ''),   // drop "(Series, #2)"
        author: decode(field(item, 'author_name')),
        rating: parseInt(field(item, 'user_rating'), 10) || 0,
        read,
        pages: Number.isFinite(pages) ? pages : null,
        cover,
        ...(cover ? await spineColor(cover.slice(1)) : { color: '#8a8a8a', ink: '#fafafa' }),
        url: `https://www.goodreads.com/book/show/${id}`,
    });
}

books.sort((a, b) => a.read.localeCompare(b.read));
await writeFile('data/books.json', JSON.stringify(books, null, 2) + '\n');

const perYear = Object.entries(Object.groupBy(books, b => b.read.slice(0, 4)))
    .map(([year, list]) => `${year}: ${list.length}`).join(', ');
console.log(`Wrote ${books.length} books (${perYear}).`);
if (undated) console.log(`Skipped ${undated} books with no "date read" on Goodreads.`);
