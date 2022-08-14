// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/product');

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

let myproduct1;
let myproduct2;
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
      const createdUser = await server.post('/api/auth/signup').send(user);
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
        seller: createdUser.body.data._id,
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
        seller: createdUser.body.data._id,
      };
      myproduct1 = await Product.create(product1);
      myproduct2 = await Product.create(product2);
    });

    test('Update given field, return with 200 status code', async () => {
      const toUpdate = {
        title: 'potato',
        description: 'Matehs',
        price: 120,
        category: 'Book',
        coverImage: 'www.book.jpg',
        type: 'Product',
        location: 'Istanbul',
        condition: 'Used',
      };

      const res = await server
        .patch(`/api/products/${myproduct1._id}`)
        .send(toUpdate);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('potato');
      expect(res.body.data.description).toBe('Matehs');
      expect(res.body.data.price).toBe(120);
      expect(res.body.data.category).toBe('Book');
      expect(res.body.data.coverImage).toBe('www.book.jpg');
      expect(res.body.data.type).toBe('Product');
      expect(res.body.data.location).toBe('Istanbul');
      expect(res.body.data.condition).toBe('Used');
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
