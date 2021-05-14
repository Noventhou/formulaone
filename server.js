const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const configDb = require("./config/db");

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
},
  bodyParser.urlencoded({ extended: true }));

MongoClient.connect(
  configDb.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, database) => {
    if (err) return console.error(err);
    console.log("Successfully connected to DB");

    const db = database.db("formulaone");
    require("./controllers")(app, db);
    app.listen(port, () => {
      console.log("The server is working on " + port);
    });
  }
);