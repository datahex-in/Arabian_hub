const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { handleError } = require("./utils/errorHandler.js");

dotenv.config({ path: "./config/.env" });

const app = express();

const allowedOrigins = [
  "http://localhost:8000",
  "http://localhost:8001",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://lemon-grass-0c88ad110.3.azurestaticapps.net",
  "https://lively-wave-04701e810.3.azurestaticapps.net",
  "https://icy-beach-003aa9c00.3.azurestaticapps.net",
];

//cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Connect to database
connectDB();

app.use("/images", express.static("./public/user"));
app.use("/images", express.static("./public/proteincategory"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(handleError);

// route files
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const userType = require("./routes/userType.js");
const menu = require("./routes/menu.js");
const subMenu = require("./routes/subMenu.js");
const menuRole = require("./routes/menuRole.js");
const subMenuRole = require("./routes/subMenuRole.js");
const appointment = require("./routes/appointment.js");
const franchise = require("./routes/franchise.js");
const dashboard = require("./routes/dashboard.js");
const faq = require("./routes/faq.js");

const aboutUs = require("./routes/aboutUs.js");
const destination = require("./routes/destination.js");
const package = require("./routes/package.js");
const tourPlan = require("./routes/tourPlan.js");
const activity = require("./routes/activity.js");
const includedActivity = require("./routes/includedActivity.js");
const addOnActivity = require("./routes/addOnActivity.js");
const enquiry = require("./routes/enquiry.js");

// mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/user-type", userType);
app.use("/api/v1/menu", menu);
app.use("/api/v1/sub-menu", subMenu);
app.use("/api/v1/menu-role", menuRole);
app.use("/api/v1/submenu-role", subMenuRole);
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/franchise", franchise);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/faq", faq);

app.use("/api/v1/about-us", aboutUs);
app.use("/api/v1/destination", destination);
app.use("/api/v1/package", package);
app.use("/api/v1/tour-plan", tourPlan);
app.use("/api/v1/activity", activity);
app.use("/api/v1/included-activity", includedActivity);
app.use("/api/v1/add-on-activity", addOnActivity);
app.use("/api/v1/enquiry", enquiry);

app.use(handleError);


const indexRouter = require("./routes/ejsRoutes/index");
const usersRouter = require("./routes/ejsRoutes/users");
const sandtoursRouter = require("./routes/ejsRoutes/sandtours");
const atvtoursRouter = require("./routes/ejsRoutes/atvtours");
const PackagesRouter = require("./routes/ejsRoutes/packages");
const DestinationRouter = require("./routes/ejsRoutes/destination");
const DubaiRouter = require("./routes/ejsRoutes/dubai");
const ActivitiesRouter = require("./routes/ejsRoutes/activities");
const ContactRouter = require("./routes/ejsRoutes/contact");
const MessageRouter = require("./routes/ejsRoutes/message");
const CurateRouter = require("./routes/ejsRoutes/curate");
const QuestionRouter = require("./routes/ejsRoutes/question");
const BookRouter = require("./routes/ejsRoutes/book");
const PackagesNameRouter = require("./routes/ejsRoutes/packagesName");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/sandtours", sandtoursRouter);
app.use("/atvtours", atvtoursRouter);
app.use("/packages", PackagesRouter);
app.use("/packagesname", PackagesNameRouter);
app.use("/destinations", DestinationRouter);
app.use("/dubai", DubaiRouter);
app.use("/activities", ActivitiesRouter);
app.use("/contact", ContactRouter);
app.use("/message", MessageRouter);
app.use("/curate", CurateRouter);
app.use("/question", QuestionRouter);
app.use("/book", BookRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
