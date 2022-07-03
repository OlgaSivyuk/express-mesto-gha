const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
// const celebrate = require('celebrate');
const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// просматриваем запросы со строками и другими типами данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62ac4882d3769638e9561618',
//   };

//   next();
// });

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // avatar: Joi.string().regex(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(cookieParser());
app.use(auth);

// пути роутинга
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// пути для логина и регистрации
// app.post('/signin', login);
// app.post('/signup', createUser);
// или
// app.post('/signin', require('./routes/users'));
app.post('/signup', require('./routes/users'));

// обработка несуществующего роута
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);

  if (err.statusCode === 401) {
    res.status(401).send({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).send({ message: 'что-то не так' });
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});

// {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//     name: Joi.string().required().min(2).max(30),
//     age: Joi.number().integer().required().min(18),
//     about: Joi.string().min(2).max(30),
//   })
// }
