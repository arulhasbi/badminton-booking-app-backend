// import necessary libraries
const express = require("express"); // Express.js for our server
const cors = require("cors"); // Cross-Origin Resource Sharing, allows our server to respond to requests from different origins
const mongoose = require("mongoose"); // Mongoose for MongoDB interactions
require("dotenv").config(); // Dotenv for environment variable management

const { errorHandler } = require("./middleware"); // Import our error handler middleware

const usersRouter = require("./routes/users"); // Import our users router
const fieldsRouter = require("./routes/fields"); // Import our fields router
const bookingsRouter = require("./routes/bookings"); // Import our bookings router

const passport = require("passport"); // Passport for authentication
const session = require("express-session"); // Express session for session management
require("./config/passport")(passport); // Import our passport configuration

// Setting up port
// If there's an environment variable for PORT, we'll use that. If not, default to 5000.
const PORT = process.env.PORT || 5000;

// Initialize our express application
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS with various options
app.use(express.json()); // Enable parsing of json objects in the body of requests

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false, // Don't create a session until something is stored
  })
);

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Enable persistent login sessions

app.use("/users", usersRouter); // Use our users router for all routes starting with /users
app.use("/fields", fieldsRouter); // Use our fields router for all routes starting with /fields
app.use("/bookings", bookingsRouter); // Use our bookings router for all routes starting with /bookings

app.use(errorHandler); // Use our error handler middleware (defined in middleware.js)

// Connection to MongoDB
// Here we're using an environment variable for the MongoDB URI stored in our .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const connection = mongoose.connection;

// Bind connection to the 'open' event (once the connection is open)
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Have our app listen on the given port
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
