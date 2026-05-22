/* api.test.js
- Integration tests for the Noroff EP API using Jest and Supertest. */

const request = require('supertest')
const app = require('../app')

//Variable to store Ids nd token across tests
let token;
let categoryId;
let brandId;
let productId;

//login as admin bfore all tests
beforeAll(async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({email: 'admin@noroff.no', password: 'P@ssword2023'})
    token = res.body.data.token;
})

//Test 1: Add category.
test('1. Add category TEST_CATEGORY', async () => {
    const res = await request(app)
    .post('/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({name: 'TEST_CATEGORY'})

    expect(res.body.statuscode).toBe(201) //.toBe() is a Jest matcher that checks that the value is exactly equal to the argument
    expect(res.body.data.category.name).toBe('TEST_CATEGORY')

    //Save cat-ID for later tests
    categoryId = res.body.data.category.id;
})

//Test 2: Add brand.
test('2. Add brand TEST_BRAND', async () => {
  const res = await request(app)
    .post('/brands')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'TEST_BRAND' });

  expect(res.body.statuscode).toBe(201);
  expect(res.body.data.brand.name).toBe('TEST_BRAND');

  //Save brand Id
  brandId = res.body.data.brand.id;
})

//Test 3: Add product.
test('3. Add product TEST_PRODUCT', async () => {
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'TEST_PRODUCT',
      unitprice: 99.99,
      quantity: 10,
      BrandId: brandId,
      CategoryId: categoryId,
    })

  expect(res.body.statuscode).toBe(201);
  expect(res.body.data.product.name).toBe('TEST_PRODUCT')
  //Save product ID
  productId = res.body.data.product.id;
});

//Test 4: Get test-products w brand & category names.
test('4. Get TEST_PRODUCT with brand and category names', async () => {
  const res = await request(app)
    .get(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(res.body.statuscode).toBe(200)
  expect(res.body.data.products.name).toBe('TEST_PRODUCT')
  expect(res.body.data.products.brand).toBe('TEST_BRAND')
  expect(res.body.data.products.category).toBe('TEST_CATEGORY');
})

//Test 5: Update category.
test('5. Update category TEST_CATEGORY to TEST_CATEGORY2', async () => {
  const res = await request(app)
    .put(`/categories/${categoryId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'TEST_CATEGORY2' });

  expect(res.body.statuscode).toBe(200)
  expect(res.body.data.category.name).toBe('TEST_CATEGORY2')
});

//Test 6: Update brand name.
test('6. Update brand TEST_BRAND to TEST_BRAND2', async () => {
  const res = await request(app)
    .put(`/brands/${brandId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'TEST_BRAND2' });

  expect(res.body.statuscode).toBe(200);
  expect(res.body.data.brand.name).toBe('TEST_BRAND2');
});

//Test 7: Get test_product w updated brand and cat names.
test('7. Get TEST_PRODUCT with updated brand and category names', async () => {
  const res = await request(app)
    .get(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(res.body.statuscode).toBe(200)
  expect(res.body.data.products.brand).toBe('TEST_BRAND2')
  expect(res.body.data.products.category).toBe('TEST_CATEGORY2');
});

//Test 8: Delete test_product.
test('8. Delete TEST_PRODUCT', async () => {
  const res = await request(app)
    .delete(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(res.body.statuscode).toBe(200)
  expect(res.body.data.result).toBe('Product deleted')
});

// Close database connection after all tests are done
afterAll(async () => {
  const { sequelize } = require('../models')
  await sequelize.close()
});