const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config();

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App is running on Port ${port}...`);
});

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("DB Connected Successfuly"))
  .catch((error) => console.log("Error in Connecting with DB", error));
