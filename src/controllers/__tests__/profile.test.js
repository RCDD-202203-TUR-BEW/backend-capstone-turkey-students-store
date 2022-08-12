/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('../../app');

const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

// const mProfile = {
//   firstName: 'İrem',
//   lastName: 'Kurt',
//   email: 'ikurt@mail.com',
//   schoolName: 'Bogazici University',
//   password: 'ikurt123',
// };
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
    //   test('If any of required fields are not passed, should return an error with status code 400', async () => {
    //     const mProfileWithoutFirstName = JSON.parse(JSON.stringify(mProfile));
    //     delete mProfileWithoutFirstName.firstName;
    //     const res = await server.get('/profile').send(mProfileWithoutFirstName);
    //     expect(res.status).toBe(400);
    //     expect(res.headers['content-type']).toMatch('application/json');
    //     expect(res.body.success).toBe(false);
    //     expect(res.body.errors[0].msg).toBe('"firstName" is required');
    //   });
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
