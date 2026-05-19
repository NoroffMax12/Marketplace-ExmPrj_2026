// Populates the DB with initial data
// Checks for existing data before inserting to prevent duplicates.

const { Role, User, Membership, Product, Brand, Category } = require('../models');
const bcrypt = require('bcrypt')

exports.initDatabase = async (req, res) => {
  try {
    // --1. Seed roles--
    const rolesExist = await Role.count()
    if (!rolesExist) {
      await Role.bulkCreate([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ]);
    }

    // --2. Seed Membership (before admin user so MembershipId: 1 exists)--
    const membershipsExist = await Membership.count();
    if (!membershipsExist) {
      await Membership.bulkCreate([
        { id: 1, name: 'Bronze', minQuantity: 0, maxQuantity: 14, discount: 0 },
        { id: 2, name: 'Silver', minQuantity: 15, maxQuantity: 29, discount: 15 },
        { id: 3, name: 'Gold', minQuantity: 30, maxQuantity: null, discount: 30 },
      ]);
    }

    // --3. Seed Admin user--
    const adminExists = await User.findOne({ where: { username: 'Admin' } })  // NTS: "findOne" searches in DB for spesific user, then saves result in "userExists". If user dont exist it return null (similar to findAll)
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('P@ssword2023', 10)
      await User.create({
        username: 'Admin',
        email: 'admin@noroff.no',
        password: hashedPassword,
        firstname: 'Admin',
        lastname: 'Support',
        address: 'Online',
        telephone: '911',
        RoleId: 1,       // Admin role
        MembershipId: 1, // Bronze
      });
    }

    // --4. Fetches products from Noroff API--
    const productsExist = await Product.count()
    if (!productsExist) {
      const response = await fetch('http://backend.restapi.co.za/items/products')
            console.log('Status:', response.status);

      const json = await response.json()
            console.log('JSON:', JSON.stringify(json).slice(0, 500)); 

      const products = json.data
            console.log('Products:', products);


      for (const item of products) {
        const [brand] = await Brand.findOrCreate({// NTS: "findOrCreate" simply creates what doesent already exists in the pklace is supposed to 
         where: { name: item.brand },
        })

        // Find or create category for product
        const [category] = await Category.findOrCreate({
          where: { name: item.category },
        })

        // Creates product with correct FK
        await Product.create({
          name: item.name,
          description: item.description,
          unitprice: item.price,
          quantity: item.quantity,
          imgurl: item.imageUrl,
          isdeleted: false,
          BrandId: brand.id,
          CategoryId: category.id,
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: { result: 'Database initialized successfully' },
    });

  } catch (err) {
    console.error('Init error:', err)
    return res.status(500).json({
      status: 'error',
      statuscode: 500,
      data: { result: err.message },
    });
  }
};