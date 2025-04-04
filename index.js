const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const songTitle = document.getElementById("song-title");
const cdContainer = document.querySelector(".cd-container");
const songList = document.getElementById("song-list");

const songs = [
  { title: "You and Me", src: "You and me.mp3" },
  { title: "I Miss You", src: "I miss you.mp3" },
  { title: "I Want You", src: "I want you.mp3" },
  { title: "Dream Display", src: "dream display.mp3" }
];

let songIndex = 0;
let isPlaying = false;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  audio.load();

  if (isPlaying) {
    audio.play();
    playButton.innerHTML = "❚❚";
    cdContainer.classList.add("playing");
  } else {
    playButton.innerHTML = "▶";
    cdContainer.classList.remove("playing");
  }

  updateSongListHighlight();
}

function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playButton.innerHTML = "▶";
    cdContainer.classList.remove("playing");
  } else {
    audio.play();
    isPlaying = true;
    playButton.innerHTML = "❚❚";
    cdContainer.classList.add("playing");
  }
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  if (isPlaying) audio.play();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  if (isPlaying) audio.play();
}

function updateProgress() {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
}

function setProgress() {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateSongListHighlight() {
  const items = songList.querySelectorAll("li");
  items.forEach((li, idx) => {
    li.classList.toggle("active", idx === songIndex);
  });
}

songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = song.title;
  li.addEventListener("click", () => {
    songIndex = index;
    loadSong(songIndex);
    audio.play();
    isPlaying = true;
    playButton.innerHTML = "❚❚";
    cdContainer.classList.add("playing");
  });
  songList.appendChild(li);
});

playButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", prevSong);
audio.addEventListener("timeupdate", updateProgress);
progressBar.addEventListener("input", setProgress);
audio.addEventListener("ended", nextSong);
audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

loadSong(songIndex);
audio.pause();
isPlaying = false;
cdContainer.classList.remove("playing");
playButton.innerHTML = "▶";
