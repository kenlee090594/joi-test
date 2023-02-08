const asyncHandler = require("express-async-handler");
const errorFunction = require("../../utils/errorFunction");
const { Company, User } = require("../../models");

const createCompany = asyncHandler(async (req, res) => {
  const { companyName, companyAddress } = req.body;

  if (!companyName && !companyAddress) {
    res.status(400).json(errorFunction(true, "Please add company name"));
  } else {
    const company = await Company.create({
      user: req.user.id,
      companyName: companyName,
      companyAddress: companyAddress,
    });
    res
      .status(201)
      .json(errorFunction(false, "Company successfully added!", company));
    console.log(req.user.id);
  }
});

const getCompanyList = asyncHandler(async (req, res) => {
  const companies = await Company.find({user: req.user.id}).sort(
    "companyName"
  );
  if (companies) {
    res.status(200).json(errorFunction(false, companies));
  } else {
    res.status(406).json(errorFunction(true, "No company listed"));
  }
});

const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate("devices");
  if (company) {
    res.status(200).json(errorFunction(false, company));
  } else {
    res.status(406).json(errorFunction(true, "Company not Listed"));
  }
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    company.companyName = req.body.companyName;
    company.companyAddress = req.body.companyAddress;

    const updatedCompany = await Company.save();
    res
      .status(200)
      .json(
        errorFunction(false, "Company updated successfully", updatedCompany)
      );
  } else {
    res.status(406).json(errorFunction(true, "Error updating company"));
  }
});

module.exports = {
  createCompany,
  getCompanyList,
  getCompanyById,
  updateCompany,
};
