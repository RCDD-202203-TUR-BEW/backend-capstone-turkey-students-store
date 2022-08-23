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
        totalPrice: 100,
        orderItems: [],
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
});
