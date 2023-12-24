const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/error-handler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express(); // create express app instance;
dotenv.config();

// data connection...
mongoose
  .connect(process.env.MONGO_DATABASE_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then((response) => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname + "/public")));

app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// router handlers
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
