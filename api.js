const express = require("express");

const { quotes } = require("./data");
const { getRandomElement, getQuotes } = require("./utils");

const apiRouter = express.Router();

// Get all quotes
apiRouter.get("/quotes", (req, res, next) => {
  if (req.query.data) {
    const data = req.query.data;
    const type = req.query.type;
    const foundQuotes = getQuotes(quotes, data, type);
    if (foundQuotes) {
      const result = { quotes: foundQuotes };
      res.send(result);
    } else {
      res.status(404).send("No author is found");
    }
  } else {
    const result = { quotes: quotes };
    res.send(result);
  }
});

// New quote
apiRouter.post("/quotes", (req, res, next) => {
  if (req.query.quote && req.query.person) {
    const newQuote = {
      quote: req.query.quote,
      person: req.query.person,
    };
    quotes.push(newQuote);
    res.send({ quote: newQuote });
  } else {
    res.status(404).send("Quote is empty");
  }
});

// Get a random quote
apiRouter.get("/quotes/random", (req, res, next) => {
  const randomQuote = getRandomElement(quotes);
  const result = { quotes: [randomQuote] };
  res.send(result);
});

module.exports = apiRouter;
