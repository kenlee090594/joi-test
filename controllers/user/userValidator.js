const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);
const errorFunction = require("../../utils/errorFunction");
const { parsePhoneNumberWithError } = require('libphonenumber-js');

const validation = joi.object({
  userName: joi.string().alphanum().min(4).max(20).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .messages({
      "password.minOfUppercase":
        "{#label} should contain at least {#min} uppercase character",
      "password.minOfSpecialCharacters":
        "{#label} should contain at least {#min} special character",
      "password.minOfLowercase":
        "{#label} should contain at least {#min} lowercase character",
      "password.minOfNumeric":
        "{#label} should contain at least {#min} numeric character",
      "password.noWhiteSpaces": "{#label} should not contain white spaces",
    }),
  mobileNumber: joi.string().custom((value, helper) => {
    try {
        parsePhoneNumberWithError(value);
        return value;
    } catch (e) {
        return helper.message(`body.phone must be a valid phone(${e.message})`);
    }
}),
});

module.exports = userValidation = async (req, res, next) => {
  const payload = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber,
  };

  const { error } = validation.validate(payload, { abortEarly: false });
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in user data: ${error.message}`)
    );
  } else {
    next();
  }
};
