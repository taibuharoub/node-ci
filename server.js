const server = require("./app");
const connectDB = require("./utils/db")
connectDB();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});