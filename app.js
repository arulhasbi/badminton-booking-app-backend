// import necessary libraries
const path = require("path"); // Path for file path manipulation
const express = require("express"); // Express.js for our server
const morgan = require("morgan");
const cors = require("cors"); // Cross-Origin Resource Sharing, allows our server to respond to requests from different origins
const mongoose = require("mongoose"); // Mongoose for MongoDB interactions
const cookieParser = require("cookie-parser"); // Cookie parser for parsing cookies
require("dotenv").config(); // Dotenv for environment variable management

const { errorHandler } = require("./middleware"); // Import our error handler middleware

const usersRouter = require("./routes/users"); // Import our users router
const courtsRouter = require("./routes/courts"); // Import our courts router
const bookingsRouter = require("./routes/bookings"); // Import our bookings router
const timeSlotsRouter = require("./routes/timeSlots"); // Import our time slots router
const arenasRouter = require("./routes/arenas"); // Import our arenas router
const tempBookingRouter = require("./routes/tempBooking"); // Import our temp booking router

const passport = require("passport"); // Passport for authentication
const session = require("express-session"); // Express session for session management
require("./config/passport")(passport); // Import our passport configuration

// Setting up port
// If there's an environment variable for PORT, we'll use that. If not, default to 5000.
const PORT = process.env.PORT;

// Initialize our express application
const app = express();

// app.use(morgan("combined"));
app.use(cookieParser());

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // Enable CORS with various options
app.use(express.json()); // Enable parsing of json objects in the body of requests

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false, // Don't create a session until something is stored
  })
);

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Enable persistent login sessions

app.use("/users", usersRouter); // Use our users router for all routes starting with /users
app.use("/courts", courtsRouter); // Use our courts router for all routes starting with /courts
app.use("/bookings", bookingsRouter); // Use our bookings router for all routes starting with /bookings
app.use("/time-slots", timeSlotsRouter); // Use our time slots router for all routes starting with /timeSlots
app.use("/arenas", arenasRouter); // Use our arenas router for all routes starting with /arenas
app.use("/tempBooking", tempBookingRouter); // Use our temp booking router for all routes starting with /tempBooking

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

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
