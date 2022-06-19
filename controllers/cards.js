const Card = require('../models/card');

const BAD_REQ_ERROR_CODE = 400;
// const NOT_FOUND_ERROR_CODE = 404;

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);

  const { name, link } = req.body;
  const owner = req.params.userId;
  console.log(`проверочка ${name} ${link} ${owner}`);
  console.log(req.params);
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: err.message });
      } return res.status(500).send({ message: err.message });
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      console.log(err);
      res.status(500)
        .send({ message: err.message });
    });
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
