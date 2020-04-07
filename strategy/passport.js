const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const FileAsync = require("lowdb/adapters/FileAsync");
const low = require("lowdb");

const adapter = new FileAsync("db.json");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const db = await low(adapter);
    const existing = await db
      .get("users")
      .find({ username: username, password: password })
      .value();

    if (existing) {
      return done(null, existing);
    }
    return done(null, false);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const db = await low(adapter);
  const existing = await db.get("users").find({ id: id }).value();
  done(null, existing);
});
