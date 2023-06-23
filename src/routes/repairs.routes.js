const { Router } = require('express');
const router = Router();
const validationMiddleware = require('../middlewares/validation.middleware');
const repairsController = require('./../controllers/repairs.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const repairMiddleware = require('../middlewares/repair.middleware');


router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictionTo('employee'),
    repairsController.firstRepair
  )

  .post(
    validationMiddleware.createRepairValidation,
    authMiddleware.protect,
    repairsController.createRepair
  );

router
  .use(authMiddleware.protect)
  .use(authMiddleware.restrictionTo('employee'))
  .use('/:id', repairMiddleware.validRepair)
  
  .route('/:id')
  .get(repairsController.firstRepair)
  .patch(authMiddleware.protectAccountOwner, repairsController.updateRepair)
  .delete(authMiddleware.protectAccountOwner, repairsController.deleteRepair);

module.exports = router;
