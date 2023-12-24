const bcrypt = require("bcrypt");
const User = require("../models/people");

function userController(req, res, next) {
  res.render("users");
}

async function addUser(req, res, next) {
  let newUser;
  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].fileName,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    const result = await newUser.save();
    result.status(200).json({
      message: "User created successfully",
    });
  } catch (err) {
    result.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred",
        },
      },
    });
  }
}

module.exports = { userController, addUser };
