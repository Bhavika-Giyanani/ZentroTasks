const dontenv = require("dotenv");
dontenv.config();
const mongoose = require("mongoose");

connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("error connecting MongoDB ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
