var fillBar = document.getElementById("fill");
var isReadyToPlay = false
var player = new Audio();
player.autoplay = true;
var song;
var url;

function setLoading(isLoading) {
    const loaderElement = document.getElementById("loader");
    const gifsElement = document.getElementById("player");
    if (isLoading) {
        loaderElement.style.display = null;
        gifsElement.style.display = "none";
    }
    else {
        loaderElement.style.display = "none";
        gifsElement.style.display = null;
    }
}

function setPlayer(song) {
    const image = document.getElementById('player-image');
    const title = document.getElementById('player-title-album');
    const artist = document.getElementById('player-artist');

    console.log("test :" + song.album.cover_big + song.title + ' / ' + song.album.title + song.artist.name);
    image.src = song.album.cover_big;
    title.textContent = song.title + ' / ' + song.album.title;
    artist.textContent = song.artist.name;
}

function play() {
    if (!isReadyToPlay || !this.song) {
        return;
    }
    player.play();
}

function playOrPauseSong(){
    const playPauseImage = document.getElementById('play-image');
    if(player.paused){
        player.play();
        playPauseImage.src = "/assets/images/pause.png";
    } else {
        player.pause();
        playPauseImage.src = "/assets/images/play.png";
    }
}

function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ':' + ((sec<10) ? ('0' + sec) : sec);
  }

player.addEventListener('timeupdate',function(){
    const spanCurrentTime = document.getElementById('currentTime');
    const spanTotalTime = document.getElementById('totalTime');

    spanCurrentTime.textContent = formatTime(player.currentTime);
    spanTotalTime.textContent = formatTime(player.duration);
    var position = player.currentTime / player.duration;
    fillBar.style.width = position * 100 +'%';
});

window.addEventListener("DOMContentLoaded", async function () {
    setLoading(true);
    var song = sessionStorage.getItem('song');
    // TODO: 1a - Set up a new URL object to use Giphy trending endpoint
    const url = "https://api.deezer.com/track/" + song
    // TODO: 1b - Set proper query parameters to the newly created URL object
    const option = {
        method: 'GET'
    }
    try {
        // TODO: 1c - Fetch GIFs from Giphy Trending endpoint
        fetch(url, option)
        .then(response => response.json())
        .then(json => {
            this.song = json; // replace array by data
            isReadyToPlay = true;
            setPlayer(this.song);
            player.src = this.song.preview;  //set the source of 0th song  
            player.textContent = this.song.title; // set the title of song
        }).catch(error => console.log(error));
    } catch (e) {
        // TODO: 1h - Display a message in console in case of error
        console.log("An error occured, please try again.");
    } finally {
        setLoading(false);
    }
});
