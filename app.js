(() => {
  "use strict";

  const songs = Array.isArray(window.SONGS) ? window.SONGS : [];
  const FAVORITES_KEY = "songs-downloader-v1.3-favorites";

  const elements = {
    grid: document.getElementById("media-grid"),
    empty: document.getElementById("empty-state"),
    search: document.getElementById("search-input"),
    sort: document.getElementById("sort-select"),
    category: document.getElementById("category-select"),
    resultCount: document.getElementById("result-count"),
    activeNote: document.getElementById("active-filter-note"),
    statTotal: document.getElementById("stat-total"),
    statAudio: document.getElementById("stat-audio"),
    statVideo: document.getElementById("stat-video"),
    countAll: document.getElementById("count-all"),
    countAudio: document.getElementById("count-audio"),
    countVideo: document.getElementById("count-video"),
    countFavorites: document.getElementById("count-favorites"),
    clearFilters: document.getElementById("clear-filters")
  };

  let activeType = "all";
  let query = "";
  let category = "all";
  let sortMode = "collection";

  function readFavorites() {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set(parsed.filter(value => typeof value === "string"));
      }
    } catch (error) {
      console.warn("Could not read saved favourites; using the original selections.", error);
    }
    return new Set(songs.filter(song => song.legacyFavorite).map(song => song.file));
  }

  let favorites = readFavorites();

  function saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch (error) {
      console.warn("Could not save favourites in this browser.", error);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function fileType(song) {
    return /\.mp4$/i.test(song.file) ? "video" : "audio";
  }

  function fileUrl(filename) {
    // All media files are stored in the repository root. Encoding keeps spaces,
    // commas and other punctuation safe in relative GitHub Pages URLs.
    return encodeURIComponent(filename).replace(/'/g, "%27");
  }

  function populateCategories() {
    const categories = [...new Set(songs.map(song => song.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
    for (const name of categories) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      elements.category.append(option);
    }
  }

  function updateStatistics() {
    const audioCount = songs.filter(song => fileType(song) === "audio").length;
    const videoCount = songs.filter(song => fileType(song) === "video").length;
    elements.statTotal.textContent = songs.length;
    elements.statAudio.textContent = audioCount;
    elements.statVideo.textContent = videoCount;
    elements.countAll.textContent = songs.length;
    elements.countAudio.textContent = audioCount;
    elements.countVideo.textContent = videoCount;
    elements.countFavorites.textContent = favorites.size;
  }

  function getVisibleSongs() {
    const normalizedQuery = query.toLocaleLowerCase();
    let visible = songs.filter(song => {
      const matchesType = activeType === "all"
        || (activeType === "favorites" ? favorites.has(song.file) : fileType(song) === activeType);
      const matchesCategory = category === "all" || song.category === category;
      const searchableText = `${song.title} ${song.file} ${song.category}`.toLocaleLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesType && matchesCategory && matchesQuery;
    });

    if (sortMode === "az") visible = [...visible].sort((a, b) => a.title.localeCompare(b.title));
    if (sortMode === "za") visible = [...visible].sort((a, b) => b.title.localeCompare(a.title));
    return visible;
  }

  function cardMarkup(song) {
    const type = fileType(song);
    const isFavorite = favorites.has(song.file);
    const icon = type === "video" ? "▣" : "♫";
    const extension = type === "video" ? "MP4 VIDEO" : "AUDIO FILE";
    const categoryLabel = song.category || "Uncategorised";
    const favoriteLabel = isFavorite ? "Remove from favourites" : "Add to favourites";
    const encodedFile = fileUrl(song.file);

    return `
      <article class="media-card">
        <div class="file-art ${type}" aria-hidden="true">${icon}</div>
        <div class="media-info">
          <h3 class="media-title" title="${escapeHtml(song.title)}">${escapeHtml(song.title)}</h3>
          <div class="media-meta">
            <span>${extension}</span><span class="meta-dot" aria-hidden="true"></span>
            <span>${escapeHtml(categoryLabel)}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button"
            data-favorite="${escapeHtml(song.file)}" aria-label="${favoriteLabel} for ${escapeHtml(song.title)}"
            aria-pressed="${isFavorite}" title="${favoriteLabel}">${isFavorite ? "♥" : "♡"}</button>
          <a class="download-button" href="${encodedFile}" download="${escapeHtml(song.file)}"
            aria-label="Download ${escapeHtml(song.title)}" title="Download ${escapeHtml(song.title)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19v2h16v-2"></path></svg>
          </a>
        </div>
      </article>`;
  }

  function updateFilterButtons() {
    document.querySelectorAll(".filter-chip").forEach(button => {
      const active = button.dataset.type === activeType;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function updateActiveNote() {
    const descriptions = [];
    if (activeType === "audio") descriptions.push("Music only");
    if (activeType === "video") descriptions.push("Videos only");
    if (activeType === "favorites") descriptions.push("Favourites");
    if (category !== "all") descriptions.push(category);
    if (query) descriptions.push(`Search: “${query}”`);
    elements.activeNote.textContent = descriptions.length ? `Showing: ${descriptions.join(" · ")}` : "";
    elements.activeNote.hidden = descriptions.length === 0;
  }

  function render() {
    const visible = getVisibleSongs();
    elements.grid.innerHTML = visible.map(cardMarkup).join("");
    elements.grid.hidden = visible.length === 0;
    elements.empty.hidden = visible.length !== 0;
    elements.resultCount.textContent = `Showing ${visible.length} of ${songs.length} files`;
    updateFilterButtons();
    updateActiveNote();
    updateStatistics();
  }

  document.querySelectorAll(".filter-chip").forEach(button => {
    button.addEventListener("click", () => {
      activeType = button.dataset.type || "all";
      render();
    });
  });

  elements.search.addEventListener("input", event => {
    query = event.target.value.trim();
    render();
  });

  elements.sort.addEventListener("change", event => {
    sortMode = event.target.value;
    render();
  });

  elements.category.addEventListener("change", event => {
    category = event.target.value;
    render();
  });

  elements.grid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const filename = button.dataset.favorite;
    if (!filename) return;
    if (favorites.has(filename)) favorites.delete(filename);
    else favorites.add(filename);
    saveFavorites();
    render();
  });

  function clearFilters() {
    activeType = "all";
    query = "";
    category = "all";
    sortMode = "collection";
    elements.search.value = "";
    elements.category.value = "all";
    elements.sort.value = "collection";
    render();
  }

  elements.clearFilters.addEventListener("click", clearFilters);

  document.addEventListener("keydown", event => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement
      && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (event.key === "/" && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      elements.search.focus();
    }
    if (event.key === "Escape" && target === elements.search && elements.search.value) {
      elements.search.value = "";
      query = "";
      render();
    }
  });

  if (!songs.length) {
    elements.grid.hidden = true;
    elements.empty.hidden = false;
    elements.resultCount.textContent = "No catalogue entries loaded";
  } else {
    populateCategories();
    render();
  }
})();
