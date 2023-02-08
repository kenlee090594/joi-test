const router = require("express").Router();
const { userValidation, passwordValidation } = require('../utils/validator')
const auth = require("../utils/authentication");
const {
  registerUser,
  logInuser,
  logoutUser,
  getUserData,
  getUserStatus,
  updateUser,
  updatePassword,
} = require("../controllers/user/userController");

router.post("/registerUser", userValidation, registerUser);
router.post("/loginUser", logInuser);
router.get("/logoutUser", auth, logoutUser);
router.get("/getUserData", auth, getUserData);
router.get("/getUserStatus", auth, getUserStatus);
router.patch("/updateUser", auth, updateUser);
router.patch("/updatePassword", auth, passwordValidation, updatePassword);

module.exports = router;
