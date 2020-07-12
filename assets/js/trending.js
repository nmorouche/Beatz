function setLoading(isLoading) {
    const loaderElement = document.getElementById("loader");
    const gifsElement = document.getElementById("gifs");
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

    const gifElement = document.getElementById(gifId);

    const gifTitle = gifElement.querySelector('div h3').textContent;
    const gifImageUrl = gifElement.querySelector('img').src;

    const db = window.db;

    // TODO: 4a - Open IndexedDB's database
    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
     // TODO: 4b - Save GIF data into IndexedDB's database
    db.gifs.add({
        id: gifId,
        title: gifTitle,
        imageUrl: gifImageUrl,
    });
    // TODO: 4c - Put GIF media (image and video) into a cache named "gif-images"
    const gifCacheName = 'gif-images';
    const gifToCache = [
        gifImageUrl,
    ];
    self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(gifCacheName)
            .then((cache) => {
                return cache.addAll(gifToCache);
            })
        );
    });
    // Set button in 'liked' state (disable the button)
    likeButton.disabled = true;
}

function buildGIFCard(gifItem, isSaved) {
    // Create GIF Card element
    const newGifElement = document.createElement("article");
    newGifElement.classList.add("gif-card");
    newGifElement.id = gifItem.id;

    // Append GIF to card
    const gifImageElement = document.createElement('IMG');
    gifImageElement.src = gifItem.album.cover_big;
    gifImageElement.onclick = function() {
        sessionStorage.setItem("song", gifItem.id.toString())
        const player = document.getElementById("player");
        player.click();
    };

    newGifElement.appendChild(gifImageElement);

    // Append metadata to card
    const gifMetaContainerElement = document.createElement("div");
    newGifElement.appendChild(gifMetaContainerElement);

    // Append title to card metadata
    const gifTitleElement = document.createElement("h3");
    const gifTitleNode = document.createTextNode(gifItem.title || 'No title');
    gifTitleElement.appendChild(gifTitleNode);
    gifMetaContainerElement.appendChild(gifTitleElement);

    // Append favorite button to card metadata
    const favButtonElement = document.createElement("button");
    favButtonElement.setAttribute('aria-label', `Save ${gifItem.title}`);
    favButtonElement.classList.add("button");
    favButtonElement.dataset.gifId = gifItem.id;
    favButtonElement.onclick = addGIFToFavorite;
    const favIconElement = document.createElement("i");
    favIconElement.classList.add("fas", "fa-heart");
    favButtonElement.appendChild(favIconElement);
    gifMetaContainerElement.appendChild(favButtonElement);

    // Disable button (set GIF as liked) if liked
    if (isSaved) {
        favButtonElement.disabled = true;
    }

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.appendChild(newGifElement);
}

window.addEventListener("DOMContentLoaded", async function () {
    setLoading(true);

    // TODO: 1a - Set up a new URL object to use Giphy trending endpoint
    const url = "https://api.deezer.com/chart/0/tracks?limit=50"
    // TODO: 1b - Set proper query parameters to the newly created URL object
    const option = {
        method: 'GET'
    }
    try {
        // TODO: 1c - Fetch GIFs from Giphy Trending endpoint
        fetch(url, option).then(response => {
            console.log(response.body)
            // TODO: 1e - Convert Giphy response to json
            return response.json()
        }
        ).then(json => {
            // TODO: 1f - Use 'response.data' in the constant 'gifs' instead of an empty array
            const gifs = json.data; // replace array by data
            const db = window.db;
            // TODO: 4d - Open IndexedDB's database
            db.open().catch(err => {
                console.error('Failed to open db : ' + (err.stack || err));
            });
            // Display every GIF
            gifs.forEach(async gif => {
                // TODO: 4e - Get GIF from IndexedDB's database, by its ID
                const dbGif = await db.gifs.where({
                    id: gif.id.toString()
                }).toArray();
                // TODO: 4f - Create a boolean `isSaved` to check if the GIF was already saved
                const isSaved = dbGif.length == 0 ? false : true; // replace false by the condition
                // TODO: 1g - Call the function buildGIFCard with proper parameters
                // TIP: Use the boolean `isSaved`
                buildGIFCard(gif, isSaved);
            });
        }).catch(error => console.log(error));
    } catch (e) {
        // TODO: 1h - Display a message in console in case of error
        console.log("An error occured, please try again.");
    } finally {
        setLoading(false);
    }
});
