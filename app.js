// const path = require ('path');
const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const { PORT = 3000 } = process.env;
const app = express();

//просматриваем запросы со строками и другими типами данных
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

//пути роутинга
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen (PORT, () => {
    console.log('App started and listen port', PORT)
});


// app.use(express.static(path.resolve(__dirname, 'build')))

// app.get('/', (req, res) => {
//   res.send('Hello')

// })

// // вариант из вебинара с путем роута, обратить внимание на то как роут прописан в users
// const userRoute = require('./routes/users');
//app.use('/users', usersRouter);
//app.use(userRoute);
