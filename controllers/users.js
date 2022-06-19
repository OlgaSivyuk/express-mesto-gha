const User = require('../models/user');

// возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  console.log('createUser', req.params);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  console.log('getUserById', req.params);
  User.findOne({ _id: req.params.userId })
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.updateProfile = (req, res) => {
  console.log('updateProfile', req.params);
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  console.log('updateAvatar', req.params);
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};
