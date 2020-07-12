var fillBar = document.getElementById("fill");
var isReadyToPlay = false;
const player = new Audio();
player.autoplay = true;
var song;
var url;

function setLoading(isLoading) {
    const loaderElement = document.getElementById("loader");
    const gifsElement = document.getElementById("player");
    if (isLoading) {
        loaderElement.style.display = null;
        gifsElement.style.display = "none";
    } else {
        loaderElement.style.display = "none";
        gifsElement.style.display = null;
    }
}

function setPlayer(song) {
    const image = document.getElementById('player-image');
    const title = document.getElementById('player-title-album');
    const artist = document.getElementById('player-artist');

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

function previous() {
    player.currentTime = 0;
}

function next() {
    player.currentTime = 0;
}

function loop() {
    const loopButton = document.getElementById("loop");
    player.loop = !player.loop;
    loopButton.style.backgroundColor = (player.loop) ? "rgb(155, 102, 102)" : "rgb(65, 105, 225)";
}

function playOrPauseSong(){
    const playPauseImage = document.getElementById('play-image');
    if(player.paused){
        player.play();
        playPauseImage.src = "/src/assets/images/pause.png";
    } else {
        player.pause();
        playPauseImage.src = "/src/assets/images/play.png";
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
    const url = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/" + song
    const option = {
        method: 'GET'
    }
    try {
        fetch(url, option)
        .then(response => response.json())
        .then(json => {
            this.song = json;
            isReadyToPlay = true;
            setPlayer(this.song);
            player.src = this.song.preview; 
            player.textContent = this.song.title;
        }).catch(error => console.log(error));
    } catch (e) {
        console.log("An error occured, please try again.");
    } finally {
        setLoading(false);
    }
});
