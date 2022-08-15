// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');

const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

const mUser = {
  firstName: 'Melek',
  lastName: 'Arslan',
  email: 'melek@mail.com',
  schoolName: 'Bilkent University',
  password: 'Ma123',
};

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
});

describe('User routes', () => {
  beforeEach(async () => {
    await server.post('/api/auth/signup').send(mUser);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('PATCH /', () => {
    test('If user email exists, should return an error with status code 400', async () => {
      const expectedResponse = {
        success: false,
        error: 'Email already exists!',
      };
      const user = {
        firstName: 'Mike',
        lastName: 'Arslran',
        email: 'melek@mail.com',
        schoolName: 'Başkent University',
      };
      const res = await server.patch('/api/profile/').send(user);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });
    test('If old password is not correct , should return an error with status code 401', async () => {
      const expectedResponse = {
        success: false,
        error: 'Your old password is not correct please enter again!',
      };
      const user = {
        firstName: 'Mikey',
        oldPassword: 'Ma123445',
        password: 'Ma123w',
      };
      const res = await server.patch('/api/profile/').send(user);
      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If user data is valid, should update user, return its data with status code 200', async () => {
      const mValidRequest = {
        firstName: 'Mike',
      };

      const expectedResponse = {
        firstName: 'Mike',
        lastName: 'Arslan',
        email: 'melek@mail.com',
        schoolName: 'Bilkent University',
      };

      const res = await server.patch('/api/profile/').send(mValidRequest);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
    });
  });
});
