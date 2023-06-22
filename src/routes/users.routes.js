const { Router } = require('express');
const router = Router();
const validationMiddleware = require('../middlewares/validation.middleware');
const usersController = require('./../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middleware');

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
    usersController.updateUser,
    usersMiddleware.validUser,
    authMiddleware.protectAccountOwner
  )
  .delete(
    usersController.deleteUser,
    usersMiddleware.validUser,
    authMiddleware.protectAccountOwner
  );
module.exports = router;
