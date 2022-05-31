module.exports = function (app) {
  const port = process.env.port || 5000;
  app.listen(port, () => {
    console.log("listening on:" + port);
  });
};
