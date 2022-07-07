const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexUrl } = require('../constants/regex');

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

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
    // avatar: Joi.string()
    // .regex(/^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/),
      avatar: Joi.string().regex(regexUrl),
    }),
  }),
  updateAvatar,
);

router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
