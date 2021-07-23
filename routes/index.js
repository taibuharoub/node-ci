const server = (app) => {
    app.get("/", (req, res, next) => {
      res.status(200).json({ message: "Wiring Up Continuous Integration" });
    });
  };
  
  module.exports = server;