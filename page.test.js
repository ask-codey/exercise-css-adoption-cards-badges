// Checks the positioning and stacking rules in your styles.css: it reads index.html and styles.css the way a browser
// does, then asks each part of the adoption list for its position, its offsets (top, right, bottom, left) and its
// z-index. It doesn't measure anything on screen, so look at the page too: the README's checklist covers that.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const { test } = require('node:test');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const read = (file) => (existsSync(path.join(__dirname, file)) ? readFileSync(path.join(__dirname, file), 'utf8') : '');
const html = read('index.html');
const css = read('styles.css');

// A browser loads styles.css through the link line. The checks have no web server, so they add the file to the page
// themselves, after checking that the link line is there.
const { window } = new JSDOM(html);
const { document } = window;
const sheet = document.createElement('style');
sheet.textContent = css;
document.head.append(sheet);

const style = (element) => window.getComputedStyle(element);
const all = (selector) => [...document.querySelectorAll(selector)];
const one = (selector) => document.querySelector(selector);

// Fails a check with a plain message, so the output shows what to fix and no stack trace to scroll past.
function check(passed, message) {
  if (!passed) {
    const problem = new Error(message);
    problem.stack = `Not yet: ${message}`;
    throw problem;
  }
}

// One offset (top, right, bottom or left), whether it was written on its own or with inset.
const SIDES = ['top', 'right', 'bottom', 'left'];
function offset(element, side) {
  const own = style(element)[side];
  if (own && own !== 'auto') return own;
  const inset = style(element).inset;
  if (!inset || inset === 'auto') return 'auto';
  const parts = inset.split(/\s+/);
  const [top, right = top, bottom = top, left = right] = parts;
  return { top, right, bottom, left }[side];
}
const isSet = (element, side) => offset(element, side) !== 'auto';
const isZero = (value) => /^0(px|%|rem|em)?$/.test(value);

// Which of two overlapping elements is in front, the way a browser decides it: compare the z-index of the outermost
// groups (stacking contexts) they don't share; when those are equal, the one later in the HTML is in front.
function startsAGroup(element) {
  const s = style(element);
  const positioned = s.position !== 'static';
  if (s.position === 'fixed' || s.position === 'sticky') return true;
  if (positioned && s.zIndex !== 'auto') return true;
  if (s.opacity !== '' && Number(s.opacity) < 1) return true;
  if (s.transform && s.transform !== 'none') return true;
  if (s.isolation === 'isolate') return true;
  const parent = element.parentElement;
  return Boolean(parent && /flex|grid/.test(style(parent).display) && s.zIndex !== 'auto');
}
function layers(element) {
  const list = [element];
  for (let e = element.parentElement; e && e !== document.body; e = e.parentElement) {
    if (startsAGroup(e)) list.unshift(e);
  }
  return list;
}
const zOf = (element) => (style(element).zIndex === 'auto' ? 0 : Number(style(element).zIndex));
function isInFront(a, b) {
  const la = layers(a);
  const lb = layers(b);
  let i = 0;
  while (i < la.length && i < lb.length && la[i] === lb[i]) i++;
  const x = la[Math.min(i, la.length - 1)];
  const y = lb[Math.min(i, lb.length - 1)];
  if (zOf(x) !== zOf(y)) return zOf(x) > zOf(y);
  return Boolean(y.compareDocumentPosition(x) & window.Node.DOCUMENT_POSITION_FOLLOWING);
}
const zText = (element) => `z-index ${style(element).zIndex}`;

const cards = all('.pet-card');
const badges = all('.badge');
const overlay = one('.pending-overlay');
const header = one('.site-header');
const button = one('.adopt-button');

test('1) index.html links styles.css, and has the adoption list', () => {
  check(html, 'There is no index.html in this folder. Check that you opened the exercise folder, the one with package.json in it.');
  const link = one('link[rel="stylesheet"]');
  check(link && link.getAttribute('href') === 'styles.css',
    'index.html no longer links styles.css. Put this line back inside <head>: <link rel="stylesheet" href="styles.css">');
  check(cards.length === 6 && badges.length === 3 && overlay && header && button,
    'index.html has changed: it should have six pet cards, three New! badges, one Adoption pending overlay, the header and the Adopt today button. Download a fresh copy of index.html if you need to.');
});

