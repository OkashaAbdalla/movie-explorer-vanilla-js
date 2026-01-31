const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("statusMessage");
const movieGrid = document.getElementById("movieGrid");
const themeToggle = document.getElementById("themeToggle");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (!query) {
    statusMessage.textContent = "Please enter a movie name 🎬";
    return;
  }

  statusMessage.textContent = `Searching for "${query}"...`;
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const API_KEY = "b2beaeef";

function fetchMovies(query) {
  statusMessage.textContent = "Searching...";
  movieGrid.innerHTML = ""; // Clear previous results

  fetch(
    `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        statusMessage.textContent = "No movies found 😢 Try another title!";
      }
    })
    .catch((err) => {
      console.error(err);
      statusMessage.textContent = "Network error. Please try again!";
    });
}

function renderMovies(movies) {
  statusMessage.textContent = ""; // Clear status message
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/220x330?text=No+Image"}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year} | ${movie.Type}</p>
    `;

    movieGrid.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    statusMessage.textContent = "Please enter a movie name 🎬";
    return;
  }
  fetchMovies(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
