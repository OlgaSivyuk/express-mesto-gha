const Card = require('../models/card');

const {
  OK_CODE,
  // BAD_REQ_ERROR_CODE,
  // NOT_FOUND_ERROR_CODE,
  // DEFAULT_ERROR_CODE,
} = require('../constants/errorsCode');

const BadReqError = require('../errors/bad-req-error'); // 400
const ForbiddenError = require('../errors/forbiden-error'); // 403
const NotFoundError = require('../errors/not-found-error'); // 404
// const ConflictError = require('../errors/conflict-error'); // 409

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для создания пользователя.'));
        // return res.status(BAD_REQ_ERROR_CODE)
        // .send({ message: 'Переданы некорректные данные для создания карточки' });
      }
      next(err);
      // return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send({ data: cards }))
    .catch(next);
  // .catch(() => {
  //   res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
  // });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError("Недостаточно прав для удаления карточки.");
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      res.status(OK_CODE)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка с таким id не найдена.'));
        // return res.status(NOT_FOUND_ERROR_CODE)
        // .send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления карточки.'));
        // return res.status(BAD_REQ_ERROR_CODE)
        // .send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      next(err);
      // return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        next(new NotFoundError('Карточка с таким id не найдена.'));
        // return res.status(NOT_FOUND_ERROR_CODE)
        // .send({ message: 'Карточка с таким id не найдена' });
      } res.status(OK_CODE).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки лайка карточки.'));
        // return res.status(BAD_REQ_ERROR_CODE)
        // .send({ message: 'Переданы некорректные данные для постановки лайка карточки' });
      }
      next(err);
      // return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (like === null) {
        next(new NotFoundError('Карточка с таким id не найдена.'));
        // return res.status(NOT_FOUND_ERROR_CODE)
        // .send({ message: 'Карточка с таким id не найдена' });
      } res.status(OK_CODE).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки лайка карточки.'));
        // return res.status(BAD_REQ_ERROR_CODE)
        // .send({ message: 'Переданы некорректные данные для удаления лайка с карточки' });
      }
      next(err);
      // return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};
