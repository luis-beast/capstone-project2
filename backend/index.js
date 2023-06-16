const server = require("./server.js");
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
