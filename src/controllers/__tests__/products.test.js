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
  location: 'Artvin',
};

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
  await clearDatabase();
});

describe('Products routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /', () => {
    beforeEach(async () => {
      // create user for authentication
      const user = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      await server.post('/api/auth/signup').send(user);
    });

    test('If one of the required fields are not passed, return error with status code 400', async () => {
      // pass a request body without required field 'title'
      const mProductWithoutTitle = JSON.parse(JSON.stringify(mProduct));
      delete mProductWithoutTitle.title;
      // send post request
      const res = await server
        .post('/api/products/')
        .send(mProductWithoutTitle);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].msg).toBe('Product name cannot be empty!');
    });

    test('If all required fields are passed, create product, return with status code 201', async () => {
      const res = await server.post('/api/products/').send(mProduct);
      expect(res.status).toBe(201);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mProduct));
    });
  });
  describe('GET /:id/requested-buyers', () => {
    let product;
    beforeEach(async () => {
      // create user for authentication
      const user = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennaaaQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      const mUser = await server.post('/api/auth/signup').send(user);
      // create product fullfilled with seller and requested buyers as this user
      // mProduct.seller = user._id;
      mProduct.requestedBuyers = [mUser.body.data._id];
      product = await server.post('/api/products/').send(mProduct);
    });
    test('If product with given id is not found, return error with status code 404', async () => {
      const res = await server.get(
        '/api/products/62ff96671c828963807a2041/requested-buyers'
      );
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(
        'Product with id 62ff96671c828963807a2041 not found!'
      );
    });
    test('If product with given id is found, verifyUser and verifyOwner is passed, return with status code 200 with populated requested buyers', async () => {
      const mRequestedBuyers = [
        {
          _id: mProduct.requestedBuyers[0],
          firstName: 'Glenn',
          lastName: 'Quagmire',
          email: 'glennaaaQQQ@email.com',
          fullName: 'Glenn Quagmire',
        },
      ];
      const id = product.body.data._id;
      const res = await server.get(`/api/products/${id}/requested-buyers`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(mRequestedBuyers[0]);
    });
  });
});
