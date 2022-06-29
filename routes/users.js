const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);
// router.get('/me',);
// router.post('/', createUser);

module.exports = router;
