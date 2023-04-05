import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import UserModel from "../model/user.js";
import { isEmail } from "../util/index.js";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { data } = req.body;

  if (data == undefined) res.status(204).json({ messages: "empty" });
  if (!isEmail(data.email)) res.status(204).json({ message: "invali email" });
  if (data.password < 5) res.status(204).json({ message: "invalid password" });

  bcrypt.hash(data.password, 10, function (err, hash) {
    if (err) console.log(err);
    UserModel.create({ email: data.email, password: hash })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => res.status(403).json({ message: "Email already exist" }));
  });
});

export default router;
