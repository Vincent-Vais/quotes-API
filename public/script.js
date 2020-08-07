const fetchAllButton = document.getElementById("fetch-quotes");
const fetchRandomButton = document.getElementById("fetch-random");
const fetchByAuthorButton = document.getElementById("fetch-by-author");

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.querySelector(".quote");
const attributionText = document.querySelector(".attribution");

const logoContainer = document.querySelector(".logo");
const interactContainer = document.querySelector(".interact");
const resultsContainer = document.querySelector(".results");

const newQuoteBtn = document.querySelector(".new-quote");
let newQuoteBtnPositionLeft = newQuoteBtn.getBoundingClientRect().left;
const newQuoteBcg = document.querySelector(".new-qoute-interface");
const newQuoteBody = document.querySelector(".new-qoute-interface div");
const closeQuoteBtn = document.querySelector(".new-qoute-interface i");
const sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
const newQuoteContainer = document.querySelector(
  ".new-qoute-interface div div:first-child"
);

const closeBtn = document.querySelector(".close-butn");
const showBtn = document.querySelector(".aside-container i");

const easing = BezierEasing(0, 0, 0.1, 0.92);

const state = {
  span: 100,
  start: true,
};
const resetQuotes = () => {
  quoteContainer.innerHTML = "";
};

const renderError = (response) => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach((quote) => {
      const newQuote = document.createElement("div");
      // newQuote.className = "single-quote";
      // newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      newQuote.innerHTML = `
      <div class="card">
        <div class="card-header"></div>
        <div class="card-body">
          <blockquote class="blockquote mb-0">
            <p>
            ${quote.quote}
            </p>
            <footer class="blockquote-footer">
            ${quote.person}
            </footer>
          </blockquote>
        </div>
      </div>`;
      quoteContainer.appendChild(newQuote);
    });
  } else {
    quoteContainer.innerHTML = "<p>Your request returned no quotes.</p>";
  }
};

const showXButton = () => {
  closeBtn.classList.remove("hidden");
};

const hideXButton = () => {
  closeBtn.classList.remove("add");
};

const makeSpace = (quotes) => {
  let start = Date.now();
  let p;
  let currentSpan;
  let size = state.span;
  let curPos = newQuoteBtnPositionLeft;
  const stop = window.setInterval(
    () => {
      p = (Date.now() - start) / 500;
      currentSpan = size - 50 * easing(p);
      if (currentSpan > 50) {
        newQuoteBtn.style.left = `${curPos - p * 200}px`;
        curPos--;
        logoContainer.style.gridColumn = `1 / span ${
          parseInt(currentSpan) - 1
        }`;
        interactContainer.style.gridColumn = `1 / span ${
          parseInt(currentSpan) - 1
        }`;
        resultsContainer.style.gridColumn = `${parseInt(currentSpan)} / span ${
          101 - parseInt(currentSpan)
        }`;
      } else {
        clearInterval(stop);
        state.span = currentSpan;
        newQuoteBtnPositionLeft = curPos;
        renderQuotes(quotes);
        if (state.start) {
          state.start = false;
          showXButton();
        }
      }
    },
    0.00001,
    start
  );
};

const reduceSpace = (quotes) => {
  let start = Date.now();
  let p;
  let currentSpan;
  let size = state.span;
  let curPos = newQuoteBtnPositionLeft;
  resetQuotes();
  const stop = window.setInterval(
    () => {
      p = (Date.now() - start) / 500;
      currentSpan = size + 50 * easing(p);
      if (currentSpan < 100) {
        newQuoteBtn.style.left = `${curPos + p * 235}px`;
        curPos--;
        logoContainer.style.gridColumn = `1 / span ${
          parseInt(currentSpan) - 1
        }`;
        interactContainer.style.gridColumn = `1 / span ${
          parseInt(currentSpan) - 1
        }`;
        resultsContainer.style.gridColumn = `${parseInt(currentSpan)} / span ${
          101 - parseInt(currentSpan)
        }`;
      } else {
        clearInterval(stop);
        state.span = currentSpan;
        newQuoteBtnPositionLeft = 0;
        if (!state.start) {
          state.start = true;
          hideXButton();
        }
      }
    },
    0.00001,
    start
  );
};

const handleQuotes = (quotes) => {
  if (state.span < 90) {
    renderQuotes(quotes);
  } else {
    makeSpace(quotes);
  }
};

fetchAllButton.addEventListener("click", () => {
  fetch("/api/quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      handleQuotes(response.quotes);
    });
});

fetchRandomButton.addEventListener("click", () => {
  fetch("/api/quotes/random")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      handleQuotes([response.quote]);
    });
});

fetchByAuthorButton.addEventListener("click", () => {
  const author = document.getElementById("author").value;
  fetch(`/api/quotes?person=${author}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      handleQuotes(response.quotes);
    });
});

showBtn.addEventListener("click", makeSpace);

closeBtn.addEventListener("click", reduceSpace);

newQuoteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sumbitQuoteBtn.style.display = "inline-block";
  newQuoteBcg.classList.add("show");
  newQuoteBody.classList.add("show");
  newQuoteBcg.style.display = "block";
  newQuoteBody.style.display = "flex";
});

closeQuoteBtn.addEventListener("click", () => {
  newQuoteBcg.classList.add("rm");
  newQuoteBody.classList.add("rm");
  window.setTimeout(() => {
    newQuoteBcg.classList.remove("show");
    newQuoteBody.classList.remove("show");
    newQuoteBcg.classList.remove("rm");
    newQuoteBody.classList.remove("rm");
    newQuoteBcg.style.display = "none";
    newQuoteBody.style.display = "none";
    let newQuote = `
    <h2>Add a New Quote</h2>
    <div class="form-group">
      <label for="quote">Quote text:</label>
      <input id="quote" value="" class="form-control">
    </div>
    <div class="form-group">
      <label for="person">Person:</label>
      <input id="person" value="" class="form-control">
    </div>
    `;
    newQuoteContainer.innerHTML = newQuote;
  }, 1500);
});

sumbitQuoteBtn.addEventListener("click", () => {
  const quote = document.getElementById("quote").value;
  const person = document.getElementById("person").value;

  fetch(`/api/quotes?quote=${quote}&person=${person}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then(({ quote }) => {
      sumbitQuoteBtn.style.display = "none";
      newQuoteContainer.innerHTML = "";
      const newQuote = document.createElement("div");
      newQuote.innerHTML = `
    <h3>Congrats, your quote was added!</h3>
    <div class="quote-text">${quote.quote}</div>
    <div class="attribution">- ${quote.person}</div>
    <div>
    `;
      newQuoteContainer.appendChild(newQuote);
    });
});
