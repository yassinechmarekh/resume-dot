import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (error) {
    console.log("Database connection failed.");
    process.exit(1);
  }
};

export default connectToDB;
