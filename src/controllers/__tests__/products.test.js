// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/product');
const User = require('../../models/user');

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

  describe('delete product', () => {
    const mockProduct = {
      title: 'Test product',
      description: 'Test description',
      price: 100,
      category: 'Test category',
      coverImage: 'Test cover image',
      images: ['Test image 1', 'Test image 2', 'Test image 3'],
      type: 'Product',
      location: 'Test location',
      status: 'Active',
      condition: 'New',
    };

    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@test.com',
      schoolName: 'Test school',
      password: 'P@ssw0rd',
      phoneNumber: 123456789,
      address: 'Test address',
    };

    let productId;

    beforeEach(async () => {
      await Product.deleteMany();
      await User.deleteMany();
      // user = await User.create(mockUser);
      const mUser = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      const user = await server.post('/api/auth/signup').send(mUser);
      mockProduct.seller = user._id;
      productId = await Product.create(mockProduct);
      // await clearDatabase();
    });

    // afterAll(async () => {
    //   await Product.deleteMany();
    //   await User.deleteMany();
    //   await mongoose.connection.close();
    // });

    it('DELETE /api/products/:id Should delete one product with provided ID', async () => {
      const expectedResponse = {
        success: true,
        data: 'Product deleted successfully.',
      };
      const res = await server.delete(`/api/products/${productId._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedResponse);
    });
    it('DELETE /api/products/:id - 404', async () => {
      const expectedResponse = {
        success: false,
        error: 'Product not found',
      };
      const res = await server.delete('/api/products/5e9f8f8f8f8f8f8f8f8f8f8');
      expect(res.status).toBe(404);
      expect(res.body).toEqual(expectedResponse);
    });
  });
});
