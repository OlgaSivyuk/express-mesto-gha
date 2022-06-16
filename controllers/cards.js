// const Card = require('../models/card');

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id);

//   const { name, link } = req.body;

//   Card.create({ name, link, owner: { _id: req.user._id } })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => res.status(500)
//       .send({ message: err.message }));
// };