test('2) every pet card is the frame its badge is placed in', () => {
  for (const card of cards) {
    const name = card.querySelector('h2').textContent;
    check(style(card).position === 'relative',
      `${name}'s card has position: ${style(card).position}. A badge with position: absolute is placed in its nearest positioned ancestor, so give .pet-card position: relative.`);
  }
});

test('3) every New! badge sits in the top right corner of its card', () => {
  for (const badge of badges) {
    const name = badge.closest('.pet-card').querySelector('h2').textContent;
    check(style(badge).position === 'absolute',
      `The badge on ${name}'s card has position: ${style(badge).position}. Give .badge position: absolute, so it leaves the flow and is placed in its card.`);
    check(isSet(badge, 'top') && isSet(badge, 'right'),
      `The badge on ${name}'s card has no top and right offsets yet (top: ${offset(badge, 'top')}, right: ${offset(badge, 'right')}). Set top and right to 8px, on their own or with inset.`);
  }
});

test('4) the Adoption pending overlay covers the whole photo', () => {
  const photo = overlay.closest('.photo');
  check(style(photo).position === 'relative',
    `Clover's .photo frame has position: ${style(photo).position}. Give .photo position: relative, so the overlay is placed in the photo and not in the card.`);
  check(style(overlay).position === 'absolute',
    `The overlay has position: ${style(overlay).position}. Give .pending-overlay position: absolute.`);
  const missing = SIDES.filter((side) => !isZero(offset(overlay, side)));
  check(missing.length === 0,
    `The overlay doesn't reach every edge of the photo yet: ${missing.map((side) => `${side} is ${offset(overlay, side)}`).join(', ')}. All four offsets should be 0, and one property sets them all at once.`);
});

test('5) the New! badge is in front of the Adoption pending overlay', () => {
  const badge = overlay.closest('.pet-card').querySelector('.badge');
  check(isInFront(badge, overlay),
    `On Clover's card, the overlay covers the badge (badge: ${zText(badge)}, overlay: ${zText(overlay)}). The overlay comes later in the HTML, so it wins a tie. Give the badge a higher z-index than the overlay.`);
});

test('6) the header sticks to the top of the window', () => {
  check(style(header).position === 'sticky',
    `The header has position: ${style(header).position}. Give .site-header position: sticky.`);
  check(isSet(header, 'top'),
    'The header is sticky but has no top value, so it never sticks. Give it top: 0.');
});

test('7) the header is in front of every card, badge and overlay that scrolls under it', () => {
  for (const part of [...cards, ...badges, overlay]) {
    const name = part.closest('.pet-card').querySelector('h2').textContent;
    const what = part.classList.contains('pet-card') ? `${name}'s card` : part === overlay ? 'the Adoption pending overlay' : `the badge on ${name}'s card`;
    check(isInFront(header, part),
      `When the list scrolls under the header, ${what} shows in front of it (header: ${zText(header)}, ${what}: ${zText(part)}). Give the header a z-index higher than everything on the cards.`);
  }
});

test('8) the Adopt today button stays in the bottom right corner of the window', () => {
  check(style(button).position === 'fixed',
    `The Adopt today button has position: ${style(button).position}. Which position value keeps an element in one spot on screen while the page scrolls?`);
  check(isSet(button, 'bottom') && isSet(button, 'right'),
    `The button has no bottom and right offsets yet (bottom: ${offset(button, 'bottom')}, right: ${offset(button, 'right')}). Set both to 24px.`);
});

test('9) the Adopt today button is in front of everything, the header too', () => {
  check(style(button).position !== 'static' && style(button).zIndex !== 'auto',
    `The Adopt today button has position: ${style(button).position} and ${zText(button)}. Make it fixed first (check 8), then give it a z-index higher than the header's.`);
  for (const part of [header, ...badges, overlay]) {
    const what = part === header ? 'the header' : part === overlay ? 'the Adoption pending overlay' : 'a New! badge';
    check(isInFront(button, part),
      `${what[0].toUpperCase()}${what.slice(1)} shows in front of the Adopt today button (button: ${zText(button)}, ${what}: ${zText(part)}). Give the button the highest z-index on the page.`);
  }
});
