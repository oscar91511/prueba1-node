const express = require('express');

const repairsController = require('./../controllers/repairs.controller');

const router = express.Router();

router
  .route('/')
  .get(repairsController.firstRepairs)
  .post(repairsController.createRepair);

router
  .route('/:id')
  .get(repairsController.firstRepair)
  .patch(repairsController.updateRepair)
  .delete(repairsController.deleteRepair);

module.exports = router;
