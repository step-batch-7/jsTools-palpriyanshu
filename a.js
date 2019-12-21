newData = {};
console.log("1--", newData);
const getData = function(data) {
  this.newData = data;
  console.log("2--", this.newData);
  return this.newData;
};

const main = function() {
  console.log("3--", this.newData);
  process.stdin.setEncoding("utf8");
  console.log("4--", this.newData);
  process.stdin.on("data", data => getData(data));
  console.log("5--", this.newData);
};

main();
