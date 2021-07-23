const path = require("path");
const fs = require("fs");

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "../logs/access.log"),
    {flags: "a"}
);

exports.accessLogStream = accessLogStream;