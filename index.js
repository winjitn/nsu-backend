const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const passport = require("passport");

require("./strategy/passport");

// Create server
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: ["abc"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Create database instance
const adapter = new FileAsync("db.json");
low(adapter)
  .then((db) => {
    // Routes
    require("./routes/auth")(app, db);
    require("./routes/product")(app, db);
    require("./routes/order")(app, db);
    return;
  })
  .then(() => {
    app.listen(3000, () => console.log("listening on port 3000"));
  });
