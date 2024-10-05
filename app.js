async function fetchData() {
    if (!localStorage.getItem("movies")) {
        try {
            const response = await fetch('movies.json');
            const result = await response.json();
            localStorage.setItem("movies", JSON.stringify(result));
        } catch (error) {
            console.error(error);
        }
    }
}

function showData() {
    let movies = JSON.parse(localStorage.getItem("movies"));
    const mainPage = document.querySelector(".mainpage");
    mainPage.innerHTML = '';

    movies.forEach((movie, index) => {
        let div = document.createElement("div");
        div.className = "box";
        div.setAttribute("id", index);

        let html = `<img src="${movie.image}">
                    <h2>${movie.rating}</h2>
                    <h2>${movie.title}</h2>
                    <button onclick="addFavorite(${index})">Add to Favorite</button>
                    <button onclick="removeFavorite(${index})">Remove from Favorite</button>
                    <button class="review-button">Review</button>`;
        div.innerHTML = html;
        mainPage.appendChild(div);
        console.log(movie);

        const reviewButton = div.querySelector('.review-button');
        reviewButton.addEventListener("click", () => {
            window.location.href = "nextpage.html";
            localStorage.setItem("movie", JSON.stringify(movie));
        });
    });
}

function filterMovies(searchword) {
    const movies = JSON.parse(localStorage.getItem("movies"));
    const mainPage = document.querySelector(".mainpage");
    mainPage.innerHTML = ''; 

    movies.forEach((movie, index) => {
        if (movie.title.toLowerCase().includes(searchword)) {
            let div = document.createElement("div");
            div.className = "box";
            div.setAttribute("id", index);

            let html = `<img src="${movie.image}">
                        <h2>${movie.rating}</h2>
                        <h2>${movie.title}</h2>
                        <button onclick="addFavorite(${index})">Add to Favorite</button>
                        <button onclick="removeFavorite(${index})">Remove from Favorite</button>
                        <button class="review-button">Review</button>`;
            div.innerHTML = html;
            mainPage.appendChild(div);

            const reviewButton = div.querySelector('.review-button');
            reviewButton.addEventListener("click", () => {
                window.location.href = "nextpage.html";
                localStorage.setItem("movie", JSON.stringify(movie));
            });
        }
    });
}

function addFavorite(index) {
    const movies = JSON.parse(localStorage.getItem("movies"));
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favoriteMovies.some(movie => movie.title === movies[index].title)) {
        favoriteMovies.push(movies[index]);
        localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
        alert('Movie added to favorites!');
    } else {
        alert('Movie already in favorites!');
    }
}

function removeFavorite(index) {
    const movies = JSON.parse(localStorage.getItem("movies"));
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteMovies = favoriteMovies.filter(movie => movie.title !== movies[index].title);
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    alert('Movie removed from favorites!');
}

function displayFavorites() {
    const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    const mainPage = document.querySelector(".mainpage");
    mainPage.innerHTML = ''; 

    favoriteMovies.forEach((movie, index) => {
        let div = document.createElement("div");
        div.className = "box";
        div.setAttribute("id", `fav-${index}`);
        
        let html = `<img src="${movie.image}">
                    <h2>${movie.rating}</h2>
                    <h2>${movie.title}</h2>
                    <button onclick="removeFavoriteFromFavorites(${index})">Remove from Favorite</button>`;
        div.innerHTML = html;
        mainPage.appendChild(div);
    });
}

function removeFavoriteFromFavorites(index) {
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    favoriteMovies.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    displayFavorites();
}

window.addEventListener("DOMContentLoaded", () => {
    fetchData().then(() => {
        showData();
    });

    const searchForm = document.querySelector('.search-container form');
    const searchInput = document.querySelector('.search-box');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchword = searchInput.value.trim().toLowerCase();
        filterMovies(searchword);
    });

    const myAccountLink = document.getElementById('myAccountLink');
    myAccountLink.addEventListener('click', displayFavorites);
});
