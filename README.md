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
| `src/css/vendor/` | Bootstrap and Bootstrap Icons (don't edit) |

The header and footer are repeated in each page, so a change to them must be made in all four files.

## Building for the web

```
npm install        # once: installs the minify/obfuscate tools (terser, javascript-obfuscator, clean-css, html-minifier-terser)
npm run build      # writes the production site to dist/spanish-fort-lodge
npm run preview    # optional: view the built site at http://localhost:4300
```

`npm run build` minifies the HTML and CSS, minifies and obfuscates the JavaScript, adds cache-busting version
stamps to the CSS and JS links, and copies the images and fonts. It also creates redirects from the old site
addresses (`/about`, `/events`, `/newsfeed`) to the new pages.

## Deploying

Pushing to `main` runs `.github/workflows/main_spanishfortlodge.yml`, which runs `npm run build` and deploys
`dist/spanish-fort-lodge` to the `spanishfortlodge` Azure Web App.

## Bootstrap

Bootstrap 5.3 and Bootstrap Icons are stored in `src/css/vendor/` and are not npm packages. To update them, download
`bootstrap.min.css` from [getbootstrap.com](https://getbootstrap.com/docs/5.3/getting-started/download/) and
`bootstrap-icons.min.css` plus its `fonts/` folder from [icons.getbootstrap.com](https://icons.getbootstrap.com/#install),
and replace the files in `src/css/vendor/`.
