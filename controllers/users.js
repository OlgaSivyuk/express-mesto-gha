const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const SECRET_KEY = 'very_secret';

const {
  OK_CODE,
  CREATED_CODE,
} = require('../constants/errorsCode');

const BadReqError = require('../errors/bad-req-error');
const AuthorizationError = require('../errors/authorization-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new BadReqError('Не передан email или пароль.');
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
      console.log(user);
      res.status(CREATED_CODE).send({ data: user, message: 'Пользователь создан.' }); // исключить передачу пароля, раскрыть data - name: user.name
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        throw new BadReqError('Переданы некорректные данные для создания пользователя.');
      }
      if (err.name === 'MongoServerError') {
        throw new ConflictError('Пользователь с таким email уже есть.');
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  // console.log({ _id: req.params.userId });
  User.findOne({ _id: req.params.userId })
    .then((users) => {
      if (users === null) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.status(OK_CODE)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadReqError('Переданы некорректные данные для запроса пользователя.');
      }
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  console.log(req.user);
  User.findOne({ _id: req.user._id })
    .then((users) => {
      if (users === null) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.status(OK_CODE)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadReqError('Переданы некорректные данные для запроса пользователя (куки).');
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.status(OK_CODE).send({ data: users });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь с таким id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new BadReqError('Переданы некорректные данные для обновления пользователя.');
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      res.status(OK_CODE).send({ data: users });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь с таким id не найден.');
      }
      if (err.name === 'ValidationError') {
        throw new BadReqError('Переданы некорректные данные для обновления пользователя.');
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('1 проверка auth_login');
  User.findOne({ email }).select('+password')
    .then((user) => {
      console.log(user, '2 проверка in first then');
      if (!user) {
        throw new AuthorizationError('Неправильные email или пароль (проверка юзера).');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            throw new AuthorizationError('Неправильные email или пароль (проверка хеша).');
          }
          console.log('3 здесь возвращаем токен');
          const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
          // res.send({ token });
          res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
          res.status(OK_CODE).send({ message: 'Всё верно!' });
        });
    })
    .catch((err) => {
      next(err);
    });
};
