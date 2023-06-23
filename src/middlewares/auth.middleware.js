const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/cathAsync');
const Users = require('../models/user.modal');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
    console.log(token)
  if (!token) {
    return next(
      new AppError('You have not logged in!, Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: 'available',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }
console.log(user)
  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (sessionUser.role === 'employee') {
    next();
  } else {
    if (user.id !== sessionUser.id) {
      return next(new AppError('not your account, try again.🧨😮', 401));
    }

    next();
  }
});

exports.restrictionTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('cant do this action not your account!🧨🧨⚙️', 403)
      );
    }

    next();
  };
};
