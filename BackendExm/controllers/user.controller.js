// Handles user management operations.
// Only admins can view and update users.

const {User, Role, Membership} = require('../models');

//--GET all users--
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      // Exclude password from response for security
      attributes: {exclude: ['password']},
      include: [
        {model: Role, attributes: ['name']},
        {model: Membership, attributes: ['name', 'discount']},
      ],
    });

    if (!users.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'No users found'},
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'Users found', users},
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

//--PUT update user (admin can change role)--
exports.update = async (req, res) => {
  try { const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'User not found'},
      })
    }

    //Only allow updating safe fields
    const {firstname, lastname, email, RoleId} = req.body
    await user.update({firstname, lastname, email, RoleId})

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {result: 'User updated', user },
    })

  } catch (err) {
    console.error('update error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};