const User = require('../models/user.modal');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const catchAsync = require('../utils/cathAsync');
const AppError = require('../utils/appError');

//  * find users

exports.findUsers = catchAsync(async (req, res, next) => {
  const time = req.requestTime;

  const users = await User.findAll({
    where: {
      status: 'available',
      attributes: {
        exclude: ['status', 'password'],
      },
    },
  });

  return res.json({
    requestTime: time,
    results: users.length,
    status: 'success',
    message: 'Users found👌😉',
    users,
  });
});

// * update users

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',

    message: `The user whit id:${id} has been updated👌😉`,
    user: {
      id: user.id,
      name: user.name,
      email: user.enamil,
      role: user.role,
    },
  });
});

// * create user

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userExist = await User.findOne({
    where: {
      email,
    },
  });

  if (userExist) {
    return res.status(404).json({
      status: 'error',
      message: `The user already has been created in the database with the email: ${email}😒`,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });
  const token = await generateJWT(user.id);

  res.status(201).json({
    message: 'User created successfully👌😁',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// * find user

exports.findUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const oneUser = await User.findOne({
    where: {
      id,
      status: 'available',
    },
  });

  if (!oneUser) {
    return res.status(404).json({
      status: 'error',
      message: `user with id: ${id} has not founded 🫢`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'user found',
    oneUser,
  });
});

// * login user

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`User with email:${email} was not found😮`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('wrong email or password😣', 401));
  }
  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//  * Deleted users

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({
    status: 'disabled',
  });

  res.status(200).json({
    status: 'success',
    message: `The user id:${user.id} has been delete 👌😁`,
  });
});
