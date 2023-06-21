const express = require('express');
const validationMiddleware = require('../middlewares/validation.middleware');
const repairsController = require('./../controllers/repairs.controller');

const router = express.Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictionTo('employe'),
    repairsController.findRepairs
  )

  .post(
    validationMiddleware.createRepairValidation,
    authMiddleware.protect,
    repairsController.createRepair
  );

router
  .use(authMiddleware.protect)
  .use(authMiddleware.restrictTo('employee'))
  .use('/:id', repairMiddleware.validRepair)
  
  .route('/:id')
  .get(repairsController.firstRepair)
  .patch(authMiddleware.protectAccountOwner, repairsController.updateRepair)
  .delete(authMiddleware.protectAccountOwner, repairsController.deleteRepair);

module.exports = router;
