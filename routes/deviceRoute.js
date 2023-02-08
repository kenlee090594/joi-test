const router = require("express").Router();
const { deviceValidation } = require("../utils/validator");
const auth = require("../utils/authentication");

const {
  createDevice,
  getAllDevices,
} = require("../controllers/device/deviceController");

router.post("/createDevice", auth, deviceValidation, createDevice);
router.get("/getAllDevice", auth, getAllDevices);

module.exports = router;