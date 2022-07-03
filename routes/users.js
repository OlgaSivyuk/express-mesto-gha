const router = require('express').Router();
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
router.patch('/me', updateProfile);
router.get('/me', getUserMe);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);
router.get('/:userId', getUserById);

module.exports = router;
