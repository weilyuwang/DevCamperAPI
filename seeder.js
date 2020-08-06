const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);

    console.log("Data Imported...".green.inverse);

    // exit the process
    process.exit(0);
  } catch (err) {
    console.log(err);

    // exit the process
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // delete all data
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log("Data Deleted...".red.inverse);

    // exit the process
    process.exit();
  } catch (err) {
    console.log(err);

    // exit the process
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Wrong Argument!");
  process.exit(1);
}
