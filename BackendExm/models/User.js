// Passwords are hashed with bcrypt before storing (handled in auth controller).
// Username and email set to be unique
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Unique username for login
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

     // Unique email address
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    // Hashed password, not to be stored in plain text
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};
