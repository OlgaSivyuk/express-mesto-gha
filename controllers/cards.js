const Card = require('../models/card');

const OK_CODE = 200;
const BAD_REQ_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // const owner = req.params.userId;
  const owner = req.user._id;
  console.log(`проверочка ${name} ${link} ${owner}`);
  // console.log(req.params);
  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE)
      .send({ data: card }))
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для создания карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE)
      .send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для запроса карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  console.log(req.params);
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.status(OK_CODE)
        .send({ data: card });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с таким id не найдена' });
      } return res.status(OK_CODE)
        .send(like);
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с таким id не найдена' });
      } return res.status(OK_CODE)
        .send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для удаления лайка с карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

// module.exports.dislikeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user.userId } }, // убрать _id из массива
//     { new: true },
//   )
//     .then((like) => res.send(like))
//     .catch((err) => res.status(404)
//       .send({ message: err.message }));
// };
// deleteCard
// if (card === null) {
//   return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с таким id не найдена' });
// } return res.status(200)
//   .send({ data: card });
