
const drivers = require("./scripts/drivers");
const teams = require("./scripts/teams");
const results = require("./scripts/results");

module.exports = function(app, db) {
  // drivers(app, db);
  // teams(app, db);
  //results(app, db);
  const page = "<b>Hello World</b>";

  app.get("/", (req, res) => res.send(page));
};