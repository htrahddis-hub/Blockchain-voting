import express from "express";
import bodyParser from "body-parser";
import auth from "./routes/routes.js";
import face from "./routes/face.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

dotenv.config();

app.use("/auth", auth);
app.use("/kyc", face);

app.get("/", (req, res) => {
  res.send("Server for Voting Blockchain system");
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).single("file");
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(req.file);
  });
});
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is live");
    });
  })
  .catch((err) => console.log(err));
