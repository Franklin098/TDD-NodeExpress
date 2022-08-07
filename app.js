const todoRoutes = require("./routes/todo.routes");

const express = require("express");

const app = express();

const mongodb = require("./mongodb/mongodb.connect");

mongodb.connect();

// use the json middleware to pass the json to the request body
app.use(express.json());

// use our routes
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json("Hello world !");
});

module.exports = app;
