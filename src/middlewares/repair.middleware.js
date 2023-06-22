const Repair = require('../models/repair.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/cathAsync');
const Users = require('../models/user.modal');

exports.validRepair = catchAsync(async (res, req, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: {
      id,
      status: 'pending',
    },
    include: [
      {
        model: Users,
        attributes: ['id', 'name', 'email', 'role'],
      },
    ],
  });

  if (!repair) {
    const completedRepair = await Repair.findOne({
      where: {
        id,
        status: 'completed',
      },
    });

    if (completedRepair) {
      return res.status(404).json({
        status: 'error',
        message: `The repair id ${id}  its allready founded, because are complete🫢`,
      });
    }

    return next(new AppError(`The repair ${id} has not founded 😬🧨🧨`, 404));
  }
  req.user = repair.user;
  req.repair = repair;
  next();
});
