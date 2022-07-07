const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { regexUrl } = require('./constants/regex');

const NotFoundError = require('./errors/not-found-error'); // 404

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// просматриваем запросы со строками и другими типами данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// пути для логина и регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // avatar: Joi.string()
    // .pattern(/^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/),
    avatar: Joi.string().regex(regexUrl),
  }),
}), require('./routes/users'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), require('./routes/users'));

app.use(cookieParser());
app.use(auth);

// пути роутинга
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// обработка несуществующего роута
app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует.'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);

  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  console.error(err.stack);
  res.status(500).send({ message: 'Ошибка на сервере' });
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
