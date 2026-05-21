//Handles product search using raw SQL as required by the spec.
const {sequelize} = require('../models')

exports.search = async (req, res) => {
  try { const {name, category, brand} = req.body

    if (!name && !category && !brand) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400,
        data: { result: 'Provide at least one search parameter: name, category or brand'},
      })
    }

    //Raw SQL query - shows non-deleted products
    // NTS: query variable with raw sql abbriviations
    let query = `
      SELECT p.*, b.name AS brand, c.name AS category
      FROM Products p
      JOIN Brands b ON p.BrandId = b.id
      JOIN Categories c ON p.CategoryId = c.id
      WHERE p.isdeleted = false
    `;

    //Used parameterized queries to prevent SQL injection
    //NTS: Parameterized queries protect against SQL injection attacks
    const replacements = {}; // Object holding the values to safely replace placeholders in the query

    if (name) {
    query += ` AND p.name LIKE :name` // :name is placeholder
    replacements.name = `%${name}%`// this value replaces :name safely

    }  if (category) {
    query += ` AND c.name LIKE :category`
    replacements.category = `%${category}%`

    } if (brand) {
    query += ` AND b.name LIKE :brand`
    replacements.brand = `%${brand}%`
    }

    const [results] = await sequelize.query(query, { replacements })
    if (!results.length) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {result: 'No products found', count: 0, products: [] },
      })
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Products found',
        count: results.length, // Total number of results
        products: results,
      },
    })

  } catch (err) {
    console.error('search error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: {result: err.message},
    })
  }
};