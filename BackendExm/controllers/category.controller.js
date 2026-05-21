// Handles all CRUD operations for categories.
// Only admins can create, update or delete categories.
const {Category} = require('../models')

//--GET all categories
exports.getAll = async (req, res) => {
    try { const categories = await Category.findAll();

    if (!categories.length) {
        return res.status(404).json({
            status: 'error',
            statuscode: 404,
            data: {result: 'No categories found'}      
        })
    }

    return res.status(200).json({
        status: 'Success',
        statuscode: 200,
        data: {result: 'Categories found', categories}
    })

    } catch (err) {
        console.error('getAll error:', err)
        return res.status(500).json({
            status: 'error',
            statuscode: 500,
            data: {result: err.message},
        })
    }
};

// --GET single category by ID--
exports.getOne = async (req, res) => {
  try { const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Category not found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Category found', category},
    })

  } catch (err) {
    console.error('getOne error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
}

//--POST create new category--
exports.create = async (req, res) => {
  try { const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'Name is required' },
      })
    }

    const category = await Category.create({name})
    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: { result: 'Category created', category },
    })

  } catch (err) {
    console.error('create error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};

//--PUT update category--
exports.update = async (req, res) => {
  try { const category = await Category.findByPk(req.params.id);

    if (!category) { return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Category not found'},
      })
    }

    await category.update(req.body)
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Category updated', category},
    })

  } catch (err) { console.error('update error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
}

//--DELETE category--
exports.remove = async (req, res) => {
  try {const category = await Category.findByPk(req.params.id)

    if (!category) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Category not found'},
      })
    }

    await category.destroy()
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Category deleted'},
    })

  } catch (err) {
    console.error('remove error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message},
    });
  }
};
