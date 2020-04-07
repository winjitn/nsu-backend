const requireLogin = require("../middlewares/requireLogin");

module.exports = (app, db) => {
  //get all user order history
  app.get("/api/history", requireLogin, async (req, res) => {
    const orders = await db
      .get("orders")
      .filter({ username: req.user.username })
      .value();
    if (orders.length === 0) res.sendStatus(404);
    else res.send(orders);
  });

  //create order
  app.post("/api/orders", requireLogin, async (req, res) => {
    db.get("orders")
      .push({ ...req.body, username: req.user.username })
      .last()
      .assign({ id: Date.now().toString() })
      .write()
      .then((order) => res.send(order))
      .catch((err) => res.send(err));
  });

  //delete order
  app.delete("/api/orders", requireLogin, async (req, res) => {
    db.get("orders")
      .remove({ id: req.body.id, username: req.user.username })
      .write()
      .then(() => res.send("success"))
      .catch((err) => res.send(err));
  });

  //get one order detail
  app.get("/api/orders/:id", requireLogin, async (req, res) => {
    const order = await db
      .get("orders")
      .find({ id: req.params.id, username: req.user.username })
      .value();
    if (order === undefined) res.sendStatus(404);
    else res.send(order);
  });
};
