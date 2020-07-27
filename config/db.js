const mongoose = require("mongoose");

const connectDB = async () => {
  // connect() returns a promise
  // need also provide some options to avoid warnings in the console
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
