const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    companyName: {
      type:  String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
