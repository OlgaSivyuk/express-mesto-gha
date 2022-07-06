const Card = require('../models/card');

const {
  OK_CODE,
} = require('../constants/errorsCode');

const BadReqError = require('../errors/bad-req-error'); // 400
const ForbiddenError = require('../errors/forbiden-error'); // 403
const NotFoundError = require('../errors/not-found-error'); // 404

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(OK_CODE)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные для создания пользователя.'));
        return;
      }
      next(err);
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с таким id не найдена.');
    })
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        throw new ForbiddenError("Недостаточно прав для удаления карточки.");
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      res.status(OK_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с таким id не найдена.');
    })
    .then((like) => {
      res.status(OK_CODE).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки лайка карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с таким id не найдена.');
    })
    .then((like) => {
      res.status(OK_CODE).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки лайка карточки.'));
        return;
      }
      next(err);
    });
};
