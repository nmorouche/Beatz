var fillBar = document.getElementById("fill");
var footerFillBar = document.getElementById("footer-fill");
const reducePlayer = document.getElementById("player-reduce");
const divPlayer = document.getElementById('player');
const favoris = document.getElementById('favoris');
const divGifs = document.getElementById('gifs');
const deleteFromFavorisButton = document.getElementById('')
var gifs;
var currentID = 0;
var player = new Audio()
player.autoplay = true;

async function deleteFromFavoris(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.id;

    const gifElement = document.getElementById(gifId);
    const favButtonElement = document.getElementById('fav-' + gifId.replace('-fav', ''));

    if (favButtonElement != undefined) {
        favButtonElement.disabled = false;
    }

    const db = window.db;

    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
    console.log("testlog :" + gifId.replace('-fav', ''));
    await db.gifs.delete(parseInt(gifId.replace('-fav', '')));
    const listFavoris = document.getElementById("listFavoris");
    listFavoris.removeChild(gifElement);

}
function buildFavorisSong(gifItem) {
    const ulElement = document.getElementById("listFavoris")
    const newGifElement = document.createElement("li");
    newGifElement.classList.add("w3-bar");
    newGifElement.id = gifItem.id + '-fav';

    const deleteElement = document.createElement("span");
    deleteElement.classList.add("w3-bar-item");
    deleteElement.classList.add("w3-button");
    deleteElement.classList.add("w3-white");
    deleteElement.classList.add("w3-xlarge");
    deleteElement.classList.add("w3-right");
    deleteElement.onclick = deleteFromFavoris;
    deleteElement.dataset.id = gifItem.id + '-fav';
    deleteElement.textContent = "x";

    const newImgElement =  document.createElement("IMG");
    newImgElement.classList.add("w3-bar-item");
    newImgElement.classList.add("w3-circle");
    newImgElement.classList.add("w3-hide-small");
    newImgElement.src = gifItem.cover_big;
    newImgElement.style.cssText = "width: 53px; height: 53px; padding: 0;"
    newImgElement.onclick = function() {
        divGifs.style.display = 'none';
        setFavPlayer(gifItem);
        divPlayer.style.display = 'block';
        favoris.style.display = 'none';
    };

    const divElement = document.createElement("div");
    divElement.classList.add("w3-bar-item");
    divElement.onclick = function () {
        divGifs.style.display = 'none';
        setFavPlayer(gifItem);
        divPlayer.style.display = 'block';
        favoris.style.display = 'none';
    }

    const spanTitleElement = document.createElement("SPAN");
    spanTitleElement.classList.add("w3-large");
    spanTitleElement.textContent = gifItem.title

    const brElement1 = document.createElement("br");
    const brElement2 = document.createElement("br");

    const spanArtistElement = document.createElement("span");
    spanArtistElement.textContent = gifItem.album;

    const songDurationElement = document.createElement("span");
    songDurationElement.textContent = gifItem.duration;

    newGifElement.appendChild(deleteElement);
    newGifElement.appendChild(newImgElement);
    
    divElement.appendChild(spanTitleElement);
    divElement.appendChild(brElement1);
    divElement.appendChild(spanArtistElement);
    divElement.appendChild(brElement2);
    divElement.appendChild(songDurationElement);
    
    newGifElement.appendChild(divElement);
    
    ulElement.appendChild(newGifElement);
}

function setLoading(isLoading) {
    const loaderElement = document.getElementById("loader");
    const gifsElement = document.getElementById("player");
    if (isLoading) {
        if(player.paused){
            player.play();
            playPauseImage.src = "/src/assets/images/pause.png";
            playPauseImageFooter.src = "/src/assets/images/pause.png";
        } else {
            player.pause();
            playPauseImage.src = "/src/assets/images/play.png";
            playPauseImageFooter.src = "/src/assets/images/play.png";
        }
        loaderElement.style.display = null;
        gifsElement.style.display = "none";
    } else {
        loaderElement.style.display = "none";
        gifsElement.style.display = null;
    }
}

function setFavPlayer(song) {
    this.currentID = song.id;

    const image = document.getElementById('player-image');
    const title = document.getElementById('player-title-album');
    const artist = document.getElementById('player-artist');

    const footerImage = document.getElementById('footer-player-image');
    const footerTitle = document.getElementById('footer-player-title-album');
    const footerArtist = document.getElementById('footer-player-artist');

    player.src = song.preview;

    image.src = song.cover_big;
    title.textContent = song.title + ' / ' + song.album;
    artist.textContent = song.artist;

    footerImage.src = song.cover_big;
    footerTitle.textContent = song.title + ' / ' + song.album;
    footerArtist.textContent = song.artist;
}

function setPlayer(song) {
    this.currentID = song.id;

    const image = document.getElementById('player-image');
    const title = document.getElementById('player-title-album');
    const artist = document.getElementById('player-artist');

    const footerImage = document.getElementById('footer-player-image');
    const footerTitle = document.getElementById('footer-player-title-album');
    const footerArtist = document.getElementById('footer-player-artist');

    player.src = song.preview;

    image.src = song.album.cover_big;
    title.textContent = song.title + ' / ' + song.album.title;
    artist.textContent = song.artist.name;

    footerImage.src = song.album.cover_big;
    footerTitle.textContent = song.title + ' / ' + song.album.title;
    footerArtist.textContent = song.artist.name;
}

