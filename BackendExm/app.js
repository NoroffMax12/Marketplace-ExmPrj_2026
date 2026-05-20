// Configures middleware, imports routes, connects to the database, and sets up Swagger documentation.
var createError = require('http-errors')
// Cookie-Parser reads cookies sent by the browser and converts them into a readable JS objects. Without cookie-parser, you'd have to manually parse the string
var cookieParser = require('cookie-parser')
var express = require('express')
var logger = require('morgan')
var cors = require('cors')
require('dotenv').config()


const { sequelize } = require('./models')

var app = express();

// Allow cross-origin requests from middleware.
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//Routes
app.use('/init', require('./routes/init.routes'))
app.use('/auth', require('./routes/auth.routes'))
app.use('/products', require('./routes/product.routes'))
app.use('/categories', require('./routes/category.routes'))
app.use('/brands', require('./routes/brand.routes'))
app.use('/cart', require('./routes/cart.routes'))
app.use('/orders', require('./routes/order.routes'))
app.use('/membership', require('./routes/membership.routes'))
app.use('/search', require('./routes/search.routes'))
app.use('/users', require('./routes/user.routes'))

// Swagger documentation available at doc
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger/swagger')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


sequelize.sync({ alter: false }) ///Learned that sequilize.sync database - only creates tables if they don't exist
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Database sync failed:', err))

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'error',
    statuscode: err.status || 500,
    data: { result: err.message },
  })
});

module.exports = app;