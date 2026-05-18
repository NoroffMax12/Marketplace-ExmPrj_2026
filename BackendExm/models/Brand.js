// Defines brand models — represents product brands, e.g. Samsung
module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    // Brand name, must be provided
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  return Brand;
};