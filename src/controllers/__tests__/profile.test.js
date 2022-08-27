// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const path = require('path');
const app = require('../../app');

const server = request.agent(app);

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

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

describe('User - Profile routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /products', () => {
    test('If user is unauthenticated, return error with status code 401', async () => {
      const res = await server.get('/api/profile/products/').send(mProduct);
      expect(res.status).toBe(401);
    });

    test("If user is authenticated, return user's products with status code 200", async () => {
      const expectedResponse = JSON.parse(JSON.stringify(mProduct));
      delete expectedResponse.coverImage;
      // authenticate
      await server.post('/api/auth/signup').send(user);
      // then create a product
      await server
        .post('/api/products/')
        .field('title', mProduct.title)
        .field('description', mProduct.description)
        .field('price', mProduct.price)
        .field('category', mProduct.category)
        .field('type', mProduct.type)
        .field('location.lat', mProduct.location.lat)
        .field('location.lng', mProduct.location.lng)
        .attach('coverImage', path.join(__dirname, './uploads/image1.jpg'))
        .set('Content-Type', 'multipart/form-data');
      const res = await server.get('/api/profile/products/').send(mProduct);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(
        expect.objectContaining(expectedResponse)
      );
    });
  });

  describe('GET /', () => {
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

  describe('PATCH /', () => {
    const myUser = {
      firstName: 'Melek',
      lastName: 'Arslan',
      email: 'melek@mail.com',
      schoolName: 'Bilkent University',
      password: 'Ma123',
    };
    beforeEach(async () => {
      await server.post('/api/auth/signup').send(myUser);
    });

    test('If user email exists, should return an error with status code 400', async () => {
      const expectedResponse = {
        success: false,
        error: 'Email already exists!',
      };
      const anotherUser = {
        firstName: 'Mike',
        lastName: 'Arslran',
        email: 'melek@mail.com',
        schoolName: 'Başkent University',
      };
      const res = await server.patch('/api/profile/').send(anotherUser);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    test('If old password is not correct , should return an error with status code 401', async () => {
      const expectedResponse = {
        success: false,
        error: 'Your old password is not correct please enter again!',
      };
      const someUser = {
        firstName: 'Mikey',
        oldPassword: 'Ma123445',
        password: 'Ma123w',
      };
      const res = await server.patch('/api/profile/').send(someUser);
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
