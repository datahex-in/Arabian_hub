const Menu = require("../models/Menu");
const User = require("../models/User");
const { errorLog } = require("../utils/errorLog");

const getMenu = async (role) => {
  const menu = await Menu.aggregate([
    {
      $lookup: {
        from: "menuroles",
        localField: "_id",
        foreignField: "menu",
        as: "menuRoles",
      },
    },
    {
      $match: {
        "menuRoles.userType": role?._id, // Replace req.user.userType._id with the desired user role
      },
    },
    {
      $lookup: {
        from: "submenus",
        localField: "_id",
        foreignField: "menu",
        as: "submenus",
        pipeline: [
          {
            $lookup: {
              from: "submenuroles",
              localField: "_id",
              foreignField: "subMenu",
              as: "subMenuRoles",
            },
          },
          {
            $match: {
              "subMenuRoles.userType": role?._id,
            },
          },
          {
            $sort: { sequence: 1 }, // Sort the submenus by sequence
          },
        ],
      },
    },
    {
      $sort: { sequence: 1 }, // Sort the submenus by sequence
    },
  ]).exec();

  return menu;
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, res, req) => {
  const { email, userType, userDisplayName, _id, franchise, username } = user;
  try {
    const token = user.getSignedJwtToken();
    if (!token) {
      res.status(200).json({
        success: false,
        message: "Something went wrong!",
      });
    } else {
      console.log(userType);

      const menu = await getMenu(userType);

      return res.status(200).json({
        user: { userType, email, userDisplayName, _id, franchise, username },
        menu,
        token,
        success: true,
        message: "welcome back",
      });
    }
  } catch (error) {
    errorLog(req, error);
  }
};

// @desc      GET CURRENT LOGGED UER
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res) => {
  //This req.user come from middleware -> auth -> protect
  const admin = await User.findById(req.user.id);

  // if (admin.role === "admin") {
  res.status(200).json({
    success: true,
    admin,
  });
  // }
};

// @desc      LOGIN USER
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const checkMail = await User.findOne({ email })
      .populate("userType")
      .select("+password");
    if (!checkMail) {
      res.status(200).json({
        success: false,
        message: "There is no user corresponding to the email address.",
      });
    } else {
      const checkPassword = await checkMail.matchPassword(password);
      delete checkMail.password;
      if (!checkPassword) {
        res.status(200).json({
          success: false,
          message: "Wrong password",
        });
      } else {
        sendTokenResponse(checkMail, res, req);
      }
    }
  } catch (err) {
    console.log("error check", err);
    errorLog(req, err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Check if email already exists
    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user
    const user = await User.create({ email, username, password });

    sendTokenResponse(user, res);
  } catch (err) {
    console.error("Error during registration:", err);
    errorLog(req, err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// @desc      Update Password
// @route     PUT /api/v1/auth/update-password
// @access    Private
exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.body.user).select("+password");

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Password update failed" });
  }
};
