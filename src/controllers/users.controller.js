const User = require('../models/user.modal');

exports.findUsers = async (req, res) => {
  const time = req.requestTime;

  const users = await User.findAll({
    where: {
      status: 'available',
    },
  });

  return res.json({
    requestTime: time,
    results: users.length,
    status: 'success',
    message: 'Users found',
    users,
  });
};

exports.updateUser = async (req, res) => {
  try {
    // 1. get the user how we get update
    const { id } = req.params;
    // 2. get of the body the information how we need update
    const { name, email } = req.body;
    // 3. we searching if the user exist
    const user = await User.findOne({
      where: {
        id,
        status: 'available',
      },
    });
    // 4. validation if user exist
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `User with id: ${id} not found`,
      });
    }
    // 5. making the  Actualization
    await user.update({ name, email });

    // 6. send confirmation all donne runing correctly of cliente
    res.status(200).json({
      status: 'success',
      message: 'The user has been updated',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    // PASO 1: get information of create req.body
    const { id, name, email, password, role, status } = req.body;

    const users = await User.findAll({});

    for (let x = 0; x < users.length; x++) {
      if (email === users[x].email) {
        return res.status(404).json({
          status: 'error',
          message: `User with email: ${email} already exists `,
        });
      }
    }

    //PASO 2: create user using modsl

    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
    });

    // PASO 3: send response of clients

    return res.status(201).json({
      message: 'The user has been created!',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

exports.firsUser = async (req, res) => {
  try {
    //? 1. we get id of parameters
    const { id } = req.params; //DESTRUCION DE OBJETOS

    //? 2. search user on data base
    const user = await User.findOne({
      where: {
        // id: id
        id,
        status: 'available',
      },
    });

    //? 3. valid if user not exits, if exist, ENVsend error  404
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `The user with id: ${id} not found!`,
      });
    }

    //? 4. send response for client
    return res.status(200).json({
      status: 'success',
      message: 'User found',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // get id of parameters
    const { id } = req.params;
    // buscar el usuario
    const user = await User.findOne({
      where: {
        status: 'available',
        id,
      },
    });
    // validation date
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `User with id: ${id} not found!`,
      });
    }
    // actualizar el usuario encontrado y actualizar el status a unavailable
    await user.update({ status: 'unavailable' }); //eliminacion logica
    //await user.destroy() //delete fisicals
    // send request user
    return res.status(200).json({
      status: 'success',
      message: 'the user has been deleted!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};
