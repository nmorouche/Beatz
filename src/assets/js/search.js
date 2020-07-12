const searchBar = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const cancelButton = document.getElementById('cancel-button');
const loaderElement = document.getElementById('loader');
const gifsElement = document.getElementById("gifs");

function disableSearch() {
    searchButton.style.display = "none";
    cancelButton.style.display = null;
    searchBar.disabled = true;
}

function setLoading(isLoading) {
    if (isLoading) {
        loaderElement.style.display = null;
        gifsElement.style.display = "none";
    }
    else {
        loaderElement.style.display = "none";
        gifsElement.style.display = null;
    }
}

function addGIFToFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;
    const title = likeButton.dataset.title;
    const album = likeButton.dataset.album;
    const artist = likeButton.dataset.artist;
    const preview = likeButton.dataset.preview;
    const duration = likeButton.dataset.duration;
    const cover_big = likeButton.dataset.cover_big;


    const gifElement = document.getElementById(gifId);
    
    const db = window.db;

    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
    db.gifs.add({
        id: parseInt(gifId),
        title: title,
        artist: artist,
        album: album,
        cover_big: cover_big,
        preview: preview,
        duration: duration
    });
    const gifCacheName = 'gif-images';
    const gifToCache = [

    ];
    self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(gifCacheName)
            .then((cache) => {
                return cache.addAll(gifToCache);
            })
        );
    });
    likeButton.disabled = true;
}

function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    if (isNaN(min) || isNaN(sec)) {
        return "--:--"
    }
    return min + ':' + ((sec<10) ? ('0' + sec) : sec);
}

function buildGIFCard(gifItem, isSaved) {
    const newGifElement = document.createElement("article");
    newGifElement.classList.add("gif-card");
    newGifElement.id = gifItem.id;

    const gifImageElement = document.createElement('IMG');
    gifImageElement.src = gifItem.album.cover_big;
    gifImageElement.onclick = function() {
        sessionStorage.setItem("song", gifItem.id.toString())
        const player = document.getElementById("player");
        player.click();
    };

    newGifElement.appendChild(gifImageElement);

    const gifMetaContainerElement = document.createElement("div");
    newGifElement.appendChild(gifMetaContainerElement);

    const gifTitleElement = document.createElement("h3");
    const gifTitleNode = document.createTextNode(gifItem.title || 'No title');
    gifTitleElement.appendChild(gifTitleNode);
    gifMetaContainerElement.appendChild(gifTitleElement);

    const favButtonElement = document.createElement("button");
    favButtonElement.setAttribute('aria-label', `Save ${gifItem.title}`);
    favButtonElement.classList.add("button");
    favButtonElement.dataset.gifId = gifItem.id;
    favButtonElement.dataset.title = gifItem.title;
    favButtonElement.dataset.artist = gifItem.artist.name;
    favButtonElement.dataset.album = gifItem.album.title;
    favButtonElement.dataset.cover_big = gifItem.album.cover_big;
    favButtonElement.dataset.preview = gifItem.preview;
    favButtonElement.dataset.duration = formatTime(gifItem.duration);
    favButtonElement.onclick = addGIFToFavorite;
    const favIconElement = document.createElement("i");
    favIconElement.classList.add("fas", "fa-heart");
    favButtonElement.appendChild(favIconElement);
    gifMetaContainerElement.appendChild(favButtonElement);

    if (isSaved) {
        favButtonElement.disabled = true;
    }

    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.appendChild(newGifElement);
}

async function searchGIFs() {
    disableSearch();
    setLoading(true);

    const query = searchBar.value;

    const url = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=" + query + "&limit=25";
    const option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        fetch(url, option).then(response => 
            response.json()
        ).then(json => {
            const gifs = json.data;

            const db = window.db;

            db.open().catch(err => {
                console.error('Failed to open db : ' + (err.stack || err));
            });
            gifs.forEach(async gif => {
                var dataGIF = await db.gifs.where("id").equalsIgnoreCase(gif.id.toString()).toArray();
                var isSaved = dataGIF.length == 0 ? false : true; // replace false by the condition
                buildGIFCard(gif, isSaved);
            });
        }).catch(error => console.log(error));
    } catch (e) {
        console.log("An error occured, please try again.");
    } finally {
        setLoading(false);
    }
}

function cancelSearch() {
    searchButton.style.display = null;
    cancelButton.style.display = "none";

    while (gifsElement.firstChild) {
        gifsElement.firstChild.remove();
    }

    searchBar.value = null;
    searchBar.disabled = false;
    searchBar.focus();
}

window.addEventListener('DOMContentLoaded', async function () {
    searchBar.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchGIFs();
        }
    });
    searchButton.addEventListener('click', searchGIFs);
    cancelButton.addEventListener('click', cancelSearch);
});