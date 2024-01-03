const bcrypt = require("bcrypt");
const User = require("../models/people");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

function getLogin(req, res, next) {
  res.render("index");
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isvalidPassword = bcrypt.compare(req.body.password, user.password);

      if (isvalidPassword) {
        // prepare the userobject to generate token...
        const userObj = {
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role: "user",
        };

        // generate token...
        const token = jwt.sign(userObj, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = userObj;
        res.render("inbox");
      } else {
        throw createHttpError("Login failed! Please try again");
      }
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: res.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// logged out functions...
const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("You have been logged out")
};

module.exports = { getLogin, login, logout };
