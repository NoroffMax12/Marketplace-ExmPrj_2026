// Defines the Membership model — represents membership tiers (Bronze, Silver, Gold).
// Membership status is based on total quantity of items purchased by a user.

module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define('Membership', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Minimum total items purchased to qualify for this tier
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Maximum total items purchased for this tier (null = no upper limit, e.g. Gold)
    maxQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Discount percentage applied at checkout, e.g. 0, 15, 30
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Membership;
};