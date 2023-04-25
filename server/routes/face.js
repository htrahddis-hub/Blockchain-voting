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

const url = "http://localhost";
const port = 8000;

const compreFace = new CompreFace(url, port);
const detectionService = compreFace.initFaceDetectionService(
  process.env.APIDETECT
);
const verificationService = compreFace.initFaceVerificationService(
  process.env.APIVERIFY
);

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
      if (response.result[0].box.probability > 0.8);
      res.status(200).send({ message: "ok", isFace: true });
      unlinkAsync(req.file.path);
    })
    .catch((error) => {
      res.status(200).send({ message: "ok", isFace: false });
      unlinkAsync(req.file.path);
    });
});

router.post("/verify", upload.array(), (req, res) => {
  console.log(req.file);
});

export default router;
