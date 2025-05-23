const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const itemRoutes = require("./Routes/itemsRoutes");
const app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose.connect(DB, {}).then(() => {
  // console.log(con.connections);
  console.log("DB connection successfull");
});
app.use(cors({
  origin: "http://localhost:5173", // Change port if your frontend is running on a different one
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allows cookies if needed
}));


app.use(express.json({ limit: '10kb' }));


if (process.env.NODEENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/items", itemRoutes);

module.exports = app;
