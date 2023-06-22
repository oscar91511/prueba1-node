const Repair = require('../models/repair.model');
const Users = require('../models/user.modal');
const catchAsync = require('../utils/cathAsync');

// * search first repair seend request
exports.firstRepairs = catchAsync(async (req, res, next) => {
  const time = req.requesTime;

  const repairs = await Repair.findAll({
    where: {
      status: 'pending',
      attribute: {
        exclude: ['status'],
      },
    },
  });
  return res.json({
    requesTime: time,
    results: repairs.lenght,
    status: 'sucess',
    message: 'Repair Found',
    repairs,
  });
});

// * updateRepair, we seend recuest for update

exports.updateRepair = async (req, res, next) => {
  const { user, repair } = req;

  const updateRepair = await repair.update({
    status: 'completed',
  });
  res.status(200).json({
    status: 'success',
    message: 'The repair has been updated😉👌😁',
    repair: updateRepair,
    user,
  });
};

// * createRepair , we make the firts repair

exports.createRepair = catchAsync(async (req, res, next) => {
  // 1. get information of  req.Body
  const { date, motorsNumber, description } = req.body;
  // 2. create a repair using  dmodelo.
  const repair = await Repair.create({
    date,
    motorsNumber: motorsNumber.toLowerCase(),
    description,
    userId: id,
  });
  // 3. we send request for the client
  res.status(201).json({
    message: 'The repair of Motorcycle has been created successfully👌⚙️',
    repair,
  });
});

// * findRepair, we search and find the repair

exports.firstRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const theOneRepair = await Repair.findOne({
    where: {
      id,
      status: 'pending😎',
    },
    include: [
      {
        model: Users,
        attributes: ['id', 'name', 'email', 'role'],
      },
    ],
  });

  if (!theOneRepair) {
    return res.status(404).json({
      status: 'error',
      message: `The repair id: ${id} not found!😮🧨`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'The repair has been founded👌👌',
    theOneRepair,
  });
});

// * deleteRespair, we seend petitions for delete repair

exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({
    status: 'cancelled',
  });

  res.status(200).json({
    status: 'success',
    message: `The repair id:${repair.id} has been deleted success!😒👌`,
  });
});
