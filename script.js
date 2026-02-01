const API_KEY = "b2beaeef"; // OMDb API key

// Get DOM elements
const searchInput = document.getElementById("searchInput"); // Search input field
const searchBtn = document.getElementById("searchBtn"); // Search button
const statusMessage = document.getElementById("statusMessage"); // Status message display
const movieGrid = document.getElementById("movieGrid"); // Container for movie results
const themeToggle = document.getElementById("themeToggle"); // Dark mode toggle button
const watchlistGrid = document.getElementById("watchlistGrid"); // Container for watchlist movies
const watchlistEmpty = document.getElementById("watchlistEmpty"); // Message when watchlist is empty

// =============================
//       IN-MEMORY WATCHLIST
// =============================
let watchlist = []; // Array to store watchlist movies

// =============================
//       DARK MODE TOGGLE
// =============================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode"); // Toggle dark mode class on body

  // Update button text based on current theme
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "🌙 Light Mode"; // Show Light Mode text when dark mode is active
  } else {
    themeToggle.textContent = "☀️ Dark Mode"; // Show Dark Mode text when dark mode is inactive
  }
});

// =============================
//       WATCHLIST FUNCTIONS
// =============================

// Add a movie to the watchlist if it is not already present
function addToWatchlist(movie) {
  if (!watchlist.find(m => m.imdbID === movie.imdbID)) {
    watchlist.push(movie); // Add movie to watchlist
    renderWatchlist(); // Update watchlist UI
  }
}

// Remove a movie from the watchlist by its IMDb ID
function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(m => m.imdbID !== imdbID); // Filter out the movie
  renderWatchlist(); // Update watchlist UI
}

// Render all movies in the watchlist
function renderWatchlist() {
  watchlistGrid.innerHTML = ""; // Clear current watchlist display

  // Show message if watchlist is empty
  if (watchlist.length === 0) {
    watchlistEmpty.style.display = "block";
    return;
  }

  watchlistEmpty.style.display = "none"; // Hide empty message

  // Create cards for each movie in watchlist
  watchlist.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card", "watchlist-card", "fade-in"); // Styling classes

    // Movie card HTML
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/220x330?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
    `;

    // Remove button functionality
    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromWatchlist(movie.imdbID);
    });

    // Add card to watchlist grid
    watchlistGrid.appendChild(card);
  });
}

// =============================
//       FETCH MOVIES
// =============================
function fetchMovies(query) {
  statusMessage.textContent = "Searching..."; // Show searching message
  movieGrid.innerHTML = ""; // Clear previous movie results

  // Fetch movies from OMDb API
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        renderMovies(data.Search); // Render search results
      } else {
        statusMessage.textContent = "No movies found 😢 Try another title!"; // No results found
      }
    })
    .catch(err => {
      console.error(err); // Log any network errors
      statusMessage.textContent = "Network error. Please try again!"; // Show error message
    });
}

// =============================
//       RENDER MOVIES
// =============================
function renderMovies(movies) {
  statusMessage.textContent = ""; // Clear previous status messages

  // Create cards for each movie
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card", "fade-in"); // Styling classes

    // Movie card HTML
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/220x330?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year} | ${movie.Type}</p>
      <button class="add-btn" data-id="${movie.imdbID}">Add to Watchlist</button>
    `;

    // Toggle extra info when clicking on card (excluding add button)
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-btn")) return; // Ignore clicks on add button

      const extra = card.querySelector(".extra-info");
      extra.style.display = extra.style.display === "none" ? "block" : "none"; // Show/hide extra info
    });

    // Add movie to watchlist on button click
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToWatchlist(movie);
    });

    // Add card to movie grid
    movieGrid.appendChild(card);
  });
}

// =============================
//       EVENT LISTENERS
// =============================

// Click search button to fetch movies
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    statusMessage.textContent = "Please enter a movie name 🎬"; // Show message if input empty
    return;
  }
  fetchMovies(query);
});

// Press Enter key to trigger search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
