import express from "express";
import bodyParser from "body-parser";
import auth from "./routes/routes.js";
import face from "./routes/face.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin:'http://localhost:3000',credentials: true}));

dotenv.config();

app.use("/auth", auth);
app.use("/kyc",face)

app.get("/", (req, res) => {
  res.send("Server for Voting Blockchain system");
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
