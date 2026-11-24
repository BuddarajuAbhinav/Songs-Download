# Songs Downloader 1.3.1

A download-first media library with a regular desktop/mobile interface and a separate ultra-light page for the JioBharat V4.

## Project files

- `index.html` — regular searchable library
- `style.css` — regular dark interface
- `songs.js` — catalogue of 166 media entries (113 MP3 audio files and 53 MP4 videos)
- `app.js` — search, filters, sorting, downloads and saved favourites
- `jiobharat.html` — standalone compact edition for a small-screen feature phone; no JavaScript, external fonts, images or separate stylesheet

## Install in the existing GitHub repository

1. Keep all existing MP3 and MP4 media files in the repository root, at the same level as `index.html`.
2. Upload/replace `index.html`, `style.css`, `songs.js` and `app.js` with the files from this project.
3. Add `jiobharat.html` to the same repository root.
4. Do not rename the media files. The catalogue uses their exact existing filenames.
5. Commit the changes to the branch used by GitHub Pages.
6. Open the regular page on a computer, or open `jiobharat.html` directly on the JioBharat V4.

The phone edition is available at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/jiobharat.html` after GitHub Pages is published. Replace the placeholders with your actual GitHub Pages address.

## JioBharat V4 notes

The V4 edition is a plain HTML page with compact text links grouped by category. It deliberately avoids JavaScript, external libraries, Google Fonts, animations, and modern layout features. Each link uses the ordinary media-file URL plus the HTML `download` attribute. Older browsers may ignore that attribute and open the media file instead; in that case, use the browser's Save/Download option if it provides one.

The V4's browser availability and download handling should be tested on the actual handset. Product listings are inconsistent about whether a web browser is available and which browser is included. The page itself cannot make a missing browser available.

## Adding a media file

Upload the new media file to the repository root and add an entry to `window.SONGS` in `songs.js`:

```js
{ title: "Display name", file: "Exact filename.mp3", category: "Gaming & OST", legacyFavorite: false }
```

Then regenerate the static links in `jiobharat.html` so the V4 edition also includes it. Supported formats in this release are `.mp3` audio and `.mp4` video.

## Favourites

The regular edition stores user favourites in that browser's `localStorage`. The V4 edition is intentionally read-only and omits favourites, search and sorting to reduce compatibility requirements.

## Media and publishing

The ZIP contains website code, not the media files. Keep your existing MP3/MP4 files in the repository. Only publish media that you own or have permission to distribute.
