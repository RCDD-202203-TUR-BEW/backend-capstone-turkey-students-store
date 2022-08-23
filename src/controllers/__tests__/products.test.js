// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const mongoose = require('mongoose');
const { application } = require('express');
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
  location: {
    lat: 22.355,
    lng: 38.399,
  },
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

  describe('GET /', () => {
    test('Fetch all products, return with 200 status code', async () => {
      // first create a product
      await Product.create(mProduct);
      // now get all products
      const res = await request(app).get('/api/products/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(expect.objectContaining(mProduct));
    });
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

    /* TODO: fix this test */
    /* test('If all required fields are passed, create product, return with status code 201', async () => {
      const res = await server
        .post('/api/products/')
        .field('title', mProduct.title)
        .field('description', mProduct.description)
        .field('price', mProduct.price)
        .field('category', mProduct.category)
        .field('type', mProduct.type)
        .field('location', mProduct.location)
        .attach('coverImage', path.join(__dirname, './uploads/image1.jpg'))
        .set('Content-Type', 'multipart/form-data');
      // copy mProduct and delete cover image
      const expectedResponse = JSON.parse(JSON.stringify(mProduct));
      delete expectedResponse.coverImage;

      expect(res.status).toBe(201);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
      expect(res.body.data.coverImage).toBeDefined();
    }); */
  });

  describe('GET /:id', () => {
    test('If product with passed id does not exist, return error with status code 404', async () => {
      const expectedResponse = {
        success: false,
        error: 'Product not found!',
      };
      // first create a product
      await request(app).post('/api/products/').send(mProduct);
      // create a mock mongoose id
      let mId = new mongoose.Types.ObjectId();
      mId = mId.toString();
      // find product by mock id
      const res = await request(app).get(`/api/products/${mId}`);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body).toEqual(expect.objectContaining(expectedResponse));
    });

    /* TODO: fix this test */
    /*
    test('If product with passed id exists, return the product with status code 200', async () => {
      // first create a product
      const product = await Product.create(mProduct);
      const id = product._id;
      // find product by id
      const res = await request(app).get(`/api/products/${id}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mProduct));
    });
*/
  });

  describe('delete product', () => {
    let product;

    // beforeEach(async () => {
    //   await Product.deleteMany();
    //   await User.deleteMany();
    //   // user = await User.create(mockUser);
    //   const mUser = {
    //     firstName: 'Glenn',
    //     lastName: 'Quagmire',
    //     email: 'glennQQQ@email.com',
    //     schoolName: 'Yale University',
    //     password: 'gleN123',
    //   };
    //   const user = await server.post('/api/auth/signup').send(mUser);
    //   mProduct.seller = user._id;
    //   productId = await Product.create(mProduct);
    //   // await clearDatabase();
    // });

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
      mProduct.seller = mUser.body.data._id;
      product = await Product.create(mProduct);
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
      const res = await server.delete(`/api/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedResponse);
    });
    it('DELETE /api/products/:id - 404', async () => {
      const expectedResponse = {
        success: false,
        error: 'Product with id 62ff96671c828963807a2041 not found!',
      };
      // 5e9f8f8f8f8f8f8f8f8f8f8 returns 500 error
      const res = await server.delete('/api/products/62ff96671c828963807a2041');
      expect(res.status).toBe(404);
      expect(res.body).toEqual(expectedResponse);
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
      const user1 = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennmmmQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      // create requested buyer
      const mRequestedBuyer = await server.post('/api/auth/signup').send(user);
      // create seller
      const mUser = await server.post('/api/auth/signup').send(user1);
      // create product fullfilled with seller and requested buyers
      mProduct.requestedBuyers = [mRequestedBuyer.body.data._id];
      mProduct.seller = mUser.body.data._id;
      product = await Product.create(mProduct);
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
      const id = product._id.toString();
      const res = await server.get(`/api/products/${id}/requested-buyers`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toEqual(mRequestedBuyers[0]);
    });
  });
});
