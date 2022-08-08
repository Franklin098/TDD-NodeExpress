const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
  } catch (error) {
    // handle the error scenario
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    // return all documents form the database -> just provie an empty object
    const todos = await TodoModel.find({});
    res.status(200).json(todos);
  } catch (error) {
    // handle error, send it to the middleware
    next(error);
  }
};
