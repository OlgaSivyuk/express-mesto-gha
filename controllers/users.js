const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const { generateTocken } = require('../middlewares/auth');

const SALT_ROUNDS = 10;
const SECRET_KEY = 'very_secret';
// const OK_CODE = 200;
// const BAD_REQ_ERROR_CODE = 400;
// const NOT_FOUND_ERROR_CODE = 404;
// const DEFAULT_ERROR_CODE = 500;
// const MONGO_DUPLICATE_ERROR_CODE = 11000;

const {
  OK_CODE,
  BAD_REQ_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../constants/errorsCode');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'не передан email или пароль' });
  }

  return bcrypt.hash(password, SALT_ROUNDS) // хешируем пароль
    .then((hash) => {
      console.log(hash);
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      // console.log(user);
      res.status(201).send({ data: user, message: 'пользователь создан' }); // исключить передачу пароля, раскрыть data - name: user.name
      // res.send({ message: 'пользователь создан' });
    })
    .catch((err) => {
      console.log(err);
      // return res.status(409).send({ message: 'email занят' });
      // return res.status(500).send({ message: 'что-то пошло не так' });
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для создания пользователя' });
      }
      if (err.name === 'MongoServerError') {
        return res.status(409).send({ message: 'email занят' }); // не срабатывает unique
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });

  // User.findOne({ email }) // способ №1 провалидировать данные нового юзера поискать по имейлу
  //   .then((user) => {
  //     if (user) {
  //       return res.status(409).send({ message: 'email занят' });
  //     }
  //   });
};

module.exports.getUserById = (req, res) => {
  console.log({ _id: req.params.userId });
  User.findOne({ _id: req.params.userId })
    .then((users) => {
      if (users === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(OK_CODE)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для запроса пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.status(OK_CODE)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для обновления пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.status(OK_CODE)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для обновления пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log('1 проверка auth_login');

  // if (!email || !password) {
  //   return res.status(400).send({ message: 'Не передан email или пароль' });
  // }
  User.findOne({ email }).select('+password')
    .then((user) => {
      console.log(user, '2 проверка in first then');
      if (!user) {
        const err = new Error('Неправильные email или пароль (проверка юзера)');
        err.statusCode = 403;
        throw err;
        // return res.status(403).send({
        // message: 'Неправильные email или пароль (проверка юзера)' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            const err = new Error('Неправильные email или пароль (проверка хеша)');
            err.statusCode = 403;
            throw err;
            // return res.status(403).send({
            // message: 'Неправильные email или пароль (проверка хеша)' });
          }
          console.log('3 здесь возвращаем токен');
          const token = jwt.sign({ email: user.email, _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
          res.send({ token });
          res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
            .end();
        });
    })

    // .then((token) => {
    //   console.log(token);
    //   // return res.status(OK_CODE).send({ message: 'Всё верно!' });
    // })
    .catch((err) => {
      // if (err.statusCode === 403) {
      //   return res.status(403).send({ message: err.message });
      // }
      // return res.status(401).send({ message: err.message });
      res.status(401).send({ message: err.message });
    });
};
