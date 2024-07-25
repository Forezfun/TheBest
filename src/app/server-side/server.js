const EXPRESS = require('express');
const mongoose = require('mongoose');
const BODYPARSER = require('body-parser');
const CORS = require('cors');
const CONNECT_DB = require('./config/db');
const PUBLICATION_ROUTES = require('./routes/publicationRoutes');
const USER_ROUTES = require('./routes/userRoutes');

const APP_PORT = 5000;
const USER_ROUTE = '/user';
const PUBLICATION_ROUTE = '/publication';

const APP = EXPRESS();
APP.use(BODYPARSER.json({ limit: '50mb' }));
APP.use(BODYPARSER.urlencoded({ limit: '50mb', extended: true }));
// Подключение к базе данных
CONNECT_DB(); 

// Мидлвары
APP.use(CORS());
APP.use(BODYPARSER.json());
APP.use(BODYPARSER.urlencoded({ extended: true }));

// Маршруты
APP.use(PUBLICATION_ROUTE, PUBLICATION_ROUTES);
APP.use(USER_ROUTE, USER_ROUTES);

// Запуск сервера
APP.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
APP.get('/error', (req, res) => {
  throw new Error('This is a forced error.');
});

// Middleware для обработки ошибок
APP.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
