async function removeGIFFromFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);
    const gifImageUrl = gifElement.querySelector('img').src;

    const db = window.db;

    // TODO: 6a - Open IndexedDB's database
    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
    // TODO: 6b - Remove GIF from local database using its ID
    await db.gifs.delete(gifId);
    // TODO: 6c - Remove GIF media (image and video) from cache // Fontionne pas
    //  caches.open("gif-cache").then(cache => {
    //      cache.delete(gifImageUrl);
    //  })
    // Remove GIF element
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.removeChild(gifElement);

}

function buildGIFCard(gifItem) {
    // Create GIF Card element
    const newGifElement = document.createElement("article");
    newGifElement.classList.add("gif-card");
    newGifElement.id = gifItem.id;

    // Append image to card
    const gifImageElement = document.createElement('IMG');
    gifImageElement.src = gifItem.imageUrl;
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

    // Append remove button to card metadata
    const removeButtonElement = document.createElement("button");
    removeButtonElement.setAttribute('aria-label', `Remove ${gifItem.title}`);
    removeButtonElement.classList.add("button");
    removeButtonElement.dataset.gifId = gifItem.id;
    removeButtonElement.onclick = removeGIFFromFavorite;
    const removeIconElement = document.createElement("i");
    removeIconElement.classList.add("fas", "fa-times");
    removeButtonElement.appendChild(removeIconElement);
    gifMetaContainerElement.appendChild(removeButtonElement);

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.appendChild(newGifElement);
}

window.addEventListener("DOMContentLoaded", async function () {
    const db = window.db;

    // TODO: 5a - Open IndexedDB's database
    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
    // TODO: 5b - Fetch saved GIFs from local database and display them (use function buildGIFCard)
    const gifs = await db.gifs.toArray();
    gifs.forEach(gif => {
        buildGIFCard(gif);
    })
});
