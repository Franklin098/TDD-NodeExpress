const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

// create a Mock function that overrides the original Mongoose 'create' method
TodoModel.create = jest.fn(); // we can test if the 'create' method is being called by our app code.
// jest automatically injects this TodoModel mock inside TodoController import statement

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // creates a mock with all the original implementation attributes
  res = httpMocks.createResponse();
  next = jest.fn();
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

  // error handling unit test
  it("should handle errors", async () => {
    const errorMessage = { message: "Done promerty missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise); // mock a rejected promise returned by mongodb
    // when we call 'create' inside our controller, we'll get this rejectedPromise automatically injected

    await TodoController.createTodo(req, res, next);

    // we expect that the next fn is called with the rejected message
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("TodoController.getTodos", () => {
  beforeAll(() => {
    TodoModel.find = jest.fn();
  });

  it("should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });

  it("should call TodoModel.find({})", async () => {
    await TodoController.getTodos(req, res, next);

    expect(TodoModel.find).toBeCalled();
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it("should return response with status 200 and all todos", async () => {
    // arrange
    TodoModel.find.mockReturnValue(allTodos);
    // act
    await TodoController.getTodos(req, res, next);
    // assert
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toEqual(allTodos); // check if our controller added all-todos data
  });

  it("should handle errors", async () => {
    // arrange
    const errorMessage = { message: "Error while getting all todos" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    // act
    await TodoController.getTodos(req, res, next);
    // assert
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.getTodo',()=>{

  
  it('should have a getTodo function',()=>{
    expect(typeof TodoController.getTodo).toBe("function");
  })

  beforeAll(()=>{
    // mock TodoModel.findById
    TodoModel.findById = jest.fn();
  })


  it('should call TodoModel.findById', async ()=>{
    // act
    await TodoController.getTodo(req,res,next);
    // assert
    expect(TodoModel.findById).toBeCalled();
  })

  it('should call TodoModel.findById with Route Parameters', async ()=>{
    // arrange
    const id = "test12345";
    req.params.todoId = id;
    // act
    await TodoController.getTodo(req,res,next);
    // assert
    expect(TodoModel.findById).toBeCalledWith(id);
  })

  it('should find Todo by Id and return its data with 200 code', async () => {
    // arrange
    const id = "test12345";
    req.params.todoId = id;
    TodoModel.findById.mockReturnValue(newTodo);
    // act
    await TodoController.getTodo(req,res,next);
    // assert
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toEqual(newTodo);
  })

  it('should handle error when an exception occurs', async () => {
    // arrange
    const errorMessage = {message:"Todo model not found"};
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise); // mock return value
    // act
    await TodoController.getTodo(req,res,next);
    // assert
    expect(next).toHaveBeenCalledWith(errorMessage);
  })

  it('should handle item not found error with 404 code', async () => {
    // arrange
    TodoModel.findById.mockReturnValue(null); // mock item not found valu
    // act
    await TodoController.getTodo(req,res,next);
    // assert
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
})