// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');
const {
  closeDatabase,
  clearDatabase,
  connectToMongoAtlas,
} = require('../../db/connection');
const Product = require('../../models/product');

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
  await connectToMongoAtlas();
  await clearDatabase();
});

describe('Products routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /', () => {
    test('Fetch all products, return with 200 status code', async () => {
      // first create a product
      await Product.create(mProduct);
      // now get all products
      const res = await request(app).get('/api/products/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(expect.objectContaining(mProduct));
    });
  });
});
