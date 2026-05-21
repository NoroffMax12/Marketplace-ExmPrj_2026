
// Handles all CRUD operations for brands.
// Only admins can create, update or delete brands.


const {Brand} = require('../models');

//--GET all brands--
exports.getAll = async (req, res) => {
  try { const brands = await Brand.findAll();

    if (!brands.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'No brands found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Brands found', brands},
    });

  } catch (err) {
    console.error('getAll error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};

//--GET single brand by ID--
exports.getOne = async (req, res) => {
  try { const brand = await Brand.findByPk(req.params.id);

    if (!brand) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Brand not found'},
      });
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Brand found', brand},
    });

  } catch (err) {
    console.error('getOne error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message},
    })
  }
};

//--POST create new brand--
exports.create = async (req, res) => {
  try { const {name} = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data:  {result: 'Name is required'},
      });
    }

    const brand = await Brand.create({name})
    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {result: 'Brand created', brand},
    });

  } catch (err) {
    console.error('create error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};

//--PUT update brand--
exports.update = async (req, res) => {
  try { const brand = await Brand.findByPk(req.params.id)

    if (!brand) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Brand not found'},
      })
    }

    await brand.update(req.body)
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data:  {result: 'Brand updated', brand},
    })

  } catch (err) {
    console.error('update error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
}

// --DELETE brand--
exports.remove = async (req, res) => {
  try { const brand = await Brand.findByPk(req.params.id);

    if (!brand) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Brand not found'},
      })
    }

    await brand.destroy()
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Brand deleted' },
    })

  } catch (err) {
    console.error('remove error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    });
  }
};