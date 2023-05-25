const searchForm = document.getElementById("search-container");
const searchBtn = document.getElementById("search-btn");
const contentContainer = document.getElementById("content-container");
const searchQuery = document.getElementById("search-query");
const watchlistBtn = document.getElementById("watchlist-btn");
let movieArray;
let watchlistArray = localStorage.getItem("watchlistArray")
  ? JSON.parse(localStorage.getItem("watchlistArray"))
  : [];

searchQuery.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchData();
  }
});

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  fetchData();
});

watchlistBtn.addEventListener("click", function () {});

function fetchData() {
  if (searchQuery.value) {
    fetch(`https://www.omdbapi.com/?apikey=eb16a452&s=${searchQuery.value}`)
      .then((res) => res.json())
      .then((data) => {
        getMovieList(data.Search);
      })
      .catch((error) => {
        contentContainer.innerHTML = `
          <div class="error-display">
            <h3 class="light">Unable to find what you're looking for. 
            <br />Please try another search.</h3>
          </div>`;
      });
  }
}

function getMovieList(movieList) {
  movieArray = [];
  for (let movie of movieList) {
    fetch(`https://www.omdbapi.com/?apikey=eb16a452&i=${movie.imdbID}`)
      .then((res) => res.json())
      .then((data) => {
        movieArray.push(data);
        getMovieHTML();
      });
  }
}

function getMovieHTML() {
  contentContainer.innerHTML = "<div class='movie-list' id='movie-list'></div>";
  let movieHTML = "";
  movieHTML = movieArray
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
                     <img src="assets/add-icon.png" />
                     <p>Watchlist</p>
                 </button>
               </div>
               <p class="movie-plot">${Plot}</p>
           </div>
       </div>
       ${
         movieArray.indexOf(movie) !== movieArray.length - 1
           ? "<div class='break-line'></div>"
           : ""
       }`;
    })
    .join("");
  document.getElementById("movie-list").innerHTML += movieHTML;
  createAddButtonListeners();
}

function createAddButtonListeners() {
  const buttons = document.querySelectorAll(".watchlist-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const imdbID = e.currentTarget.dataset.id;
      const match = movieArray.find((movie) => movie.imdbID === imdbID);
      console.log(match);
      if (!watchlistArray.some((obj) => obj.imdbID === match.imdbID)) {
        watchlistArray.unshift(match);
      }
      console.log(watchlistArray);
      addToLocalStorage(watchlistArray);
    });
  });
}

function addToLocalStorage(obj) {
  localStorage.setItem("watchlistArray", JSON.stringify(obj));
}
