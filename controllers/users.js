const User = require('../models/user');

const BAD_REQ_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для запроса пользователей' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  // console.log('createUser', req.params);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для создания пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.getUserById = (req, res) => {
  // console.log('getUserById', req.params);
  User.findOne({ _id: req.params.userId })
    .then((users) => {
      if (users === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(200)
        .send({ data: users });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для запроса пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateProfile = (req, res) => {
  // console.log('updateProfile', req.params);
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      if (users === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(200)
        .send({ data: users });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для обновления пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.updateAvatar = (req, res) => {
  // console.log('updateAvatar', req.params);
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => {
      if (users === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(200)
        .send({ data: users });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для обновления пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};
