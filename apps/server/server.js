const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();

app.use(cors()); // Crucial for your Samsung Galaxy to talk to your PC

app.get("/download", (req, res) => {
  const musicUrl = req.query.url;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const pythonProcess = spawn("python3", ["downloader.py", musicUrl]);

  pythonProcess.stdout.on("data", (data) => {
    // Send data directly to the stream
    res.write(`data: ${data.toString()}\n\n`);
  });

  pythonProcess.on("close", () => res.end());
});

app.listen(4000, "0.0.0.0", () => {
  console.log("🎵 My Melody Engine humming on port 4000");
});
