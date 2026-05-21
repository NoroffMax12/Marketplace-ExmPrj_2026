// Handles all CRUD operations for membership tiers.
// Only admins can create, update or delete memberships.

const {Membership} = require('../models')

//--GET all memberships--
exports.getAll = async (req, res) => {
  try { const memberships = await Membership.findAll()

    if (!memberships.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'No memberships found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Memberships found', memberships},
    })

  } catch (err) {
    console.error('getAll error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
}

//--GET single membership by ID--
exports.getOne = async (req, res) => {
  try { 
    const membership = await Membership.findByPk(req.params.id);

    if (!membership) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'Membership not found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Membership found', membership},
    })

  } catch (err) {
    console.error('getOne error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message},
    })
  }
}

//--POST create new membership tier--
exports.create = async (req, res) => {
  try { const { name, minQuantity, maxQuantity, discount } = req.body;

    if (!name || minQuantity === undefined || discount === undefined) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'name, minQuantity and discount are required'},
      })
    }

    const membership = await Membership.create({
      name,
      minQuantity,
      maxQuantity: maxQuantity ?? null, //NTS: null = no upper limit (f,eks Gold)
      discount,
    });

    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: { result: 'Membership created', membership},
    })

  } catch (err) {
    console.error('create error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    });
  }
}

//--PUT update membership tier--
exports.update = async (req, res) => {
  try { const membership = await Membership.findByPk(req.params.id)

    if (!membership) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Membership not found'},
      })
    }

    await membership.update(req.body)
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Membership updated', membership},
    })

  } catch (err) {
    console.error('update error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    });
  }
};

//--DELETE membership tier--
exports.remove = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);

    if (!membership) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: { result: 'Membership not found'},
      })
    }

    await membership.destroy();
    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Membership deleted'},
    });

  } catch (err) {
    console.error('remove error:', err);
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message},
    });
  }
};