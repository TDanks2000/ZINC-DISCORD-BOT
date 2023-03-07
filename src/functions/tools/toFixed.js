module.exports = (client) => {
  client.toFixedNumber = (num, places = 2) => {
    const offset = Number(`1e${places}`);
    return Math.floor(num * offset) / offset;
  };
};
