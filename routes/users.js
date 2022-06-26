const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
  // createUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);
// router.get('/me',)

module.exports = router;
