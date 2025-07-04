// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥💥💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Database connected successfully!!!");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Is Running on Port ${port}!!!😁😁😁😁`);
});

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥💥💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
