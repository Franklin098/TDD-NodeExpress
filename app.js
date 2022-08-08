const todoRoutes = require("./routes/todo.routes");

const express = require("express");

const app = express();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongodb = require("./mongodb/mongodb.connect");

mongodb.connect();

// use the json middleware to pass the json to the request body
app.use(express.json());

// use our routes
app.use("/todos", todoRoutes);

// middleware for  handling errors
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.json("Hello world !");
});

module.exports = app;
