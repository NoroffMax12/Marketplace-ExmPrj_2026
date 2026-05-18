// Only admins can create, update or delete products.
// Deletion is a soft delete — isdeleted is set to true, record stays in DB.

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    // Product name, e.g. "iPhone 6s Plus 16Gb"
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Detailed product description
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Price per unit
    unitprice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Available stock quantity
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // URL to product image
    imgurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Soft delete flag
    isdeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Date the product was added to the system
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Product;
};
