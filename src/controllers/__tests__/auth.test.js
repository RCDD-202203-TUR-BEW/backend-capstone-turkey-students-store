// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');
const { closeDatabase, clearDatabase } = require('../../db/connection');

const mUser = {
  name: 'Cengiz',
  surname: 'Aksakal',
  emailAddress: 'cba@mail.com',
  schoolName: 'Anadolu University',
  password: '123456',
  confirmPassword: '123456',
};

afterAll(async () => {
  await closeDatabase();
});

describe('Auth routes', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(mUser);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /signup', () => {
    test('If user email exists, should return an error with status code 400', async () => {
      const expectedResponse = {
        success: false,
        error: 'Email already exists!',
      };
      const res = await request(app).post('/api/auth/signup').send(mUser);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If passwords do not match, should return an error with status code 400', async () => {
      const mReqBody = {
        name: 'Cengiz',
        surname: 'Aksakal',
        emailAddress: 'xyz@mail.com',
        schoolName: 'Anadolu University',
        password: '123456',
        confirmPassword: 'xyz',
      };

      const expectedResponse = {
        success: false,
        error: 'Passwords do not match!',
      };
      const res = await request(app).post('/api/auth/signup').send(mReqBody);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If user data is valid, should create a user, return its data with status code 201', async () => {
      const mValidRequest = {
        name: 'Mike',
        surname: 'Tyson',
        emailAddress: 'mike@mail.com',
        schoolName: 'Princeton University',
        password: '12345',
        confirmPassword: '12345',
      };

      const expectedResponse = {
        firstName: 'Mike',
        lastName: 'Tyson',
        email: 'mike@mail.com',
        schoolName: 'Princeton University',
      };

      const res = await request(app)
        .post('/api/auth/signup')
        .send(mValidRequest);
      expect(res.status).toBe(201);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
    });
  });

  describe('POST /signin', () => {
    test('If user email does not exist, should return an error with status code 401', async () => {
      const mReq = {
        email: 'xyz@mail.com',
        password: '123456',
      };

      const expectedResponse = {
        success: false,
        error: 'Invalid email or password!',
      };

      const res = await request(app).post('/api/auth/signin').send(mReq);
      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If password is incorrect, should return an error with status code 401', async () => {
      const mReq = {
        email: 'cba@mail.com',
        password: 'xyz',
      };

      const expectedResponse = {
        success: false,
        error: 'Invalid email or password!',
      };

      const res = await request(app).post('/api/auth/signin').send(mReq);
      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If user credentials are valid, put token into cookie and return with status code 200', async () => {
      const mReq = {
        email: 'cba@mail.com',
        password: '123456',
      };

      const expectedResponse = {
        firstName: 'Cengiz',
        lastName: 'Aksakal',
        email: 'cba@mail.com',
        schoolName: 'Anadolu University',
      };

      const res = await request(app).post('/api/auth/signin').send(mReq);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('token');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
    });
  });
});
