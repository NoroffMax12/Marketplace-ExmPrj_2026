/*Returns the last 3 unique products viewed by the logged-in user. RecentlyViewed is updated each time a user fetches GET */

const { RecentlyViewed, Product, Brand, Category } = require('../models');

exports.getRecentlyViewed = async (req, res) => {
  try {
    /*Fetch last 3 recently viewed products for the logged-in user. Ordered by viewedAt descending so most recent comes first*/
    const recentlyViewed = await RecentlyViewed.findAll({
      where: { UserId: req.user.id },
      order: [['viewedAt', 'DESC']],
      limit: 3,
      include: [{
        model: Product,
        attributes: ['id', 'name', 'unitprice', 'imgurl'],
        include: [
          { model: Brand, attributes: ['name'] },
          { model: Category, attributes: ['name'] },
        ],
      }],
    })

    if (!recentlyViewed.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'No recently viewed products found' },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Recently viewed products found', recentlyViewed },
    })

  } catch (err) {
    console.error('getRecentlyViewed error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};