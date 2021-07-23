const path = require("path")

const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const multerUploads = require("./utils/multer");
const { accessLogStream } = require("./helpers/logging");
require("dotenv").config();

const configRoutes = require("./routes");

const server = express();

Sentry.init({
    dsn: process.env.SENTRY_URL,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ server }),
    ],
    tracesSampleRate: 1.0,
});
server.use(express.json());
server.use(multerUploads);
server.use(express.json());
server.use(express.urlencoded({ extended: false}));
server.use("/images", express.static(path.join(__dirname, "images")));
server.use(Sentry.Handlers.requestHandler());
server.use(Sentry.Handlers.tracingHandler());
server.use(cors());
server.use(compression());
server.use(morgan("combined", { stream: accessLogStream }));

configRoutes(server);

server.use(Sentry.Handlers.errorHandler());

server.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = server;
