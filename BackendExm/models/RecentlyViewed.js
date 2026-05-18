// Defines the RecentlyViewed model — tracks the last 3 products viewed by a logged-in user.
// Updated each time a user fetches GET /products/:id.

module.exports = (sequelize, DataTypes) => {
  const RecentlyViewed = sequelize.define('Recently Viewed', {
    // Timestamp of when the product was viewed
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return RecentlyViewed;
};
