// Supertest: use it to test a hole Node js App
const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

// define endpoint to test
const endPointUrl = "/todos/";

// Integration Tests: we are actually using a real MongoDB instance and creating real objects
describe(endPointUrl, () => {
  it("POST /todos/", async () => {
    // test the http call, it test the hole request flow
    // supertest actually starts and runs the app
    const response = await request(app).post(endPointUrl).send(newTodo);

    // test the response
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });
});
