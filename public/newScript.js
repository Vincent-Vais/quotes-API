// const e = require("express");

// const fetchAllButton = document.getElementById("fetch-quotes");
// const fetchRandomButton = document.getElementById("fetch-random");
// const fetchByAuthorButton = document.getElementById("fetch-by-author");

// const quoteContainer = document.getElementById("quote-container");
// const quoteText = document.querySelector(".quote");
// const attributionText = document.querySelector(".attribution");

// const logoContainer = document.querySelector(".logo");
// const interactContainer = document.querySelector(".interact");
// const resultsContainer = document.querySelector(".results");

// const newQuoteBtn = document.querySelector(".new-quote");
// let newQuoteBtnPositionLeft = newQuoteBtn.getBoundingClientRect().left;
// const newQuoteBcg = document.querySelector(".new-qoute-interface");
// const newQuoteBody = document.querySelector(".new-qoute-interface div");
// const closeQuoteBtn = document.querySelector(".new-qoute-interface i");
// const sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
// const newQuoteContainer = document.querySelector(
//   ".new-qoute-interface div div:first-child"
// );

// const closeBtn = document.querySelector(".close-butn");
// const showBtn = document.querySelector(".aside-container i");

// ################### WORKING WITH API ###################

// Connect and fetch data
class ConnectAPI {
  constructor() {}
  async getData(event) {
    let url, quotes;
    if (!event.target.closest("button").dataset.type) {
      url = event.target.dataset.api;
    } else {
      const btn = event.target.closest("button");
      url = this.constructUrl(btn);
    }
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      quotes = result.quotes;
    } else {
      quotes = response;
    }
    return quotes;
  }
  submitNewQuote(btn) {
    console.log("triggered");
    const quote = document.getElementById("quote").value;
    const person = document.getElementById("person").value;

    return fetch(`/api/quotes?quote=${quote}&person=${person}`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          const error = new Error(response);
          throw error;
        }
      })
      .then((data) => {
        console.log(data);
        const markup = `<h3>Congrats, your quote was added!</h3>
            <div class="quote-text">${data.quote.quote}</div>
            <div class="attribution">- ${data.quote.person}</div>
            <div>`;
        return { response: true, markup: markup };
      })
      .catch((err) => {
        console.log(
          "Error occured while fetching /api/quotes?quote=${quote}&person=${person}"
        );
        return { response: false, markup: err };
      });
  }
  constructUrl(btn) {
    const data = btn.parentElement.firstChild.nextSibling.value;
    const type = btn.dataset.type;
    const url = `/api/quotes?data=${data}&type=${type}`;
    return url;
  }
}

// ################### MODIFIERS ###################

// Changing content
class ModifyContent {
  constructor() {
    this.quoteContainer = document.getElementById("quote-container"); // Holds all the data we add
    this.input = document.querySelector(".form-group > div:nth-child(2) input");
    this.button = document.querySelector(
      ".form-group > div:nth-child(2) button"
    );
    this.sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
    this.newQuoteContainer = document.querySelector(
      ".new-qoute-interface div div:first-child"
    );
  }
  resetQuotes() {
    this.quoteContainer.innerHTML = "";
    this.input.value = "";
  }
  renderError(response) {
    this.quoteContainer.innerHTML = `
    <div class="error">
        <p>Your request returned an error from the server: </p>
        <p>Code: ${response.status}</p>
        <p>${response.statusText}</p>
    </div>`;
  }
  renderQuotes(quotes = []) {
    this.resetQuotes();
    if (quotes.length > 0) {
      quotes.forEach((quote) => {
        const newQuote = document.createElement("div");
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
        this.quoteContainer.appendChild(newQuote);
      });
    } else {
      this.quoteContainer.innerHTML = `<div class="error">
          <div class="card">
            <div class="card-header">
              <p>Your request returned no quotes.</p>
            </div>
            <div class="card-body">
              <p>Please try another author</p>
            </div>
          </div>
        </div>`;
    }
  }
  renderInputAuthor() {
    this.input.placeholder = "Fetch by Author";
    this.button.dataset.type = "author";
  }
  renderInputText() {
    this.input.placeholder = "Fetch by Text";
    this.button.dataset.type = "text";
  }
  renderNewQuote(data) {
    this.sumbitQuoteBtn.style.display = "none";
    this.newQuoteContainer.innerHTML = "";
    const newQuote = document.createElement("div");
    newQuote.innerHTML = data.markup;
    this.newQuoteContainer.appendChild(newQuote);
  }
}

