const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');

// const { createUser, login } = require('./controllers/users');

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
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/),
  }),
}), require('./routes/users'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), require('./routes/users'));

app.use(cookieParser());
app.use(auth);

// пути роутинга
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// app.post('/signin', login);
// app.post('/signup', createUser);

// обработка несуществующего роута
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);

  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).send({ message: 'Ошибка на сервере' });
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
