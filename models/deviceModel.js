const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    deviceName: {
      type: String,
      required: true,
    },
    deviceModel: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
