const request = require("supertest");
const server = require("./server");
const pages = require("./random_data/pages.json");
const users = require("./random_data/users.json");

const removeIdAndTimestamp = (data) => {
  return data.map((item) => {
    const newItem = structuredClone(item);
    delete newItem.id;
    delete newItem.created_at;
    delete newItem.updated_at;
    return newItem;
  });
};

//TODO - write a helper function to check if the arrays match, but not necessarily in order.

// describe("Get /pages", () => {
//   test("Get an array of all the pages", (done) => {
//     request(server)
//       .get("/pages")
//       .expect(200, pages)
//       .end((err, res) => {
//         expect(removeIdAndTimestamp(res._body).sort()).toEqual(pages.sort()); //TODO - fix this check.
//         if (err) throw err;
//         done();
//       });
//   });
// });

describe("Get /users", () => {
  test("Get an array of all users", (done) => {
    request(server)
      .get("/users")
      .expect(200)
      .end((err, res) => {
        expect(removeIdAndTimestamp(res._body).sort()).toEqual(users.sort());
        if (err) throw err;
        done();
      });
  });
});
