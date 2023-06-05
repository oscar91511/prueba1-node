const Repair = require('../models/repair.model');

exports.firstRepairs = async (req, res) => {
  const time = req.requesTime;

  const repairs = await Repair.findAll({
    where: {
      status: 'pending',
    },
  });
  return res.json({
    requesTime: time,
    results: repairs.lenght,
    status: 'sucess',
    message: 'Repair Found',
    repairs,
  });
};
exports.updateRepair = async (req, res) => {
  try {
    //😁 1. we get the product are update
    const { id } = req.params;
    //😅 2. we get the body infortmation for update
    const { status } = req.body;
    //😎  3. we search the product to update
    const repairs = await Repair.findOne({
      where: {
        id,
        status: 'pending',
      },
    });

    if (!repairs) {
      return res.status(400).json({
        status: 'error',
        message: `The repairs with id ${id} is wrong`,
      });
    }
    // 😁 4. updathing!!
    await Repair.update({ status });

    // 😋 5. send confirm done!👌
    return res.status(200).json({
      status: 'success',
      message: 'The repairs has been updated',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong😫🥴 😵‍💫',
    });
  }
};

exports.createRepair = async (req, res) => {
  try {
    // 1. get information of  req.Body
    const { date,userId } = req.body;

    // 2. create a repair using  dmodelo.

    const repair = await Repair.create({
      date,
      userId,
    });
    // 3. we send request for the client

    return res.status(201).json({
      message: 'the repair has been created.🥳🥳🥳👌👌',
      repair,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

exports.firstRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findOne({
      where: {
        id,
        status: 'pending😎',
      },
    });

    if (!repair) {
      return res.status(400).json({
        status: 'error',
        message: `the repair with id ${id} not found`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Hello from the get products👌👌',
      repair,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'something went very wrong',
    });
  }
};
exports.deleteRepair = async (req, res) => {
  try {
    const { id } = req.params.id;

    const repair = await Repair.findOne({
      where: {
        id,
        status: true,
      },
    });

    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: `Repair with id ${id} not found`,
      });
    }

    await repair.update({ status: 'Cancelled' });

    return res.status(200).json({
      status: 'success',
      message: 'I am sorry you repais has been deleted 😥😶‍🌫️😶‍🌫️',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'something went very wrong. 😣😣😣😣😢',
    });
  }
};
