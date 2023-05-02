import express from "express";
import { CompreFace } from "@exadel/compreface-js-sdk";
import path from "node:path";
import fs from "node:fs";
import { promisify } from "node:util";
import multer from "multer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.js";

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

function auth(req, res, next) {
  try {
    const data = req.body.token;
    console.log(req.body);
    if (data === undefined) res.status(401).json({ messages: "empty" });
    else {
      const decoded = jwt.verify(data, process.env.PRIVATEKEY);
      if (decoded) {
        req.body.userId = decoded.id;
        next();
      } else res.status(401).json({ message: "invalid-token" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "invalid token", error: error });
  }
}

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

router.post("/image", upload.single("file"), auth, async (req, res) => {
  // console.log(req.body);
  const image = path.resolve(req.file.path);
  console.log(req.file);
  const bitmap = fs.readFileSync(image, "base64");

  UserModel.find();
  const user = await UserModel.findById(req.body.userId);
  user.image = bitmap;
  user.imageName = req.file.filename;
  await user.save();

  res.status(200).send({ message: "ok" });
  unlinkAsync(req.file.path);
});

router.post("/verify", upload.single("file"), auth, async (req, res) => {
  const image = path.resolve(req.file.path);
  const pathImage = image.replace(req.file.filename, "");

  const user = await UserModel.findById(req.body.userId);
  const buffer = Buffer.from(user.image, "base64");

  const finalPath = `${pathImage}/${user.imageName}`;

  fs.writeFileSync(finalPath, "");
  fs.writeFileSync(finalPath, buffer);
  const image2 = path.resolve(finalPath);

  verificationService
    .verify(image, image2, options)
    .then((response) => {
      console.log(response.result[0].face_matches[0].box);
      if (response.result[0].face_matches[0].similarity > 0.9) {
        res.status(200).send({ message: "ok", isMatch: true });
        unlinkAsync(image);
        unlinkAsync(image2);
      } else {
        res.status(200).send({ message: "ok", isMatch: false });
        unlinkAsync(image);
        unlinkAsync(image2);
      }
    })
    .catch((error) => {
      res.status(200).send({ message: "ok", isMatch: false });
      unlinkAsync(image);
      unlinkAsync(image2);
    });
});

export default router;
