const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all model factory functions and pass in sequelize + DataTypes
const Role = require('./Role')(sequelize, DataTypes);
const Membership = require('./Membership')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Brand = require('./Brand')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Cart = require('./Cart')(sequelize, DataTypes);
const CartItem = require('./CartItem')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);
const RecentlyViewed = require('./RecentlyViewed')(sequelize, DataTypes);

// ----- Associations -----
//Role can have many user
Role.hasMany(User, { foreignKey: 'RoleId' })
User.belongsTo(Role, { foreignKey: 'RoleId' });

// A Membership can have many users
Membership.hasMany(User, { foreignKey: 'MembershipId' })
User.belongsTo(Membership, { foreignKey: 'MembershipId' })

// An order gets snaphot of membershipat checkout
Membership.hasMany(Order, { foreignKey: 'MembershipId' })
Order.belongsTo(Membership, { foreignKey: 'MembershipId' })

//Brand & Category can have many products
Brand.hasMany(Product, { foreignKey: 'BrandId' })
Product.belongsTo(Brand, { foreignKey: 'BrandId' })

Category.hasMany(Product, { foreignKey: 'CategoryId' })
Product.belongsTo(Category, { foreignKey: 'CategoryId' })

// A user can have many carts
User.hasMany(Cart, { foreignKey: 'UserId' })
Cart.belongsTo(User, { foreignKey: 'UserId' })

// Cart contains many items & Product can appear in many CartItems
Cart.hasMany(CartItem, { foreignKey: 'CartId' })
CartItem.belongsTo(Cart, { foreignKey: 'CartId' })

Product.hasMany(CartItem, { foreignKey: 'ProductId' })
CartItem.belongsTo(Product, { foreignKey: 'ProductId' })

// A user can place many orders
User.hasMany(Order, { foreignKey: 'UserId' })
Order.belongsTo(User, { foreignKey: 'UserId' })

// An order can contains many orderItems
// & a Product can appear in many orderItems
Order.hasMany(OrderItem, { foreignKey: 'OrderId' })
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' })

Product.hasMany(OrderItem, { foreignKey: 'ProductId' })
OrderItem.belongsTo(Product, { foreignKey: 'ProductId' })

// Users can have & Products can appear in ReacentlyViewd
User.hasMany(RecentlyViewed, { foreignKey: 'UserId' })
RecentlyViewed.belongsTo(User, { foreignKey: 'UserId' })

Product.hasMany(RecentlyViewed, { foreignKey: 'ProductId' })
RecentlyViewed.belongsTo(Product, { foreignKey: 'ProductId' })

module.exports = {
  sequelize,
  Role, Membership, User,
  Category, Brand, Product,
  Cart, CartItem,
  Order, OrderItem,
  RecentlyViewed
};