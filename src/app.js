const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const { expressjwt: jwt } = require('express-jwt');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const connectToMongoAtlas = require('./db/connection');
const User = require('./models/user');
require('./middlewares/passport-auth');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

app.use(
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req) => req.signedCookies.token ?? req.cookies.token,
    requestProperty: 'user',
  }).unless({ path: ['/api/auth/google', '/api/auth/google/callback'] })
);

app.use('/api', routes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`listening on ${port}`);
  connectToMongoAtlas();
});
