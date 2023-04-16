import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import UserModel from "../model/user.js";
import { isEmail } from "../util/index.js";
import dotenv from "dotenv";

import path from "node:path";
import fs from "node:fs";

const router = express.Router();
dotenv.config();

router.post("/signup", (req, res) => {
  const { data } = req.body;

  if (data == undefined) res.status(401).json({ messages: "empty" });
  else {
    if (!isEmail(data.email)) res.status(401).json({ message: "invali email" });
    else {
      if (data.password.length < 5)
        res.status(401).json({ message: "invalid password" });
      else {
        bcrypt.hash(data.password, 10, function (err, hash) {
          if (err) console.log(err);
          UserModel.create({ email: data.email, password: hash })
            .then((user) => {
              res.status(200).json({ message: "Signup successful" });
            })
            .catch((err) =>
              res.status(403).json({ message: "Email already exist" })
            );
        });
      }
    }
  }
});

router.post("/login", (req, res) => {
  const { data } = req.body;

  if (data == undefined) res.status(401).json({ messages: "empty" });
  else {
    if (!isEmail(data.email)) res.status(401).json({ message: "invali email" });
    else {
      if (data.password < 5)
        res.status(401).json({ message: "invalid password" });
      else {
        UserModel.find({ email: data.email })
          .lean()
          .then((user) => {
            if (user.length === 0)
              res.status(401).json({ message: "No such User/Email exist" });
            else {
              bcrypt.compare(data.password, user[0].password).then((result) => {
                if (result) {
                  jwt.sign(
                    { id: user[0]._id },
                    process.env.PRIVATEKEY,
                    { expiresIn: "48h" },
                    function (err, token) {
                      if (err) console.log(err);
                      if (err) console.log(err);
                      res
                        .status(200)
                        .json({ message: "Login Successful", jwt: token });
                    }
                  );
                } else res.status(401).json({ message: "Wrong password" });
              });
            }
          });
      }
    }
  }
});

router.post("/verify", (req, res) => {
  try {
    const { data } = req.body;
    if (data == undefined) res.status(401).json({ messages: "empty" });
    else {
      const decoded = jwt.verify(data.token, process.env.PRIVATEKEY);
      if (decoded) {
        res.status(200).json({
          message: "verification successful",
        });
      } else res.status(401).json({ message: "invalid-token" });
    }
  } catch (error) {
    res.status(401).json({ message: "invalid token", error: error });
  }
});

export default router;
