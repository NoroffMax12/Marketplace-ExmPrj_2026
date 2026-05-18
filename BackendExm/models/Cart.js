// A user can have multiple carts but only one active (isCheckedOut: false) at a time.
// When a user checks out, isCheckedOut is set to true and an Order is created.
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    // Tracks whether this cart has been checked out
    // false = active cart / true = checked out (becomes order)
    isCheckedOut: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Cart;
};
