"use strict";

const mongoose = require("mongoose");
const connectString = process.env.MONGO_URL ?? "";
const {
  countNumConnection,
} = require("./../../src/api/v1/helpers/checkConnect");

const dev = {
  app: { port: process.env.PORT || 5000 },
  db: {
    host: "localhost",
    post: "",
    name: "db",
  },
};
const pro = {
  app: { port: process.env.HOST_PORT || 5000 },
  db: {
    host: process.env.HOST_NAME || "localhost",
    post: "",
    name: "db",
  },
};
const configDb = { dev, pro };
const envDb = process.env.NODE_ENV ?? "development";

// console.log(configDb[envDb]);
class DataBase {
  //Singleton Pattern Đảm bảo rằng một class chỉ có duy nhất một instance
  constructor() {
    this.connect();
  }
  connect = async (type = "MongoDb") => {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(
        connectString,
        { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 100 },
        () => {
          countNumConnection();
          console.log("Connected to MongoDB");
        }
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }
  // connectionClose() {
  //   return mongoose.connection.close();
  // }
}
const connectInstanceDatabase = DataBase.getInstance();
// const connectionClose = DataBase.connectionClose();

module.exports = connectInstanceDatabase;
