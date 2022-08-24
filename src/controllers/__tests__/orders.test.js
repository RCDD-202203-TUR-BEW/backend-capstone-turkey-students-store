// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Order = require('../../models/order');
const Product = require('../../models/product');

const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

const user = {
  firstName: 'Glenn',
  lastName: 'Quagmire',
  email: 'glennQQQ@email.com',
  schoolName: 'Yale University',
  password: 'gleN123',
};

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
  await clearDatabase();
});

describe('Orders routes', () => {
  let mUser;
  beforeEach(async () => {
    mUser = await server.post('/api/auth/signup').send(user);
  });
  afterEach(async () => {
    await clearDatabase();
  });
  describe('GET /:id', () => {
    test('If order not found, return with 404 status code', async () => {
      const expectedResponseOrder = {
        success: false,
        error: 'Order not found!',
      };
      let mId = new mongoose.Types.ObjectId();
      mId = mId.toString();
      const res = await server.get(`/api/orders/${mId}`);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponseOrder));
    });
    test('If order found, return with 200 status code', async () => {
      const mOrder = {
        buyer: mUser.body.data._id,
        notes: 'My books order',
      };
      const order = await Order.create(mOrder);
      const id = order._id;
      const res = await server.get(`/api/orders/${id}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mOrder));
    });
  });

  describe('GET /', () => {
    test('If user is unauthenticated, return error with status code 401', async () => {
      const res = await request(app).get('/api/orders/');
      expect(res.status).toBe(401);
    });

    test('Fetch all orders of the logged user, return with 200 status code', async () => {
      // first, create a product
      const mProduct = {
        title: 'Cheese',
        description: 'Kars cheese 1000g',
        price: 175,
        category: 'Food',
        coverImage:
          'https://www.artvinyoresel.com/image/cache/catalog/images%20-%202020-04-30T043931.448-270x270.jpeg',
        type: 'Product',
        location: {
          lat: 22.355,
          lng: 38.399,
        },
      };
      const product = await Product.create(mProduct);
      // then, create an order using this user's id as buyer
      const mOrder = {
        buyer: mUser.body.data._id,
        product: product._id,
        notes: 'My books order',
      };
      const order = await Order.create(mOrder);
      // now test endpoint
      const res = await server.get('/api/orders/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]._id).toBe(order._id.toString());
      expect(res.body.data[0].buyer).toBe(mUser.body.data._id.toString());
      expect(res.body.data[0].product._id).toBe(product._id.toString());
      expect(res.body.data[0].notes).toBe('My books order');
    });
  });
});
