// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
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
    lat: 33.455,
    lng: 48.957,
  },
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

  describe('GET /products', () => {
    test('If user is unauthenticated, return error with status code 401', async () => {
      const res = await server.get('/api/profile/products/').send(mProduct);
      expect(res.status).toBe(401);
    });

    /*  TODO: fix this tests */
    /* test("If user is authenticated, return user's products with status code 200", async () => {
      // create user for authentication
      const user = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      // authenticate
      await server.post('/api/auth/signup').send(user);

      // then create a product
      await server.post('/api/products/').send(mProduct);

      const res = await server.get('/api/profile/products/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(expect.objectContaining(mProduct));
    }); */
  });
});
