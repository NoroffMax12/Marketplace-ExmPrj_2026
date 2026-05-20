// Handles user registration and login.
// JWT token is returned on successful register and login.

const {User, Role, Membership} = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')

// --Register
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, address, telephone } = req.body;

    if (!firstname || !lastname || !username || !email || !password || !address || !telephone) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'All fields are required' },
      });
    }

      // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'Invalid email format' },
      })
    }

    // Check if username or email exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    })

      if (existingUser) {return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'Username or email already exists' },
      })
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      address,
      telephone,
      RoleId: 2,       // User role
      MembershipId: 1, // Bronze membership
    })

     // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'User' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(201).json({
      status: 'success',
      statuscode: 201,
      data: {
        result: 'You created an account.',
        token,
      },
    })

  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};

// --- Login ---
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'Email or username and password are required' },
      })
    }

    // Find user by email / username
    const user = await User.findOne({
      where: email ? { email } : { username },
      include: [
        { model: Role, attributes: ['name'] },
        { model: Membership, attributes: ['name', 'discount'] },
      ],
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {return res.status(401).json({
        status: 'error',
        statuscode: 401,
        data: { result: 'Invalid credentials' },
      })
    }

    // Generate JWT token with role included
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.Role.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'You are logged in',
        role: user.Role.name,  // Needed by frontend to check access
        username: user.username,
        email: user.email,
        token,
      },
    })

  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    })
  }
};

