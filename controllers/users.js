const User = require('../models/user');

// возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  console.log(req.params);
  User.findOne({ _id: req.params.userId })
    .then((users) => res.status(200)
      .send({ data: users }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};