// Changing UI
class ModifyDesign {
  constructor(left, right) {
    this.XButton = document.querySelector(".close-butn"); // Used in toggle func

    // Init movers

    this.moverLeft = new MoverLeft(left, right);
    this.moverRight = new MoverRight(left, right);
  }
  // Showing content
  toggleXButton(type) {
    if (type === "show") {
      this.XButton.classList.remove("hidden");
    } else {
      this.XButton.classList.add("hidden");
    }
  }
  // Moving content
  changeSpace(type, data) {
    let start;
    start = Date.now();
    const vars = {
      start: start,
      width: parseInt(data.width.trim("%")),
      diff: this.calcDif(type, parseInt(data.width.trim("%"))),
      size: data.span,
    };
    let stop;
    if (type === "left") {
      // Calling left mover
      // Promise resolves to new values of span and width that will be set in Controller
      const promise = new Promise((resolve, reject) => {
        stop = window.setInterval(
          (vars, resolve) => {
            this.moverLeft.move(vars, stop, resolve);
          },
          0.00001,
          vars,
          resolve
        );
      });
      return promise;
    } else {
      // Calling right mover
      // Promise resolves to new values of span and width that will be set in Controller
      const promise = new Promise((resolve, reject) => {
        stop = window.setInterval(
          (vars, resolve) => {
            this.moverRight.move(vars, stop, resolve);
          },
          0.00001,
          vars,
          resolve
        );
      });
      return promise;
    }
  }
  // Utils
  calcDif(type, width) {
    if (type == "left") {
      return width - (50 + 100 / window.innerWidth);
    } else {
      return 90 - width;
    }
  }
}

// Helpers for Changing UI
class Mover {
  constructor(left, right) {
    this.easing = BezierEasing(0, 0, 0.1, 0.92); // Easign function
    this.newQuoteBtn = document.querySelector(".new-quote"); // Button that is moved
    this.gridContainers = document.querySelectorAll(".moving"); // Containers that are moved(excluding ones that are placed absolute)
    this.leftBorder = left;
    this.rightBorder = right;
  }
}

class MoverLeft extends Mover {
  constructor(left, right) {
    super(left, right);
  }
  move(vars, stop, resolve) {
    let p, currentSpan;
    p = (Date.now() - vars.start) / 500;
    currentSpan = vars.size - this.leftBorder * this.easing(p);
    if (currentSpan > 100 - this.leftBorder) {
      this.moveLeftBtn(vars.width, vars.diff, p);
      this.moveLeftContrs(currentSpan);
    } else {
      clearInterval(stop);
      resolve({ span: currentSpan, width: this.newQuoteBtn.style.width });
    }
  }
  moveLeftBtn(width, diff, p) {
    this.newQuoteBtn.style.width = `${width - diff * p * 1.125}%`;
  }
  moveLeftContrs(span) {
    Array.from(this.gridContainers).forEach((cont, index) => {
      if (index < 2) {
        cont.style.gridColumn = `1 / span ${parseInt(span) - 1}`;
      } else {
        cont.style.gridColumn = `${parseInt(span)} / span ${
          101 - parseInt(span)
        }`;
      }
    });
  }
}

