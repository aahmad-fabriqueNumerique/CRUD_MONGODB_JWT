const dotenv = require("dotenv").config({ path: "config.env" });
const express = require("express");
const mongodb_connect = require("./server/database/connect");
const authRoutes = require('./server/routes/authRoutes')


const app = express();

// Middleware
app.use(express.json())

// Template Engine
app.set("view engine", "ejs");
// Connection MongoDB
// Server

mongodb_connect()
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    })
    )
  .catch((err) => {
    console.log(err);
  });

// ROUTES
app.use(authRoutes)
