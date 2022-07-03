const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  getUserByCookie,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.patch('/me', updateProfile);
router.get('/me', getUserByCookie);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);
router.get('/:userId', getUserById);
// router.get('/me',);
// router.post('/', createUser);

module.exports = router;
