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