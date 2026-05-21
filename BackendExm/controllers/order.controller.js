// Handles order operations.
// Users can view their own orders.
// Only admins can change order status.

const { Order, OrderItem, Product, User, Membership } = require('../models');

//--GET all orders--
//Admin sees all orders, regular users only see their own
exports.getAll = async (req, res) => {
  try {
    const whereClause = req.user.role !== 'Admin' ? {UserId: req.user.id } : {};

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Membership, attributes: ['name', 'discount'] },
      ],
    })

    if (!orders.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'No orders found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Orders found', orders },
    })

  } catch (err) {
    console.error('getAll error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message },
    })
  }
};

//--GET single order with items--
exports.getOne = async (req, res) => {
  try {
    const whereClause = req.user.role !== 'Admin'
      ? { id: req.params.id, UserId: req.user.id } //Only users can see their orders
      : { id: req.params.id }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {model: User, attributes: ['username', 'email'] },
        {model: Membership, attributes: ['name', 'discount'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'imgurl'] }],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Order not found' },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Order found', order },
    })

  } catch (err) {
    console.error('getOne error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message },
    })
  }
};

//--PATCH update order status (admin only)--
exports.updateStatus = async (req, res) => {
  try {
    const {status} = req.body;

    //Define the only valid status values.
    //Any other value will be rejected.
    const validStatuses = ['In Progress', 'Ordered', 'Completed'];
    // Checks  that status was provided & that it matches one of the valid options. And .includes() returns true if the value exists in the array

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: {result: 'Status must be: In Progress, Ordered or Completed' },
      })
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Order not found' },
      })
    }

    await order.update({ status });
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Order status updated', order },
    })

  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message },
    });
  }
};