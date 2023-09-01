import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connect = mongoose.connect(
      process.env.MONGO_URL || "mongodb://127.0.0.1:27017/"
    );

    console.log(
      `Connected to MongoDB ${(await connect).connection.host}`.bgBlue
    );
  } catch (error) {
    console.log(`error in mongoDB ${error}`.bgRed);
  }
};

export default connectDB;
