const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);

  const { name, link } = req.body;
  const { owner } = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  console.log(req.params);
  // const { cardId } = req.params;
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.userId } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};
