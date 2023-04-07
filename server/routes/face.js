import express from "express";
import { CompreFace } from "@exadel/compreface-js-sdk";
import path from "node:path";
import fs from "node:fs";
import { promisify } from "node:util";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const unlinkAsync = promisify(fs.unlink);

const api_key = "48660eb5-2b1b-405b-8cfd-3633180a7b4d";
const url = "http://localhost";
const port = 8000;

const compreFace = new CompreFace(url, port);
const detectionService = compreFace.initFaceDetectionService(api_key);

let options = {
  limit: 1,
  det_prob_threshold: 0.8,
  status: "true",
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "routes/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/detect", upload.single("file"), (req, res) => {
  const image = path.resolve(req.file.path);
  detectionService
    .detect(image, options)
    .then((response) => {
      const ans = JSON.stringify(response);
      res.send(ans);
      unlinkAsync(req.file.path);
    })
    .catch((error) => {
      console.log(`Oops! There is problem with recognizing image ${error}`);
    });
});

export default router;
