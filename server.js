const express = require("express");
const apiRouter = require("./api");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));
app.use("/api", apiRouter);

// Home
app.get("/", (req, res, next) => {
  res.send("./index.html");
});

// Not found pages
app.get("/:word", (req, res, next) => {
  res.status(400).send("Page not found");
});

// Get quote

app.listen(PORT, () => console.log("Serever has started"));
