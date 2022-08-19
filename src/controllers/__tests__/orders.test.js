// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Order = require('../../models/order');

const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

const mUser = {
  firstName: 'Peter',
  lastName: 'Griffin',
  email: 'peter@mail.com',
  schoolName: 'Quahog University',
  password: 'petE123',
};

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
  await clearDatabase();
});

const mOrder = {
  buyer: { '62ff339d687607e2ea9d9e02': 'Peter' },
  totalPrice: 100,
  orderItems: ['book'],
  notes: 'My books order',
};

describe('Orders routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });
  describe('GET /:id', () => {
    test('If order not found, return with 404 status code', async () => {
      const expectedResponseOrder = {
        success: false,
        error: 'Order not found!',
      };
      await request(app).post('/api/orders/').send(mOrder);
      let mId = new mongoose.Types.ObjectId();
      mId = mId.toString();
      // find product by mock id
      const res = await request(app).get(`/api/orders/${mId}`);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponseOrder));
    });
    test('If order with passed id exists, return order with 200 status code', async () => {
      const order = await Order.create(mOrder);
      const id = order._id;
      // find product by id
      const res = await request(app).get(`/api/orders/${id}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mOrder));
    });
  });
});
