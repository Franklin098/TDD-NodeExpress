const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");

// create a Mock function that overrides the original Mongoose 'create' method
TodoModel.create = jest.fn(); // we can test if the 'create' method is being called by our app code.
// jest automatically injects this TodoModel mock inside TodoController import statement

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // creates a mock with all the original implementation attributes
  res = httpMocks.createResponse();
  next = null;
});

describe("TodoController.createTodo", () => {
  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  beforeEach(() => {
    // arrange, reset request body
    req.body = newTodo;
  });

  it("should call TodoModel.create", () => {
    // act
    TodoController.createTodo(req, res, next);
    // assert
    expect(TodoModel.create).toBeCalled();
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);

    expect(res.statusCode).toBe(201); // ensure we return a 201 code
    expect(res._isEndCalled()).toBeTruthy(); // ensure that the response has been send back
  });

  it("should return json body in response", async () => {
    // create a mock value of what Mongoose should give us as return object
    TodoModel.create.mockReturnValue(newTodo); // should return a newTodo item

    await TodoController.createTodo(req, res, next);

    expect(res._getJSONData()).toEqual(newTodo); // use toEqual to evalute 'value' not 'reference' (toBe)
  });
});
