const express = require('express');

const validationMiddleware = require('../middlewares/validation.middleware');
const usersController = require('./../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middleware');

const router = express.Router();

router
  .route('/')
  .get(authMiddleware.protect, usersController.findUsers)
  .post(validationMiddleware.createUserValidation, usersController.createUser);

router.post(
  '/login',
  validationMiddleware.loginUserValidation,
  usersController.login
);

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(usersMiddleware.validUser, usersController.findUser)
  .patch(
    usersMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    usersController.updateUser
  )
  .delete(
    usersMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    usersController.deleteUser
  );
module.exports = router;
