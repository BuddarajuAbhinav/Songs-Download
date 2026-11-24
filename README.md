# Songs Downloader 1.3

A dark, responsive, download-first media library for GitHub Pages. This release merges the collections from the old `index.html` and `index2.html` pages into one searchable library.

## Files

- `index.html` — page structure and controls
- `style.css` — responsive dark interface
- `songs.js` — catalogue of media files
- `app.js` — search, filters, sorting, downloads and saved favourites

## Install in the existing repository

1. Keep all existing media files in the repository root (the same level as `index.html`).
2. Replace the old `index.html` with this new `index.html`.
3. Add `style.css`, `songs.js` and `app.js` beside `index.html`.
4. Commit the changes to the branch used by GitHub Pages.
5. Open the published site and test several downloads, including filenames with spaces, commas and apostrophes.

The old `index2.html`, `stuff.css` and `work.js` are no longer needed by the new page. You can keep them for rollback, or remove them after confirming version 1.3 works.

## Adding a file

Upload the media file to the repository root, then add an entry to `window.SONGS` in `songs.js`:

```js
{ title: "Display name", file: "Exact filename.mp3", category: "Gaming & OST", legacyFavorite: false }
```

`file` must match the uploaded filename exactly. Supported types in this release are `.mp3` audio and `.mp4` video. Other extensions are currently treated as audio for display; update `fileType()` in `app.js` if you add other formats.

## Favourites

Items marked with the old `fav` / `fav2` class have been migrated as initial favourites. Users can change favourites in the browser; selections are stored in that browser's `localStorage`.

## Publishing and rights

Only publish media that you own or have permission to distribute. A public GitHub repository and GitHub Pages site make repository files accessible to visitors.

The existing `why.html` file is left untouched and linked from the new footer. The old external source-site buttons are not reproduced in the new library interface; they can be added back in a dedicated resources section if you want them.
