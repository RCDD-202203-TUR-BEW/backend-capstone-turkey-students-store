/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const { clearDatabase } = require('../../db/connection');
const Product = require('../../models/product');
const User = require('../../models/user');
const app = require('../../app');

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
  password: 'testpassword',
  phoneNumber: 123456789,
  address: 'Test address',
};

let productId;
let userId;

beforeEach(async () => {
  // Product.deleteMany();
  // User.deleteMany();
  // userId = await User.create(mockUser);
  // mockProduct.seller = userId;
  // productId = await Product.create(mockProduct);
  await clearDatabase();
});

// afterAll(async () => {
//   await Product.deleteMany();
//   await User.deleteMany();
//   await mongoose.connection.close();
// });

describe('delete product', () => {
  it('DELETE /api/products/:id Should delete one product with provided ID', async () => {
    const expectedResponse = {
      success: true,
      data: 'Product deleted successfully.',
    };
    const res = await request(app).delete(`/api/products/${productId._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedResponse);
  });
  it('DELETE /api/products/:id - 404', async () => {
    const expectedResponse = {
      success: false,
      error: 'Product not found',
    };
    const res = await request(app).delete(
      '/api/products/5e9f8f8f8f8f8f8f8f8f8f8'
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual(expectedResponse);
  });
});
