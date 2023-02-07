const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const schema = joi.object({
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
});

module.exports = passwordValidation = async (req, res, next) => {
    const payload = {
      password: req.body.password,
    };
  
    const { error } = schema.validate(payload, { abortEarly: false });
    if (error) {
      res.status(406);
      return res.json(
        errorFunction(true, `Error in user data: ${error.message}`)
      );
    } else {
      next();
    }
  };


    
