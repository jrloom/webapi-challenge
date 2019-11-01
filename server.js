const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const server = express();

// * middleware
server.use(express.json());
server.use(helmet());
if (server.get("env") === "development") {
  server.use(morgan("tiny"));
}

// * routers

// * sanity
server.get("/", (req, res) => res.status(200).json({ message: "Good things" }));

module.exports = server;