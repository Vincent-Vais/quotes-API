const getRandomElement = (arr) => {
  if (!Array.isArray(arr)) throw new Error("Expected an array");
  return arr[Math.floor(Math.random() * arr.length)];
};

const getQuotes = (arr, name) => {
  return arr.filter((item) => item.person.toLowerCase() === name.toLowerCase());
};

module.exports = {
  getRandomElement,
  getQuotes,
};
