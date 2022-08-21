// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
// const path = require('path');
// const mongoose = require('mongoose');
const app = require('../../app');
// const Product = require('../../models/product');

// const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
  await clearDatabase();
});

describe('Donation routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /', () => {
    test('Donate specified amount, return transaction url with 201 status code', async () => {
      const res = await request(app)
        .post('/api/donation/')
        .send({ amount: 25 });
      expect(res.status).toBe(201);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toMatch('https://checkout.stripe.com/pay/');
    });
  });
});
