// Two roles are seeded via POST /init: Admin (id: 1) and User (id: 2).
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
 name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  return Role
};

//had to change file name in order to deploy...ffs...
