import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";
import connectToDB from "./config/db";

const PORT = process.env.PORT || 5000;

connectToDB();

mongoose.connection.once("open", () => {
  console.log("Database connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });
});
