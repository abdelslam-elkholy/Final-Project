const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
const port = process.env.PORT || 5000;

mongoose
  .connect(DB)
  .then(() => console.log("DATABASE Connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`listening from port: ${port}`);
});
