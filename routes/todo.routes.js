const todoController = require("../controllers/todo.controller");

const express = require("express");

const router = express.Router();

router.post("/", todoController.createTodo);

router.get("/", todoController.getTodos);

router.get("/:todoId",todoController.getTodo);

module.exports = router;
