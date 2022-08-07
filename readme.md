# Node JS Express Test Driven Development Demo

In Test Driven development we write tests first and then the actual implementation code.

We should write test that describe the **expected app behaviour**.

TDD Steps:

* Red
* Green
* Refactor

**Red**: start writting your tests for the expected behaviours before writting any implementation code. Because the actual application code doesn't exists yet, all your tests are going to fail, they are going to be mark as Red.

**Green**: continue by writting your implementation code in order to solve and reflect business logic and make those red tests pass. After that you make your tests cases pass, they are going to be mark as Green.

**Refactor**: if bussiness requirements change, or you find a new architectural approach probably you'll need to refactor and re-write some of your tests cases, or implementation code. TDD is an iterative process.

## Testing Mongoose Integration

You don't want to test mongoose behaviour (that is a 3rd party library), but you must test if **your code** actually calls mongoose in the expected cases and in the correct way, with the correct parameters.

```
const TodoModel = require("../../model/todo.model");

// create a Mock function that overrides the original Mongoose 'create' method
TodoModel.create = jest.fn(); // we can test if the 'create' method is being called by our app code.

it("should call TodoModel.create", () => {
    TodoController.createTodo();
    expect(TodoModel.create).toBeCalled();
});
```