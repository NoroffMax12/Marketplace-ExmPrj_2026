// Endpoints are documented with JSDoc comments in each route file.
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Noroff Marketplace API',
      version: '1.0.0',
      description: 'Backend API for the Noroff EP e-commerce exam project',
    },

    // Enable JWT bearer token authentication in Swagger UI
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Scan all route files for JSDoc Swagger comments
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);