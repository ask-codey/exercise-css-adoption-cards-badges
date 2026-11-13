# Exercise: Badges and a Sticky Header

Exercise code for the lesson **Exercise: Badges and a Sticky Header** in the CSS in Depth course on [ask-codey.com](https://www.ask-codey.com).

Paws & Whiskers, a pet adoption shelter, has a page that lists every pet who is ready for a home. It already has its colors and fonts, but nothing is positioned yet: the New! badges sit in the flow of each card, the Adoption pending note sits under Clover's photo, and the header and the Adopt today button scroll away with the page. You'll write the rules in `styles.css` that put each one where it belongs and decide which one sits in front, and nine checks tell you when each one is doing its job.

## Before you start

You need VS Code with the Live Server extension, a current Chrome, Edge or Firefox, and Node.js 24 or newer, set up as in the lesson *Setup: VS Code, a Browser and Node.js*.

## What's here

- `index.html`: the adoption list: a header with the shelter's name and menu, six pet cards (three with a New! badge, and Clover's with an Adoption pending overlay on her photo), the Adopt today button and a footer. Ready to use: don't change it.
- `styles.css`: Part 1 holds the colors, fonts and spacing, ready to use. Part 2 is empty except for a comment that lists the rules to write. For you to finish.
- `images/`: drawings of the six pets, standing in for photos. Ready to use.
- `page.test.js`: the nine checks. You don't need to change this file.
- `package.json`: tells npm what the checks need (`jsdom`, which reads your page and stylesheet the way a browser does). Ready to use.
- `.gitignore`: keeps the `node_modules` folder that `npm install` makes out of Git. Ready to use.

## What to do

Open this folder in VS Code, right-click `index.html` and choose **Open with Live Server**. Then write each rule in Part 2 of `styles.css`, save, and look at the page:

1. **Pin the badges.** Each New! badge goes in the top right corner of its own card, 8 pixels down and 8 pixels in. The card needs to be the badge's frame first.
2. **Lay the overlay over Clover's photo.** The Adoption pending overlay covers the whole photo, edge to edge. This time the frame is the photo, `.photo`, not the card.
3. **Stick the header.** The header stays at the top of the window while the list scrolls under it.
4. **Fix the button.** Adopt today stays 24 pixels from the bottom and 24 pixels from the right of the window, wherever the visitor scrolls.
5. **Make a stacking plan.** Scroll the list and watch what overlaps what. The New! badge belongs in front of the overlay, the header in front of everything on the cards, and the Adopt today button in front of everything, the header too. Choose the z-index numbers yourself.

## Check your work

Open the terminal in VS Code (**Terminal > New Terminal**). Run this once, to install what the checks need:

```bash
npm install
```

Then run the checks whenever you like:

```bash
npm test
```

Each check prints one line: ✔ when it passes, ✖ when it doesn't yet. Before you write any rules, the first check passes (the page and its link line are already there) and the other eight fail. That's expected. Under **failing tests**, each one has a message that starts **Not yet:** and says what it found and what to look at, for example *Biscuit's card has position: static.* When the last lines say `pass 9` and `fail 0`, you're done.

## The checklist the checks can't do

The checks read your rules; they don't look at the screen. So look at the page in the browser and scroll it from top to bottom:

- Each New! badge sits in the top right corner of its own card, not piled up in a corner of the page.
- The Adoption pending overlay covers Clover's whole photo, and her New! badge still shows in front of it.
- The header stays at the top of the window, and no badge, overlay or card shows on top of it as they scroll under.
- The Adopt today button stays in the bottom right corner, in front of everything, and the last pets can still scroll up above it.

## Tips

- An element with `position: absolute` is placed in its nearest ancestor whose position isn't `static`. If every badge lands in the same corner of the page, its card isn't that ancestor yet.
- One property sets `top`, `right`, `bottom` and `left` at once.
- Sticky needs a `top` value. Without one it scrolls away like any other element.
- When two positioned boxes have the same z-index, the one later in the HTML is in front. The overlay comes after the badge in `index.html`, so a tie goes to the overlay.
- Right-click any part of the page and choose **Inspect** to see which rules the browser used. A declaration with a line through it lost to another rule.
- `npm test` checks the files you saved. A white dot on a file's tab in VS Code means it has changes you haven't saved yet.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Page Online for Free* walks through every screen.
