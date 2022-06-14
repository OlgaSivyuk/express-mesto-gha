const router = require ('express').Router();
const User = require('../models/user')

// router.get('/', (req, res) => {
//   User.find({})
//     .then(users => {res.status(200).send(users)
//     })
// });

// router.get('/:id', (req, res) => {
//   User.findOne({_id: req.params.id})
//     .then(user => {res.status(200)
//     .send(user)
//     })
// });

// router.post('/', (req, res) => {
//   //console.log(req.body)
//   User.create(req.body)
//     .then(user => res.status(201)
//     .send(user)
//     .catch((err) => res.send('что-то пошло не так'))
//     )
// })

// содержание роутера
// const {
//   getUsers,
//   getUserById,
//   createUser,
// } = require('../controllers/users');

module.export = router;