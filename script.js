
const API_KEY = "b2beaeef"; //  OMDb API key


const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("statusMessage");
const movieGrid = document.getElementById("movieGrid");
const themeToggle = document.getElementById("themeToggle");
const watchlistGrid = document.getElementById("watchlistGrid");
const watchlistEmpty = document.getElementById("watchlistEmpty");

//       IN-MEMORY WATCHLIST
let watchlist = [];

//       DARK MODE TOGGLE

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "🌙 Light Mode";
  } else {
    themeToggle.textContent = "☀️ Dark Mode";
  }
});

//       WATCHLIST FUNCTIONS
function addToWatchlist(movie) {
  if (!watchlist.find(m => m.imdbID === movie.imdbID)) {
    watchlist.push(movie);
    renderWatchlist();
  }
}

function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(m => m.imdbID !== imdbID);
  renderWatchlist();
}

function renderWatchlist() {
  watchlistGrid.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistEmpty.style.display = "block";
    return;
  }

  watchlistEmpty.style.display = "none";

  watchlist.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card", "watchlist-card", "fade-in");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/220x330?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromWatchlist(movie.imdbID);
    });

    watchlistGrid.appendChild(card);
  });
}

// =============================
//       FETCH MOVIES
// =============================
function fetchMovies(query) {
  statusMessage.textContent = "Searching...";
  movieGrid.innerHTML = ""; // Clear previous results

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        statusMessage.textContent = "No movies found 😢 Try another title!";
      }
    })
    .catch(err => {
      console.error(err);
      statusMessage.textContent = "Network error. Please try again!";
    });
}

// =============================
//       RENDER MOVIES
// =============================
function renderMovies(movies) {
  statusMessage.textContent = ""; // Clear status message

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card", "fade-in");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/220x330?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year} | ${movie.Type}</p>
      <button class="add-btn" data-id="${movie.imdbID}">Add to Watchlist</button>
     
    `;

    // Click to toggle extra info
    card.addEventListener("click", (e) => {
      // Prevent toggling when clicking the "Add to Watchlist" button
      if (e.target.classList.contains("add-btn")) return;

      const extra = card.querySelector(".extra-info");
      extra.style.display = extra.style.display === "none" ? "block" : "none";
    });

    // Add to watchlist button
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToWatchlist(movie);
    });

    movieGrid.appendChild(card);
  });
}

//       EVENT LISTENERS
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    statusMessage.textContent = "Please enter a movie name 🎬";
    return;
  }
  fetchMovies(query);
});

// Enter key triggers search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
