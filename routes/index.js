const feedRoutes = require("./feed")
const authRoutes = require("./auth");

const server = (app) => {
    app.get("/", (req, res, next) => {
      res.status(200).json({ message: "Wiring Up Continuous Integration" });
    });
    app.use("/feed", feedRoutes);
    app.use("/auth", authRoutes);
  };
  
  module.exports = server;