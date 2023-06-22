const Users = require('../models/user.modal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/cathAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`User ${id} was not found 🫢⚙️`, 404));
  }

  req.user = user;
  next();
});
