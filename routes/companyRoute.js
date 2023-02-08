const router = require('express').Router();
const { companyValidation } = require('../utils/validator');
const auth = require('../utils/authentication');
const {
  createCompany,
  getCompanyList,
  getCompanyById,
  updateCompany
} = require('../controllers/company/companyController')

router.post("/createCompany", auth, companyValidation, createCompany);
router.get("/getAllCompanies", auth, getCompanyList);
router.get("/getCompany/:id", auth, getCompanyById);
router.patch("/updateCompany/:id", auth, updateCompany);

module.exports = router