# Spanish Fort Lodge No. 916

Website for Spanish Fort Lodge No. 916, F. & A.M., Spanish Fort, Alabama. It's a static HTML site built on
[Bootstrap 5.3](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/). There's no framework and nothing to compile.

## Editing the site

Everything is in `src/`. Open any page there in a browser (double-click it) to see your changes.

| File | What it is |
|---|---|
| `src/index.html` | Home |
| `src/about.html` | About Us, including the officers list (update it each year after installation) |
| `src/events.html` | Events: the lodge's Google Calendar |
| `src/news.html` | News: the lodge's Facebook feed |
| `src/css/styles.css` | All site styles. Colors and fonts are set at the top (`:root`). |
| `src/js/main.js` | Phone menu, header shadow on scroll, footer year |
| `src/assets/` | Images |
| `src/css/vendor/` | Bootstrap and Bootstrap Icons (copied from `node_modules`; don't edit) |

The header and footer are repeated in each page, so a change to them must be made in all four files.

## Building for the web

```
npm install        # once
npm run build      # writes the production site to dist/spanish-fort-lodge
npm run preview    # optional: view the built site at http://localhost:4300
```

`npm run build` minifies the HTML and CSS, minifies and obfuscates the JavaScript, adds cache-busting version
stamps to the CSS and JS links, and copies the images and fonts. It also creates redirects from the old site
addresses (`/about`, `/events`, `/newsfeed`) to the new pages.

## Deploying

Pushing to `main` runs `.github/workflows/main_spanishfortlodge.yml`, which runs `npm run build` and deploys
`dist/spanish-fort-lodge` to the `spanishfortlodge` Azure Web App.

To update Bootstrap: `npm install bootstrap@latest bootstrap-icons@latest`, then copy
`node_modules/bootstrap/dist/css/bootstrap.min.css` and `node_modules/bootstrap-icons/font/bootstrap-icons.min.css`
(plus its `fonts/` folder) into `src/css/vendor/`.
