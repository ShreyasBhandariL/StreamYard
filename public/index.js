const videoElement = document.getElementById("video");
const streamButton = document.getElementById("StartButton");

const state = { media: null };

const socket = io("http://localhost:4000");

const setUserMedia = async (e) => {
  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  state.media = media;
  videoElement.srcObject = media;
};

const sendData = () => {
  const mediaRecorder = new MediaRecorder(state.media, {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 5000000,
    framerate: 50,
  });

  mediaRecorder.ondataavailable = (ev) => {
    console.log(ev.data);
    socket.emit("stream-data", ev.data);
  };

  mediaRecorder.start(10);
};

streamButton.addEventListener("click", sendData);
window.addEventListener("load", setUserMedia);
