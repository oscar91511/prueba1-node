const AppError = require('../utils/appError');
const { promisify } = require('util');
const catchAsync = require('../utils/cathAsync');
const jwt = require('jsonwebtoken');
const Users = require('../models/user.modal');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.starswith('bearer')
  ) {
    token = req.headers.authorization.split('')[1];
  }
  if (!token) {
    return next(
      new AppError(
        'you not are logging yet!, Please login first to get acces🧨🫢',
        401
      )
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
      new AppError('not are the owner of this token!, Please try again😮', 401)
    );
  }
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError(
          'User recently changed password!, please try again.😬🫢',
          401
        )
      );
    }
  }

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (sessionUser.role === 'employe') {
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
