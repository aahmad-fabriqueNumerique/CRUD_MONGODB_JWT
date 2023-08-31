const dotenv = require("dotenv").config({ path: "config.env" });
const express = require("express");
const mongodb_connect = require("./server/database/connect");
const authRoutes = require('./server/routes/authRoutes')
const cookieParser = require('cookie-parser')

const app = express();

// Middleware
app.use(express.json())
app.use(cookieParser())

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


  // app.get('/set-cookie', (req, res) => {
  //   res.cookie('user', 'dwwm', {
  //     maxAge: 1000* 60 * 60 * 24,
  //     expires: new Date('31 12 2023'),
  //     // secure: true
  //     httpOnly: true,
  //     sameSite: 'lax'
  //   })
  //     res.send('Cookie has been created')
  // })

// ROUTES
app.use(authRoutes)
