
// Only admins can create, update or delete categories.
module.exports = (sequilize, DataTypes) => {
    const Category = sequilize.define('Category', {
        name: {
            type: DataTypes.STRING,
        allowNull: false, //NTS: allowNull is a column property that controls whether a database field can contain NULL values
    },
    })

    return Category;
};
