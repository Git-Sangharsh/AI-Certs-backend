import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/ai-certs")
  .then(() => {
    console.log("mongoDb Connected");
  })
  .catch((err) => {
    console.log("mongoDb Error: " + err);
  });

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(port, () => {
  console.log(`server listening on ${port} `);
});
