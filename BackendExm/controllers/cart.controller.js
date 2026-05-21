//Handles cart operations for registered users.
//Users can add, view and remove items from their cart.
//Checkout creates an order and updates membership status.

const {Cart, CartItem, Product, Order, OrderItem, User, Membership} = require('../models')
const {sequelize} = require('../models')
const {Op} = require('sequelize')

//--GET active cart for logged-in user--
exports.getCart = async (req, res) => {
  try {
    //Find the user's active (not checked out) cart
    const cart = await Cart.findOne({
      where: {UserId: req.user.id, isCheckedOut: false },
      include: [{
        model: CartItem,
        include: [{
          model: Product,
          attributes: ['id', 'name', 'unitprice', 'imgurl', 'quantity'],
        }],
      }],
    })

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'No active cart found' },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Cart found', cart },
    })

  } catch (err) {
    console.error('getCart error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message },
    })
  }
}

//--POST add product to cart--
exports.addItem = async (req, res) => {
  try {
    const {ProductId} = req.body

    if (!ProductId) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'ProductId is required' },
      })
    }

    const product = await Product.findOne({
      where: { id: ProductId, isdeleted: false },
    })

    if (!product) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Product not found or unavailable' },
      })
    }

    //Checks for product is in stock or less than 1
    if (product.quantity < 1) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: {result: 'Product is out of stock' },
      })
    }

    /*Finds or create an active cart for the user.
    (NTS: "findOrCreate" checks if a cart exists where UserId matches the logged-in user. And "isCheckedOut" is false (meaning it's still active)). 
    - If no active cart exists a new one gets created automatically. */
    const [cart] = await Cart.findOrCreate({
      where: {UserId: req.user.id, isCheckedOut: false },
    })

    /*Checks if product already exists in cart as CartItem 
    - This prevents duplicate rows - instead we increment quantity below.*/
    const existingItem = await CartItem.findOne({
      where: {CartId: cart.id, ProductId},
    })

    if (existingItem) {
      /*Checks if there's enough stock for incremented quantity
      - Check if adding one more would exceed available stock. */
      if (existingItem.quantity + 1 > product.quantity) {
        return res.status(400).json({
          status: 'error',
          statuscode: 400,
          data: {result: 'Not enough stock available'},
        })
      }

      await existingItem.update({quantity: existingItem.quantity + 1 })
    } else {
      //Create new cart item
      await CartItem.create({CartId: cart.id, ProductId, quantity: 1 })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Product added to cart'},
    });

  } catch (err) {
    console.error('addItem error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};

//--DELETE remove item from cart--
exports.removeItem = async (req, res) => {
  try { 
    const item = await CartItem.findByPk(req.params.itemId)

    if (!item) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Cart item not found' },
      })
    }

    //Hard delete; removing completely from cart
    await item.destroy()
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Item removed from cart' },
    })

  } catch (err) {
    console.error('removeItem error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};

//--POST checkout cart--
exports.checkout = async (req, res) => {
  try { 
    console.log('Checkout hit user:', req.user); //Husk å slette
    const cart = await Cart.findOne({ // Gets user's active cart with items & product details
      where: {UserId: req.user.id, isCheckedOut: false },
      include: [{
        model: CartItem,
        include: [{ model: Product }],
      }],
    })

    if (!cart || !cart.CartItems.length) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: {result: 'No active cart or cart is empty' },
      })
    }

    //Verify all items have enough stock
    for (const item of cart.CartItems) {
      if (item.quantity > item.Product.quantity) {
        return res.status(400).json({
          status: 'error',
          statuscode: 400,
          data: {result: `Not enough stock for ${item.Product.name}` },
        })
      }
    }

    //Get user with current membership for discount calculations
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Membership }],
    })

    const discount = user.Membership.discount

    //Calculate total price with membership discount
    const subtotal = cart.CartItems.reduce((sum, item) => {
      return sum + item.Product.unitprice * item.quantity
    }, 0)

    const totalPrice = subtotal * (1 - discount / 100)

    /*Math.random() generates a random decimal number like 0.7394821
    - .toString(36) converts it to base-36 (0-9 + a-z) f,eks "0.p3k9x2m"
    - .substr(2, 8) cuts away "0." and takes the first 8 characters, f,eks "p3k9x2m"
    - .toUpperCase() converts it to uppercase letters, f,eks "P3K9X2M" */
    const orderNumber = Math.random().toString(36).substr(2, 8).toUpperCase()

    /* Create the order with membership snapshot at checkout time
    - .toFixed(2) rounds to 2 decimal places and returns a STRING f,eks "551.65"
    - parseFloat() converts the string back to a number
    - the result is a clean number with a max of 2 decimal places which is important for price calculation.
    */
    const order = await Order.create({
      orderNumber,
      status: 'In Progress',
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      UserId: req.user.id,
      MembershipId: user.MembershipId,
    })

    //Create order items w price snapshot for cart items
    for (const item of cart.CartItems) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.ProductId,
        quantity: item.quantity,
        unitprice: item.Product.unitprice, //Freze price at checkout
      })

      await item.Product.update({
        quantity: item.Product.quantity - item.quantity,
      })
    }
      //Mark cart as checked out
    await cart.update({ isCheckedOut: true })

    /*Calculate total items purchased ever to update membership. But hit an issue that; When you run a standard SUM() in Sequelize with an include, it generates an SQL query in the background. Since there is no GROUP BY clause in this generated query, MySQL doesn't know which specific orders.id or orders.orderNumber to return alongside the single, aggregated sum. With ONLY_FULL_GROUP_BY enabled, the database throws an ERROR 1055:
    - const totalPurchased = await OrderItem.sum('quantity', {
      include: [{
        model: Order,
        where:  {UserId: req.user.id } */

      /*By switching to Raw SQL, you take full control of the SELECT list and fetch only the sum, allowing MySQL to avoid guessing undefined row values.*/
    const [[{ totalPurchased }]] = await sequelize.query(`
    SELECT COALESCE(SUM(oi.quantity), 0) AS totalPurchased
    FROM OrderItems oi
    JOIN Orders o ON oi.OrderId = o.id
    WHERE o.UserId = ${req.user.id}
    `, { replacements: { userId: req.user.id } }) //Using replacements to prevent SQL injection


    //Finds correct membership-tier based on total items purchased
    const newMembership = await Membership.findOne({
      where: {
        minQuantity: { [Op.lte]: totalPurchased },
        [Op.or]: [
          {maxQuantity: { [Op.gte]: totalPurchased } },
          {maxQuantity: null },
        ],
      },
    })

    //Updates user membership if it got changed
    if (newMembership && newMembership.id !== user.MembershipId) {
      await user.update({ MembershipId: newMembership.id })
    }

    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {
        result: 'Order created successfully',
        order,
        membership: newMembership.name,
      },
    })

  } catch (err) {
    console.error('checkout error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};
