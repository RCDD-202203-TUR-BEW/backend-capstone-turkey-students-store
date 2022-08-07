// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');
const { closeDatabase, clearDatabase } = require('../../db/connection');

const mProduct = {
  title: 'Cheese',
  description: 'Kars cheese 1000g',
  price: 175,
  category: 'Food',
  coverImage:
    'https://www.artvinyoresel.com/image/cache/catalog/images%20-%202020-04-30T043931.448-270x270.jpeg',
  type: 'Product',
  location: 'Artvin',
};

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await clearDatabase();
});

describe('Products routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /', () => {
    test('If one of the required fields are not passed, return error with status code 500', async () => {
      const expectedResponse = {
        success: false,
        error: 'Product validation failed: title: Title cannot be empty!',
      };
      // pass a request body without required field 'title'
      const mProductWithoutTitle = JSON.parse(JSON.stringify(mProduct));
      delete mProductWithoutTitle.title;
      // send post request
      const res = await request(app)
        .post('/api/products/')
        .send(mProductWithoutTitle);
      expect(res.status).toBe(500);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If all required fields are passed, create product, return with status code 201', async () => {
      const res = await request(app).post('/api/products/').send(mProduct);
      expect(res.status).toBe(201);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mProduct));
    });
  });
});
