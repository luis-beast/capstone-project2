const request = require("supertest");
const app = request("./server");
const pages = require("./random_data/wiki_pages.json");

describe("Get /pages", () => {
  test("Get an array of all the pages", (done) => {});
  request(app).get("/events").expect(200);
}).end((err, res) => {
  if (err) throw err;
  done();
});
