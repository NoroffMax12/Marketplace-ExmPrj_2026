// Unitprice is a snapshot of the product's price at checkout.
// This ensures that the price changes after checkout.

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    // Number of units of this product ordered
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Price per unit at the time of checkout.
    unitprice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return OrderItem;
};