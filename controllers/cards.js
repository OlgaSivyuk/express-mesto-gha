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
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};
