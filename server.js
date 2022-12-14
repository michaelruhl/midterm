// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser")

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const homeRoutes = require("./routes/home");
const homepageRoutes = require("./routes/homepage");
const quiz_showRoutes = require("./routes/quiz_show");
const register = require("./routes/register");
const quiz_score = require("./routes/quiz_score");
const createQuiz = require("./routes/createquiz");
const login = require("./routes/login");
const myquizzes = require("./routes/myquizzes");


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/home", homeRoutes(db));
app.use("/api/homepage", homepageRoutes(db));
app.use("/api/quiz_show", quiz_showRoutes(db));
app.use("/api/register", register(db));
app.use("/api/quiz_score", quiz_score(db));
app.use("/api/createquiz", createQuiz(db));
app.use("/api/login", login(db));
app.use("/api/myquizzes", myquizzes(db));



// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// DELETE ALREADY DECLARED IN HOME ROUTES
app.get("/", (req, res) => {

  res.render("index" );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
