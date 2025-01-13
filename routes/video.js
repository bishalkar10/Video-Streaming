import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const CHUNK_SIZE = 300 * 1024; // 300KB chunk size

router.get("/stream", (req, res) => {
  const videoPath = path.join(__dirname, "../public/videos/sample.mp4");
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = Math.min(CHUNK_SIZE, end - start + 1);
    const file = fs.createReadStream(videoPath, { start, end });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    res.writeHead(200, { "Content-Type": "video/mp4" });

    const stream = fs.createReadStream(videoPath, {
      highWaterMark: CHUNK_SIZE,
    });

    stream.on("data", (chunk) => {
      res.write(chunk);
    });

    stream.on("end", () => {
      res.end();
    });
  }
});

export default router;
