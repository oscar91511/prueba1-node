const Repairs = require('../models/repair.model');
const Users = require('./user.modal');

const initModel = () => {
  Users.hasMany(Repairs, { foreignKey: 'userId' });
  Repairs.belongsTo(Users, { foreignKey: 'userId' });
};

module.exports = initModel;