function play() {
    player.play();
}

function playOrPauseSong(){
    const playPauseImage = document.getElementById('play-image');
    const playPauseImageFooter = document.getElementById('footer-play-image');
    if(player.paused){
        player.play();
        playPauseImage.src = "/src/assets/images/pause.png";
        playPauseImageFooter.src = "/src/assets/images/pause.png";
    } else {
        player.pause();
        playPauseImage.src = "/src/assets/images/play.png";
        playPauseImageFooter.src = "/src/assets/images/play.png";
    }
}

function next() {
    if (this.currentID === 0) {
        return
    }
    var index = this.gifs.findIndex(x => x.id === this.currentID);
    if (index === undefined) {
        return
    }
    if(index === this.gifs.length-1) {
        setPlayer(this.gifs[0])
    } else {
        setPlayer(this.gifs[index+1])
    }
    
}

function previous() {
    if (this.currentID === 0) {
        return
    }
    var index = this.gifs.findIndex(x => x.id === this.currentID);
    if (index === undefined) {
        return
    }
    if(index == 0) {
        setPlayer(this.gifs[this.gifs.length-1]);
    } else {
        setPlayer(this.gifs[index-1])
    }
}

function loop() {
    const loopButton = document.getElementById("loop");
    const footerLoopButton = document.getElementById("footer-loop");
    player.loop = !player.loop;
    loopButton.style.backgroundColor = (player.loop) ? "rgb(155, 102, 102)" : "rgb(65, 105, 225)";
    footerLoopButton.style.backgroundColor = (player.loop) ? "rgb(155, 102, 102)" : "rgb(65, 105, 225)";
}


function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    if (isNaN(min) || isNaN(sec)) {
        return "--:--"
    }
    return min + ':' + ((sec<10) ? ('0' + sec) : sec);
}

player.addEventListener("ended", function(){
    next();
});

player.addEventListener('timeupdate',function(){
    const spanCurrentTime = document.getElementById('currentTime');
    const spanTotalTime = document.getElementById('totalTime');

    const spanCurrentTimeFooter = document.getElementById('footer-currentTime');
    const spanTotalTimeFooter = document.getElementById('footer-totalTime');

    spanCurrentTime.textContent = formatTime(player.currentTime);
    spanTotalTime.textContent = formatTime(player.duration);

    spanCurrentTimeFooter.textContent = formatTime(player.currentTime);
    spanTotalTimeFooter.textContent = formatTime(player.duration);

    var position = player.currentTime / player.duration;
    fillBar.style.width = position * 100 +'%';
    footerFillBar.style.width = position * 100 + '%';
});

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
    
    var index = gifs.findIndex(x => x.id == gifId);

    const db = window.db;

    db.open().catch(err => {
        console.error('Failed to open db : ' + (err.stack || err));
    });
    console.log("test log :" + formatTime(gifs[index].duration));
    db.gifs.add({
        id: gifs[index].id,
        title: gifs[index].title,
        artist: gifs[index].artist.name,
        album: gifs[index].album.title,
        cover_big: gifs[index].album.cover_big,
        preview: gifs[index].preview,
        duration: formatTime(gifs[index].duration)
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
    buildFavorisSong({
        id: gifs[index].id,
        title: gifs[index].title,
        artist: gifs[index].artist.name,
        album: gifs[index].album.title,
        cover_big: gifs[index].album.cover_big,
        preview: gifs[index].preview,
        duration: formatTime(gifs[index].duration)
    }); 
}

function buildGIFCard(gifItem, isSaved) {
    const newGifElement = document.createElement("article");
    newGifElement.classList.add("gif-card");
    newGifElement.id = gifItem.id;

    const gifImageElement = document.createElement('IMG');
    gifImageElement.src = gifItem.album.cover_big;
    gifImageElement.onclick = function() {
        divGifs.style.display = 'none';
        setPlayer(gifItem)
        divPlayer.style.display = 'block';
        favoris.style.display = 'none';
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
    favButtonElement.setAttribute('id', 'fav-' + gifItem.id);
    favButtonElement.classList.add("button");
    favButtonElement.dataset.gifId = gifItem.id;
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

reducePlayer.addEventListener("click", async function() {
    divPlayer.style.display = 'none'
    divGifs.style.display = 'grid'
    favoris.style.display = 'block';
})

window.addEventListener("DOMContentLoaded", async function () {
    setLoading(true);

    const url = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart/0/tracks?limit=50"
    const option = {
        method: 'GET'
    }
    try {
        fetch(url, option).then(response => {
            return response.json()
        }
        ).then(json => {
            this.gifs = json.data;
            const db = window.db;
            db.open().catch(err => {
                console.error('Failed to open db : ' + (err.stack || err));
            });
            this.gifs.forEach(async gif => {
                const dbGif = await db.gifs.where({
                    id: gif.id.toString()
                }).toArray();
                const isSaved = dbGif.length == 0 ? false : true;
                buildGIFCard(gif, isSaved);
            });
        }).catch(error => console.log(error));
        const gifsFavoris = await db.gifs.toArray();
        gifsFavoris.forEach(gif => {
            buildFavorisSong(gif);
        })
    } catch (e) {
        console.log("An error occured, please try again.");
    } finally {
        setLoading(false);
    }
});
