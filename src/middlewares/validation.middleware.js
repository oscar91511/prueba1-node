const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('The name cannot be empty 😒'),
  body('email')
    .notEmpty()
    .withMessage('The mail cannot be empty 😒')
    .isEmail()
    .withMessage('Must be a valid email⚙️'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty 🫢')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters⚙️'),
  validFields,
];

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty😒')
    .isEmail()
    .withMessage('Must be a valid email⚙️'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty🫢')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters⚙️'),
  validFields,
];

exports.createRepairValidation = [
  body('date')
    .notEmpty()
    .withMessage('Date cannot be empty⚙️')
    .isDate()
    .withMessage('This field must be a date⚙️'),
  body('motorsNumber')
    .notEmpty()
    .withMessage('Motors Number cannot be empty⚙️')
    .isLength({ min: 6 })
    .withMessage('Motors Number must be at least 6 characters⚙️'),
  body('description').notEmpty().withMessage('The description cannot be empty😬,Please try again!'),
  validFields,
];
