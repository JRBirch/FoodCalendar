import mongoose from "mongoose";

const connectDB = (url: string) => {
  return mongoose.connect(url);
};

const disconnectDB = () => {
  return mongoose.connection.close();
};

const dropDatabase = () => {
  return mongoose.connection.db.dropDatabase();
};

export { connectDB, disconnectDB, dropDatabase };
