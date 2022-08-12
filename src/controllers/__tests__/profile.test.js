/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('../../app');

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

describe('Profile routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /profile', () => {
    beforeEach(async () => {
      await server.post('/api/auth/signup').send(user);
    });
    test('If all required fields are correct, return with status code 200', async () => {
      const expectedResponse = JSON.parse(JSON.stringify(user));
      delete expectedResponse.password;
      const res = await server.get('/api/profile/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
    });
  });
});
