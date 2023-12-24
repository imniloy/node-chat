const { check, validationResult } = require("express-validator");
const Users = require("../../models/people");
const createHttpError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");
const addUserValidator = [
  check("name")
    .isLength({
      min: 1,
    })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .trim(),
  check("email")
    .isEmail()
    .trim()
    .custom(async (value) => {
      try {
        const user = await Users.findOne({ email: value });
        if (user) {
          throw createHttpError("User already exists");
        }
      } catch (e) {
        throw createHttpError(e.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Number must be a valid bangladeshi number")
    .custom(async (value) => {
      try {
        const phone = await Users.findOne({ mobileNumber: value });
        if (phone) {
          throw createHttpError("Mobile Number Already Exists");
        }
      } catch (err) {
        throw createHttpError(err.message);
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters 1 lowercase, 1 uppercase, 1 number and 1 symbol"
    ),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedError = errors.mapped();
  if (Object.keys(mappedError).length == 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { fileName } = req.files[0];
      unlink(
        path.join(__dirname, `../../public/uploads/avatars/${fileName}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    // response the error message...
    res.status(500).json({
      errors: mappedError,
    });
  }
};

module.exports = { addUserValidator, addUserValidationHandler };
