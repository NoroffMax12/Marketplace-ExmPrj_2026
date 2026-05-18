// If the same product is added twice, quantity is incremented instead of creating a new row.
// Out-of-stock products cannot be added to a cart.

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    // Number of units of this product in the cart
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return CartItem;
};