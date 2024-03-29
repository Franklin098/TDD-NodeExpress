// Supertest: use it to test a hole Node js App
const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

// define endpoint to test
const endPointUrl = "/todos/";
// for testing GET todo by Id
let firstTodo;

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

  // integration test for error handling
  it("should return error 500 on malformed data with POST", async () => {
    // arrange
    const missingDoneData = { title: "Missing done property" };
    const errorBody = {
      message: "Todo validation failed: done: Path `done` is required.",
    };
    // act
    const response = await request(app).post(endPointUrl).send(missingDoneData);
    // assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual(errorBody);
  });

  // Test getTodos
  it("GET /todos/", async () => {
    // act
    const response = await request(app).get(endPointUrl);

    // assert
    expect(response.statusCode).toBe(200);
    // expect(typeof response.body).toBe("array"); // doesn't work well
    expect(Array.isArray(response.body)).toBeTruthy();

    expect(response.body[0].title).toBeDefined(); // we don't know the exact title value
    expect(response.body[0].done).toBeDefined(); // we don't know the exact value

    // for use it in the future in the GET todo by Id test
    firstTodo = response.body[0];
  });

  // Test getTodos
  it("GET /todos/:todoId", async () => {
    // act
    const response = await request(app).get(`${endPointUrl}/${firstTodo._id}`);

    // assert
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it("GET /todos/:todoId with Id that does not exist", async () => {
    // act
    const response = await request(app).get(`${endPointUrl}/not-valid-id`);

    // assert
    expect(response.statusCode).toBe(500);
  });
});
