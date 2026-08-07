# Nutrezy Survey Website 🎈

A playful, animated landing page where visitors pick one of 10 floating
bubbles to answer a short Nutrezy survey. Built with plain **HTML, CSS,
and JavaScript** — no installs, no build tools, no frameworks.

This guide assumes you've never coded before. Every step is spelled out.

---

## 1. What's in this folder

```
nutrezy/
├── index.html              ← the page structure (text, layout)
├── style.css               ← all colours, fonts, animations
├── script.js               ← survey questions + interactive behaviour
├── google-apps-script.gs   ← paste into Google Sheets to collect responses (Section 7)
├── assets/                 ← images (logo, QR codes)
└── README.md               ← this file
```

---

## 2. How to run it on your computer

You don't need to install anything.

1. Download/unzip this whole `nutrezy` folder onto your computer.
2. Double-click **`index.html`**.
3. It opens in your default web browser (Chrome, Safari, Edge, etc.) and
   the whole site works right there — no server needed.

If clicking a bubble doesn't open a popup, it usually means the browser
blocked local scripts. Just try a different browser (Chrome works best),
or skip ahead to Section 8 and view it live on GitHub Pages instead.

---

## 3. How to edit the survey questions

All 10 surveys live near the top of **`script.js`**, inside something
called `SURVEYS`. Open `script.js` in any text editor (Notepad,
TextEdit, or VS Code) and look for a block like this:

```js
{
  id: 1,
  bubble: "Snacks ;) ?",              // text shown on the floating circle
  title: "Healthy Snacking Habits",   // title inside the popup
  objective: "Understand overall snacking behaviour.",
  questions: [
    { type: "radio", text: "How often do you consume packaged snacks?",
      options: ["Daily", "3–5 times/week", "1–2 times/week", "Rarely"] },
    ...
  ]
}
```

- To change wording: edit the text inside the quotes `" "`.
- To change answer choices: edit the list inside `options: [ ]`,
  separating each choice with a comma.
- `type` controls how the question is shown:
  - `"radio"` → pick one (round buttons)
  - `"checkbox"` → pick multiple
  - `"dropdown"` → a select menu
  - `"text"` → a single-line answer box
  - `"textarea"` → a multi-line answer box
- Each survey needs exactly one `objective` line and any number of
  questions — add or remove question blocks by copying the `{ ... }`
  pattern.

**Tip:** always keep the commas between items, and matching curly
braces `{ }` / square brackets `[ ]`. If the page stops working after
an edit, undo your last change and try again more carefully — a missing
comma is the most common cause.

---

## 4. How to change colours

Open **`style.css`** and look at the very top for a section called
`:root`. All the colours are named there, e.g.:

```css
--peach:      #FFD9C2;
--light-yellow: #FFF3B0;
--mint:       #C8F4DE;
```

Change the 6-digit code (a "hex colour") to any colour you like — try
[htmlcolorcodes.com](https://htmlcolorcodes.com) to pick new ones and
copy their hex code. Every part of the site (background, circles,
buttons, footer) automatically updates because they all reference
these same named colours.

---

## 5. How to replace the logo

1. Save your real Nutrezy logo as a PNG or SVG with a **transparent
   background** if possible.
2. Rename the file to exactly: `nutrezy-logo.png`
3. Drop it into the `assets/` folder, replacing the placeholder file
   that's already there.

The header will automatically pick it up — no code changes needed.
(If your file is an SVG, name it `nutrezy-logo.svg` instead and update
the `src="assets/nutrezy-logo.png"` line in `index.html` to match.)

---

## 6. How to replace the QR codes

The footer currently uses the two QR codes cropped from the image you
uploaded. To swap them for new ones:

1. Save your new QR code images.
2. Name them exactly `instagram-qr.png` and `linkedin-qr.png`.
3. Put them in the `assets/` folder, overwriting the old files.

---

## 7. Collecting name, phone, and email — and sending responses to a Google Sheet

Every survey now ends with one extra screen asking **name, phone number,
and email address** before the "Submit" button appears — this happens
automatically for all 10 surveys; you don't need to add anything.

To have every submission land as a new row in a Google Sheet automatically:

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet (name it anything, e.g. "Nutrezy Responses").
2. In the menu, click **Extensions → Apps Script**. A new tab opens with
   a code editor.
3. Delete everything in that editor, then open the file
   **`google-apps-script.gs`** (included in this project folder), copy
   its entire contents, and paste it into the Apps Script editor.
4. Click **Deploy → New deployment**.
5. Click the gear icon ⚙️ next to "Select type" → choose **Web app**.
6. Set **"Who has access"** to **Anyone**, then click **Deploy**.
   (Google will ask you to authorize it — that's expected, it's your
   own script talking to your own sheet.)
7. Copy the **Web app URL** it shows you (starts with
   `https://script.google.com/macros/...`).
8. Open **`script.js`** in this project, find this near the very top:
   ```js
   const CONFIG = {
     GOOGLE_SHEETS_URL: ""
   };
   ```
   Paste your URL between the quotes:
   ```js
   const CONFIG = {
     GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/xxxxx/exec"
   };
   ```
9. Save, re-upload/redeploy your site (see Section 8 below), and submit
   a test survey — a new row should appear in your sheet within a few
   seconds, with a column for every question plus Name, Phone, and Email.

**If you skip this step**, the site still works perfectly — every
submission is simply downloaded as a `.json` file in the visitor's
browser instead (see Section 9 below), so you never lose responses
either way.

---

## 8. How to publish it for free with GitHub Pages

This puts your site on the internet at a free web address, e.g.
`https://yourname.github.io/nutrezy`.

1. **Create a GitHub account** at [github.com](https://github.com) if
   you don't have one (it's free).
2. Click the **+** icon (top right) → **New repository**. Name it
   `nutrezy` (or anything you like) → click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Drag in all the files and folders from this project (`index.html`,
   `style.css`, `script.js`, `assets/`, `README.md`) → click
   **Commit changes**.
5. Go to the repository's **Settings** tab → **Pages** (left sidebar).
6. Under "Build and deployment", set **Source** to `Deploy from a
   branch`, and **Branch** to `main` (folder `/root`) → **Save**.
7. Wait about a minute, then refresh the page. GitHub shows your live
   link at the top, something like:
   `https://yourusername.github.io/nutrezy/`
8. Share that link — anyone can now take the surveys!

Any time you want to update questions or colours, just edit the file on
GitHub (click the pencil ✏️ icon on the file) or re-upload it — the
live site updates automatically within a minute.

---

## 9. Where survey answers go

Every submission is saved in up to three places at once, so you never
lose a response:

- **Your Google Sheet** — if you completed Section 7's setup, every
  submission appears there automatically, including name, phone, email,
  and every question answer in its own column.
- **A downloaded `.json` file** — the visitor's browser automatically
  downloads a small file with that survey's answers (check the
  visitor's Downloads folder). This happens either way, as a backup.
- **In-progress answers** are auto-saved in the visitor's own browser
  (`localStorage`) so if they accidentally close a survey partway
  through, their answers (including name/phone/email so far) are still
  there next time they reopen that same bubble.

---

## 10. Good to know

- No installs, no `npm`, no build step — just open `index.html`.
- Works on desktop, tablet, and mobile; circles rearrange automatically
  on small screens.
- Respects "reduced motion" browser settings for accessibility.
- All buttons and circles are reachable and usable with just a
  keyboard (Tab + Enter).

Enjoy! 🎉
