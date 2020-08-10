const getRandomElement = (arr) => {
  if (!Array.isArray(arr)) throw new Error("Expected an array");
  return arr[Math.floor(Math.random() * arr.length)];
};

const getQuotes = (arr, data, type) => {
  if (type === "author") {
    return arr.filter(
      (item) => item.person.toLowerCase() === data.toLowerCase()
    );
  } else {
    return arr.filter(
      (item) => item.quote.toLowerCase() === data.toLowerCase()
    );
  }
};

module.exports = {
  getRandomElement,
  getQuotes,
};
