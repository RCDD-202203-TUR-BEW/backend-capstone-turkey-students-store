// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');

const server = request.agent(app);
const Product = require('../../models/product');

const {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
} = require('../../db/connection');

afterAll(async () => {
  await closeDatabase();
});

beforeAll(async () => {
  await connectToMongoAtlas();
  await clearDatabase();
});

let myproduct1;
let myproduct2;

describe('Products routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  describe('PATCH /:id', () => {
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
      // create product
      const product1 = {
        title: 'Javascript Book',
        description: 'Book to learn english',
        price: '80',
        category: 'Book',
        coverImage: 'www.book.jpg',
        type: 'Product',
        location: 'Ankara',
        condition: 'Used',
      };
      const product2 = {
        title: 'Javascript Book2',
        description: 'Book to learn english2',
        price: '80',
        category: 'Book',
        coverImage: 'www.book.jpg',
        type: 'Product',
        location: 'Ankara',
        condition: 'Used',
      };
      myproduct1 = await Product.create(product1);
      myproduct2 = await Product.create(product2);
    });

    test('Update given field, return with 200 status code', async () => {
      const toUpdate = { title: 'Potato' };
      const res = await server
        // eslint-disable-next-line no-undef
        .patch(`/api/products/${myproduct1._id}`)
        .send(toUpdate);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Potato');
    });

    test('If title with lenght more than 150 is passed, return error with status code 400', async () => {
      const toUpdate2 = {
        title: `JavascriptsdfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJavascript
          dfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJavascriptsdfghjhgfdsasd
          fghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJavascript sdfghjhgfdsasdfghjkjhgfdsdf
          ghjhgfdsdfghjhgfdsdfgssJavascriptsdfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghj
          hgfdsdfgssJavascript sdfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJava
          scriptsdfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJavascript sdfghjhgf
          dsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgssJavascriptsdfghjhgfdsasdfghjkjhgfdsdf
          ghjhgfdsdfghjhgfdsdfgssJavascript sdfghjhgfdsasdfghjkjhgfdsdfghjhgfdsdfghjhgfdsdfgss`,
      };

      const res = await server
        // eslint-disable-next-line no-undef
        .patch(`/api/products/${myproduct2._id}`)
        .send(toUpdate2);
      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.errors[0].msg).toBe(
        'Length should be between 1-150 characters!'
      );
    });
  });
});
