const User = require('../models/user');

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
  return User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => {
      console.log(user);
      res.status(201).send({ data: user, message: 'пользователь создан' });
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

module.exports.login = (req) => {
  // const { email, password } = req.body;
  console.log(req, 'auth_login');
};

// module.exports.createUser = (req, res) => {
//   res.send({ message: 'register_createUser' }),
// };
