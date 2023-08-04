const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("Connected to MongoDB");
      }
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