class MoverRight extends Mover {
  constructor(left, right) {
    super(left, right);
  }
  move(vars, stop, resolve) {
    let p, currentSpan;
    p = (Date.now() - vars.start) / 500;
    currentSpan = vars.size + this.leftBorder * this.easing(p);
    if (currentSpan < this.rightBorder) {
      this.moveRightBtn(vars.width, vars.diff, p);
      this.moveRightContrs(currentSpan);
    } else {
      clearInterval(stop);
      this.newQuoteBtn.style.width = "90%";
      resolve({ span: currentSpan, width: this.newQuoteBtn.style.width });
    }
  }
  moveRightBtn(width, diff, p) {
    this.newQuoteBtn.style.width = `${width + diff * p}%`;
  }
  moveRightContrs(span) {
    Array.from(this.gridContainers).forEach((cont, index) => {
      if (index < 2) {
        cont.style.gridColumn = `1 / span ${parseInt(span) - 1}`;
      } else {
        cont.style.gridColumn = `${parseInt(span)} / span ${
          101 - parseInt(span)
        }`;
      }
    });
  }
}

// ################### MODIFIERS ###################

// Controlling the flow
class Controller {
  constructor() {
    // State object that will be passed around
    this.data = {
      quotes: [],
      span: 100,
      curWidthPctg: "90%",
      start: true,
    };

    // Buttons for event listeners
    //    Getting new data buttons
    this.fetchButtons = [
      document.getElementById("fetch-quotes"),
      document.getElementById("fetch-random"),
      document.getElementById("fetch-by-author"),
    ];
    //    Changing space buttons
    this.showButtons = [
      document.querySelector(".aside-container i"),
      document.querySelector(".close-butn i"),
    ];
    //    Toggle type of search button
    this.toggleButton = document.querySelector(".checkbox");
    //    Posting a new quote buttons
    this.newQuoteBtn = document.querySelector(".new-quote a");
    this.sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
    this.newQuoteBcg = document.querySelector(".new-qoute-interface");
    this.newQuoteBody = document.querySelector(".new-qoute-interface div");
    this.closeQuoteBtn = document.querySelector(".new-qoute-interface i");
    this.newQuoteContainer = document.querySelector(
      ".new-qoute-interface div div:first-child"
    );
    this.sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
    // let newQuoteBtnPositionLeft = newQuoteBtn.getBoundingClientRect().left;
    // const newQuoteBcg = document.querySelector(".new-qoute-interface");
    // const newQuoteBody = document.querySelector(".new-qoute-interface div");
    // const closeQuoteBtn = document.querySelector(".new-qoute-interface i");
    // const sumbitQuoteBtn = document.querySelector(".new-qoute-interface button");
    // const newQuoteContainer = document.querySelector(
    //   ".new-qoute-interface div div:first-child"
    // );

    // Controll three other modules
    this.modDesign = new ModifyDesign(window.innerWidth > 600 ? 50 : 80, 100);
    this.modContent = new ModifyContent();
    this.connectApi = new ConnectAPI();

    // Binding
    this.handleClick = this.handleClick.bind(this);
    this.onClickInteract = this.onClickInteract.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onClickNewQuote = this.onClickNewQuote.bind(this);
    this.onClickCloseNewQuote = this.onClickCloseNewQuote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Image change on width
    this.img = document.querySelector(".logo img");
  }
  init() {
    // Data
    this.fetchButtons.forEach((fetchBtn) => {
      this.onClickQuote(fetchBtn);
    });
    // Space
    this.showButtons.forEach((interactBtn) => {
      interactBtn.addEventListener("click", this.onClickInteract);
    });
    // Switch between author and text
    this.toggleButton.addEventListener("change", this.onToggle);
    // Open a window for new form
    this.newQuoteBtn.addEventListener("click", this.onClickNewQuote);
    // Close a window for new form
    this.closeQuoteBtn.addEventListener("click", this.onClickCloseNewQuote);
    // Submiting a new quote
    this.sumbitQuoteBtn.addEventListener("click", this.onSubmit);
    // Working with images
    if (window.innerWidth < 600 || window.innerHeight < 401) {
      this.img.src = "./geom_background.png";
      this.img.classList.add("vertical-phone-img");
    }
  }
  // ####### Event handlers for new quote #######
  onClickQuote(element) {
    element.addEventListener("click", this.handleClick);
  }
  // Bind this to instance
  onClickNewQuote(event) {
    event.preventDefault();
    this.showNewQuoteForm();
  }
  // Bind this to instance
  onClickCloseNewQuote(event) {
    this.toggleRmQuoteStyles();
    window.setTimeout(() => {
      this.toggleShowQuoteStyles();
      this.toggleRmQuoteStyles();
      this.hideQuote();
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
      this.newQuoteContainer.innerHTML = newQuote;
    }, 1500);
  }
  // Bind this to instance
  onSubmit(event) {
    this.connectApi
      .submitNewQuote(event.target)
      .then((data) => this.modContent.renderNewQuote(data));
  }
  // ####### Modifiyng UI for new quote #######
  showNewQuoteForm() {
    this.sumbitQuoteBtn.style.display = "inline-block";
    this.toggleShowQuoteStyles();
    this.showQuote();
  }
  toggleShowQuoteStyles() {
    this.newQuoteBcg.classList.toggle("show");
    this.newQuoteBody.classList.toggle("show");
  }
  toggleRmQuoteStyles() {
    this.newQuoteBcg.classList.toggle("rm");
    this.newQuoteBody.classList.toggle("rm");
  }
  hideQuote() {
    this.newQuoteBcg.style.display = "none";
    this.newQuoteBody.style.display = "none";
  }
  showQuote() {
    this.newQuoteBcg.style.display = "block";
    this.newQuoteBody.style.display = "flex";
  }
  // ####### EVENT HANDLER for buttons for getting data #######
  // Bind this to instance
  onClickInteract(event) {
    this.handleQuotes(event.target);
  }
  // ####### Modifiyng text in input field for author search #######
  // Bind this to instance
  // Text changes between "author" and "text"
  onToggle(event) {
    if (event.target.checked) {
      // True -> fetch by quote text
      this.modContent.renderInputText();
    } else {
      // False -> fetch by author
      this.modContent.renderInputAuthor();
    }
  }
  // ####### Modifiyng space #######
  // Space groes left
  onShow() {
    const span = this.data.span;
    const width = this.data.curWidthPctg;
    this.modDesign.changeSpace("left", { span, width }).then((vals) => {
      this.data.span = vals.span;
      this.data.curWidthPctg = vals.width;
    });
    this.modContent.renderQuotes(this.data.quotes);
    this.data.start = false;
    this.modDesign.toggleXButton("show");
  }
  // Space goes right
  onHide() {
    const span = this.data.span;
    const width = this.data.curWidthPctg;
    this.modDesign.changeSpace("right", { span, width }).then((vals) => {
      this.data.span = vals.span;
      this.data.curWidthPctg = vals.width;
    });
    this.data.start = true;
    this.modDesign.toggleXButton("hide");
  }
  // ####### Fetching data #######
  // Bind this to instance
  async handleClick(event) {
    this.data.quotes = await this.connectApi.getData(event);
    if (this.data.quotes) {
      this.handleQuotes();
    } else {
      const error = this.data.quotes;
      this.modContent.renderError(error);
    }
  }
  // ####### Working with quotes #######
  handleQuotes(element) {
    // element passed when icons clicked
    this.modContent.resetQuotes();
    // When we we want to get new quotes without changing space
    if (this.data.span < 90 && this.showButtons.indexOf(element) === -1) {
      const quotes = this.data.quotes;
      this.modContent.renderQuotes(quotes);
    } else {
      // When we are changing space
      if (this.data.start) {
        this.onShow();
      } else {
        this.onHide();
      }
    }
  }
}

const ctrl = new Controller();
ctrl.init();

// sumbitQuoteBtn.addEventListener("click", () => {
//   const quote = document.getElementById("quote").value;
//   const person = document.getElementById("person").value;

//   fetch(`/api/quotes?quote=${quote}&person=${person}`, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then(({ quote }) => {
//       sumbitQuoteBtn.style.display = "none";
//       newQuoteContainer.innerHTML = "";
//       const newQuote = document.createElement("div");
//       newQuote.innerHTML = `
//     <h3>Congrats, your quote was added!</h3>
//     <div class="quote-text">${quote.quote}</div>
//     <div class="attribution">- ${quote.person}</div>
//     <div>
//     `;
//       newQuoteContainer.appendChild(newQuote);
//     });
// });
