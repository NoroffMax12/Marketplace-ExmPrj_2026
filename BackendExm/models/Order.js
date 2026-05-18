// Captures the user's membership tier at checkout time (snapshot).
// Only admins can change the order status.

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderNumber: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },

      // Current status of the order
    status: {
      type: DataTypes.ENUM('In Progress', 'Ordered', 'Completed'),
      defaultValue: 'In Progress',
    },

    // Total price after membership discount applied at checkout
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Order;
};