const Card = require('../models/card');

// const OK_CODE = 200;
// const BAD_REQ_ERROR_CODE = 400;
// const NOT_FOUND_ERROR_CODE = 404;
// const DEFAULT_ERROR_CODE = 500;

const {
  OK_CODE,
  BAD_REQ_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../constants/errorsCode');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE)
      .send({ data: card }))
    .catch((err) => {
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
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.status(OK_CODE)
        .send({ data: card });
    })
    .catch((err) => {
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
    { $addToSet: { likes: req.user._id } },
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
        return res.status(BAD_REQ_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
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
