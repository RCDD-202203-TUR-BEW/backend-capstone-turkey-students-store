// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');
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
    test('If all required fields are passed, create product, return with status code 201', async () => {
      const res = await server
        .post('/api/products/')
        .field('title', mProduct.title)
        .field('description', mProduct.description)
        .field('price', mProduct.price)
        .field('category', mProduct.category)
        .field('type', mProduct.type)
        .field('location[lat]', mProduct.location.lat)
        .field('location[lng]', mProduct.location.lng)
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
    });
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
      const res = await server.delete('/api/products/62ff96671c828963807a2041');
      expect(res.status).toBe(404);
      expect(res.body).toEqual(expectedResponse);
    });
  });

  describe('POST/:id/requested-buyers/:userId/sell', () => {
    let product;
    let mUser;

    beforeEach(async () => {
      // create user for authentication
      const user = {
        firstName: 'Glenn',
        lastName: 'Quagmire',
        email: 'glennQQQ@email.com',
        schoolName: 'Yale University',
        password: 'gleN123',
      };
      mUser = await server.post('/api/auth/signup').send(user);
      const copyOfProduct = JSON.parse(JSON.stringify(mProduct));
      product = await Product.create(copyOfProduct);
      product.seller = mUser.body.data._id;
    });

    test('If user with passed user id does not exist, return error with status code 401', async () => {
      const mockId = new mongoose.Types.ObjectId();
      const res = await server.post(
        `/api/products/${product._id}/requested-buyers/${mockId}/sell`
      );
      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Access denied!');
    });

    test('If product with passed id does not exist, return error with status code 422', async () => {
      const mockId = new mongoose.Types.ObjectId();
      const res = await server.post(
        `/api/products/${mockId}/requested-buyers/${mUser.body.data._id}/sell`
      );
      expect(res.status).toBe(422);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Product not found!');
    });

    test('If product with passed id is sold, return error with status code 400', async () => {
      product.status = 'Sold';
      await product.save();
      const res = await server.post(
        `/api/products/${product._id}/requested-buyers/${mUser.body.data._id}/sell`
      );
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Product already sold!');
    });

    test('If buyer is not in requested users, return error with status code 404', async () => {
      const buyer = await User.create({
        firstName: 'Peter',
        lastName: 'Griffin',
        email: 'peter@email.com',
        schoolName: 'Yale University',
        password: 'petE123',
      });
      const res = await server.post(
        `/api/products/${product._id}/requested-buyers/${buyer._id}/sell`
      );
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not eligible to buy this product!');
    });

    test('If product and buyer are valid, sell product to this user and return status code 200', async () => {
      const buyer = await User.create({
        firstName: 'Peter',
        lastName: 'Griffin',
        email: 'peter@email.com',
        schoolName: 'Yale University',
        password: 'petE123',
      });
      // add buyer to requested buyers array
      product.requestedBuyers.push(buyer._id);
      await product.save();

      const res = await server.post(
        `/api/products/${product._id}/requested-buyers/${buyer._id}/sell`
      );
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Your product was successfully sold');
    });
  });
});
