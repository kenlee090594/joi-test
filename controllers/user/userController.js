const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { User, Token } = require("../../models");

const errorFunction = require("../../utils/errorFunction");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    }).lean(true);

    if (existingUser) {
      res.status(403);
      return res.json(errorFunction(true, "User already Exists!"));
    } else {
      const newUser = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,
      });
      const token = generateToken(newUser._id);
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });
      if (newUser) {
        res.status(201);
        return res.json(errorFunction(false, "User Created", newUser));
      } else {
        res.status(403);
        return res.json(errorFunction(true, "Error Creating User"));
      }
    }
  } catch (error) {
    res.status(400);
    console.log(error);
    return res.json(errorFunction(true, "Error Adding user"));
  }
});

const logInuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return res.json(errorFunction(true, "Please enter email or password"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    return res.json(errorFunction(true, "User not found! Please sign-up"));
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, userName, email, mobileNumber } = user;
    res.status(201);
    return res.json(errorFunction(false, "User Logged In", user));
  } else {
    res.status(400);
    return res.json(errorFunction(true, "Incorrect user credentials"));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, userName, email, mobileNumber } = user;
    res.status(200).json({
      _id,
      userName,
      email,
      mobileNumber,
    });
  } else {
    res.status(400).json(errorFunction(true, "Not Authorized, Please Login"));
  }
});

const getUserStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(errorFunction(false, "Not Logged in, Please Login"));
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(errorFunction(true, "User is Logged in"));
  }
  return res.json(false);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { userName, email, mobileNumber } = user;
    user.userName = req.body.userName || userName;
    user.email = req.body.email || email;
    user.mobileNumber = req.body.mobileNumber || mobileNumber;

    const updateUser = await user.save();
    res.status(200).json(
      errorFunction(false, {
        _id: updateUser._id,
        userName: updateUser.userName,
        email: updateUser.email,
        mobileNumber: updateUser.mobileNumber,
      })
    );
  } else {
    res.status(404).json(errorFunction(true, "Error"));
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400).json(errorFunction(true, "Not Authorized"));
  }

  if (!oldPassword || !password) {
    res
      .status(400)
      .json(errorFunction(true, "Please enter old and new password"));
  }

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (user && passwordIsCorrect) {
    (user.password = password), await user.save();
    res.status(200).send("Password changed successfully");
  } else {
    res.status(404);
    throw new Error("Old password is incorrect");
  }
});

module.exports = {
  registerUser,
  logInuser,
  logoutUser,
  getUserData,
  getUserStatus,
  updateUser,
  updatePassword,
};
