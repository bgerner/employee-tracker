const mysql = require("mysql2");
const util = require('util');

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    // insert password below
    password: "",
    database: "tracker",
  },
  console.log("Connected to the tracker database.")
);

module.exports = db;
