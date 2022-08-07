const todoController = require("../controllers/todo.controller");

const express = require("express");

const router = express.Router();

router.post("/", todoController.createTodo);

module.exports = router;
