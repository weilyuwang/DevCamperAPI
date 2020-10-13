const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// Logging
const morgan = require("morgan");

// Colorful console output
const colors = require("colors");

// Utils
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Security
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// Error handling middleware
const errorHandler = require("./middleware/error");

// MongoDB Connection
const connectDB = require("./config/db");

// Load env vars
dotenv.config({
  path: "./config/config.env",
});

// Connect to MongoDB
connectDB();

// Route files
const bootcampsRouter = require("./routes/bootcamps");
const coursesRouter = require("./routes/courses");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");

const app = express();

// JSON Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data (to prevent mongodb injection, etc.)
// e.g. prevent something like { "email":  { "$gte": "" }, "password": "123456" }
app.use(mongoSanitize());

// Set Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent XSS attacks
/* make sure this comes before any routes */
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
// __dirname: current dir
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewsRouter);

// Use errorHandler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
// The 'unhandledRejection' event is emitted whenever a Promise is rejected and
// no error handler is attached to the promise within a turn of the event loop.
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
