const { unlink } = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/people");

async function userController(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users,
    });
  } catch (e) {
    next(e);
  }
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
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (errors) {
    console.log(errors);
    res.status(500).json({
      errors,
    });
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    if (user.avatar) {
      unlink(
        path.join(__dirname + `/../public/uploads/avatars${user.avatar}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    res.status(200).json({
      message: "User was removed successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}
module.exports = { userController, addUser, removeUser };
