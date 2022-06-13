const express = require ('express');
const path = require ('path');
const mongoose = require('mongoose');

const userRoute = require('./routes/user');




const { PORT = 3000 } = process.env;
const app = express();


// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.static(path.resolve(__dirname, 'build')))

// app.get('/signin', (req, res) => {
//   res.send('Hello')

// })

// вариант из вебинара с путем роута, обратить внимание на то как роут прописан в users
//app.use('/users', usersRouter);
app.use(userRoute);

app.listen (PORT, () => {
    console.log('App started and listen port', PORT)
})