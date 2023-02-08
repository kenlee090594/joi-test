const asyncHandler = require("express-async-handler");
const errorFunction = require("../../utils/errorFunction");
const { Company, Device } = require("../../models");

const createDevice = asyncHandler(async (req, res) => {
  const { deviceName, deviceModel, quantity, companyId } = req.body;

  if (!deviceName || !deviceModel || !quantity) {
    res.status(400).json(errorFunction(true, "Please fill in all the fields"));
  }

  const newDevice = await Device.create({
    user: req.user.id,
    deviceName,
    deviceModel,
    quantity,
  });
  await Company.updateOne(
    { _id: companyId },
    { $push: { devices: newDevice.id } },
    { omitUndefined: true }
  );
  res
    .status(201)
    .json(errorFunction(false, "Device successfully created", newDevice));
});

const getAllDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({ user: req.user }).sort("deviceName");
  res.status(200).json(devices);
});

module.exports = { createDevice, getAllDevices };
