const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { spawn } = require("child_process");

const path = require("path");
const app = express();

app.use(express.static(path.resolve("./public")));

const server = http.createServer(app);

const io = new Server(server);

const options = [
  "-i",
  "-",
  "-c:v",
  "libx264",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  `${25}`,
  "-g",
  `${25 * 2}`,
  "-keyint_min",
  25,
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p",
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  128000 / 4,
  "-f",
  "flv",
  `rtmp://a.rtmp.youtube.com/live2/cmt7-g85g-1ebr-qke4-59e5`,
];

const ffmpegProcess = spawn("ffmpeg", options);

// ffmpegProcess.stdout.on("data", (data) => {
//   console.log(data);
// });

ffmpegProcess.stderr.on("data", (data) => {
  console.log(data);
});

ffmpegProcess.on("close", () => {
  console.log("Close streaming");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);
  socket.on("stream-data", (data) => {
    ffmpegProcess.stdin.write(data, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});

server.listen("4000", () => {
  console.log("Server is running at port 4000");
});
