// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
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

describe('Orders routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /', () => {
    test('If user is unauthenticated, return error with status code 401', async () => {
      const res = await server.get('/api/orders/');
      expect(res.status).toBe(401);
    });

    test('Fetch all orders of the logged user, return with 200 status code', async () => {
      // first, create a user
      const user = await server.post('/api/auth/signup').send(mUser);
      // then, create an order using this user's id as buyer
      const mOrder = {
        buyer: { _id: user.body.data._id },
        totalPrice: 100,
        orderItems: [],
        notes: 'My books order',
      };
      const order = await Order.create(mOrder);
      // now test endpoint
      const res = await server.get('/api/orders/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(expect.objectContaining(mOrder));
      expect(res.body.data[0]._id).toBe(order._id.toString());
    });
  });
});
