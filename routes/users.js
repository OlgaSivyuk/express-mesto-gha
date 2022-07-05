const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  createUser,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);

router.patch(
  '/me',
  celebrate({
    params: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    params: Joi.object().keys({
      avatar: Joi.string().regex(/^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/),
    }),
  }),
  updateAvatar,
);

router.post('/signin', login);
router.post('/signup', createUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById,
);

module.exports = router;
