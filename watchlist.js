const watchlistContainer = document.getElementById("watchlist-container");
const watchlistArray = JSON.parse(localStorage.getItem("watchlistArray"));

function renderWatchlistHTML() {
  watchlistContainer.innerHTML =
    "<div class='movie-list' id='movie-list'></div>";
  let movieHTML = "";
  movieHTML = watchlistArray
    .map((movie) => {
      const { Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID } = movie;
      return `
         <div class="movie-container">
             <img src="${Poster}" class="movie-img" />
             <div class="movie-desc">
                 <h3 class="movie-title">
                 ${Title}
                 <span class="rating">⭐${imdbRating}</span>
                 </h3>
                 <div class="movie-spec">
                   <p class="duration">${Runtime}</p>
                   <p class="genre">${Genre}</p>
                   <button class="watchlist-btn" data-id="${imdbID}">
                       <img src="assets/remove-icon.png" />
                       <p>Remove</p>
                   </button>
                 </div>
                 <p class="movie-plot">${Plot}</p>
             </div>
         </div>
         ${
           watchlistArray.indexOf(movie) !== watchlistArray.length - 1
             ? "<div class='break-line'></div>"
             : ""
         }`;
    })
    .join("");
  document.getElementById("movie-list").innerHTML += movieHTML;

  createRemoveBtnListener();
}

function createRemoveBtnListener() {
  const buttons = document.querySelectorAll(".watchlist-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const imdbID = e.currentTarget.dataset.id;
      const matchIndex = watchlistArray.findIndex(
        (movie) => movie.imdbID === imdbID
      );
      if (matchIndex !== -1) {
        watchlistArray.splice(matchIndex, 1);
        addToLocalStorage(watchlistArray);
        renderWatchlistHTML();
        checkArray();
      }
    });
  });
}

function addToLocalStorage(obj) {
  localStorage.setItem("watchlistArray", JSON.stringify(obj));
}

function checkArray() {
  if (watchlistArray.length > 0) {
    renderWatchlistHTML();
  } else {
    watchlistContainer.innerHTML = `
    <div class="loading-display">
        <h3 class="light">Your watchlist is looking a little empty...</h3>
        <a class="explore-movies-link" href="/index.html">
        <img src="/assets/add-icon.png" />
        <p>Let's add some movies!</p>
        </a>
    </div>`;
  }
}

checkArray();
