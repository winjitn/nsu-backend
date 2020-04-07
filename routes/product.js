module.exports = (app, db) => {
  //get one product detail
  app.get("/api/products/:id", async (req, res) => {
    const product = await db
      .get("products")
      .find({ id: req.params.id })
      .value();

    if (product === undefined) res.sendStatus(404);
    else res.send(product);
  });

  //get full product list
  app.get("/api/products", async (req, res) => {
    const products = await db.get("products").value();

    res.send(products);
  });
};
