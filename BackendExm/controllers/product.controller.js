// Handles all CRUD operations for products.
// Only admins can create, update or soft delete products.
const { sequelize } = require('../models');
const { Product, Brand, Category } = require('../models')

// --- GET all products ---
// Admin sees all products including deleted ones. Regular users only see non-deleted products.
exports.getAll = async(req, res) => {
   try{ //NTS: Gets user role from req and saves in "whereClause" variable. 
    const whereClause = req.user?.role !== 'Admin' ? 'WHERE p.isdeleted = false' : '';
    console.log('whereClause:', whereClause)
    console.log('user:', req.user)

    const [products] = await sequelize.query(`
      SELECT p.*, b.name AS brand, c.name AS category
      FROM Products p
      JOIN Brands b ON p.BrandId = b.id
      JOIN Categories c ON p.CategoryId = c.id
      ${whereClause}
    `)

    if (!products.length) {return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'No products found', products: [] },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Products found', products },
    });

  } catch (err) {
    console.error('getOne error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    });
  }
};

// --GET single product by ID--
exports.getOne = async (req, res) => {
  try { const { id } = req.params;

    const [products] = await sequelize.query(`
      SELECT p.*, b.name AS brand, c.name AS category
      FROM Products p
      JOIN Brands b ON p.BrandId = b.id
      JOIN Categories c ON p.CategoryId = c.id
      WHERE p.id = ${id}
    `);

    if (!products.length) {return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Product not found', products: [] },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Product found', products: products[0] },
    })

  } catch (err) { console.error('getOne error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};


// --POST create new product--
exports.create = async (req, res) => {
  try {
    const { name, description, unitprice, quantity, imgurl, BrandId, CategoryId } = req.body;

    if (!name || !unitprice || !quantity || !BrandId || !CategoryId) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'name, unitprice, quantity, BrandId and CategoryId are required' },
      });
    }

    const product = await Product.create({
      name,
      description,
      unitprice,
      quantity,
      imgurl,
      BrandId,
      CategoryId,
      isdeleted: false,
    });

    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: { result: 'Product created', product },
    })

  } catch (err) {
    console.error('create error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};

// --PUT update product--
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product first
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Product not found' },
      });
    }

    await product.update(req.body)
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Product updated', product },
    })

  } catch (err) {
    console.error('update error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};

// --DELETE soft delete product--
// Sets isdeleted to true — product ins't permanently removed from DB
exports.remove = async (req, res) => {
  try { const { id } = req.params;

    const product = await Product.findByPk(id)
    if (!product) { return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Product not found' },
      })
    }

    // Soft delete: set isdeleted flag instead of destroying record
    await product.update({ isdeleted: true })
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Product deleted' },
    })

  } catch (err) {
    console.error('remove error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    });
  }
};