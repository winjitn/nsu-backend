const passport = require("passport");

module.exports = (app, db) => {
  //signup
  app.post("/user/signup", async (req, res) => {
    const existing = await db
      .get("users")
      .find({ username: req.body.username })
      .value();
    if (req.user) res.send({ error: "need to logout" });
    else if (existing) {
      res.send({ error: "username exists" });
    } else
      db.get("users")
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then((user) => res.send(user))
        .catch((err) => res.send(err));
  });

  //get profile
  app.get("/api/profile", (req, res) => res.send(req.user));

  app.post("/api/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send("error");
      }
      req.logIn(user, function (err) {
        if (err) {
          return res.send("error");
        }
        return res.send("success");
      });
    })(req, res, next);
  });

  //logout
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send("success");
  });
};
