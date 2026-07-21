# Nayan Visuals — Video Editor Portfolio

Static single-page portfolio site. No build tooling, no package.json, no framework.

## Structure

- `index.html` — public portfolio (hero, services, portfolio grid, testimonials, about, contact)

- `data/portfolio.json` — video data source; fetched by both pages via `fetch()`
- `js/script.js` — portfolio page logic (filtering, lightbox, scroll animations)
- `css/style.css` — all styles (responsive, lightbox, admin layout)

## Key facts

- **No package manager, build step, test runner, or linter.** Open `index.html` in a browser to view.
- Portfolio data is `data/portfolio.json`. Admin panel edits are in-memory only — click **Download portfolio.json** to export, then replace `data/portfolio.json` manually to persist.
- Video entries use YouTube embed URLs (`videoUrl` field). Categories: `gameplay`, `video`, `color-grading`, `motion-graphics`.
- Filters and lightbox are client-side JS (no routing).
- Contact form shows an alert on submit (no backend).
- Fonts: Google Poppins + Font Awesome via CDN.
