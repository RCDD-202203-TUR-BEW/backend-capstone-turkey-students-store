// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const path = require('path');
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

const mSoldProduct = {
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
  status: 'Sold',
  condition: 'Used',
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
    // test('If all required fields are passed, create product, return with status code 201', async () => {
    //   const res = await server
    //     .post('/api/products/')
    //     .field('title', mProduct.title)
    //     .field('description', mProduct.description)
    //     .field('price', mProduct.price)
    //     .field('category', mProduct.category)
    //     .field('type', mProduct.type)
    //     .field('location[lat]', mProduct.location.lat)
    //     .field('location[lng]', mProduct.location.lng)
    //     .attach('coverImage', path.join(__dirname, './uploads/image1.jpg'))
    //     .set('Content-Type', 'multipart/form-data');
    //   // copy mProduct and delete cover image
    //   const expectedResponse = JSON.parse(JSON.stringify(mProduct));
    //   delete expectedResponse.coverImage;

    //   expect(res.status).toBe(201);
    //   expect(res.headers['content-type']).toMatch('application/json');
    //   expect(res.body.success).toBe(true);
    //   expect(res.body.data).toEqual(expect.objectContaining(expectedResponse));
    //   expect(res.body.data.coverImage).toBeDefined();
    // });
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
    /* test('If product with passed id exists, return the product with status code 200', async () => {
      // first create a product
      const product = await Product.create(mProduct);
      const id = product._id;
      // find product by id
      const res = await request(app).get(`/api/products/${id}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(expect.objectContaining(mProduct));
    }); */
  });

  describe('POST /:id/request', () => {
    let user;
    beforeEach(async () => {
      const mUser = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      user = await server.post('/api/auth/signup').send(mUser);
    });

    test('If product is sold out, return error with status code 410', async () => {
      const product = await Product.create(mSoldProduct);
      const productId = product._id;
      const res = await server.post(`/api/products/${productId}/request`);
      expect(res.status).toBe(410);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Product has been sold out!');
    });
    test('If product with passed id does not exist, return error with status code 404', async () => {
      const productId = new mongoose.Types.ObjectId();
      const res = await server.post(`/api/products/${productId}/request`);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.data.message).toBe('Product not found!');
    });
    test('Should create a new request to buy product and return with status code 200', async () => {
      const mUser = {
        firstName: 'Peter',
        lastName: 'Griffin',
        email: 'peter@email.com',
        schoolName: 'Princeton University',
        password: 'petE123',
      };
      const product = await Product.create(mProduct);
      const sellerUser = await User.create(mUser);
      product.seller = sellerUser._id;
      await product.save();
      const productId = product._id;
      const res = await server
        .post(`/api/products/${productId}/request`)
        .send();
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(
        'Your request to the product has been made'
      );
    });
    test('if the seller and the buyer same person, return error with status code 400', async () => {
      const product = await Product.create(mProduct);
      product.seller = user.body.data._id;
      await product.save();
      const productId = product._id;
      const res = await server.post(`/api/products/${productId}/request`);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('You can not request your own product!');
    });
  });
});
