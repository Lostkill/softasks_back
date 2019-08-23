// const envPath = process.env.NODE_ENV ? `.env.test` : '.env';

// const dotenv = require('dotenv');
// dotenv.config({ path: envPath });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

//mLab link mongodb://softruck:softruck123@ds259787.mlab.com:59787/todolist
//Image Docker 'mongodb://mongo:27017/todolist'
//'process.env.DATABASE_URL'
mongoose.connect('mongodb://softruck:softruck123@ds259787.mlab.com:59787/todolist', {
    useNewUrlParser: true,
    useFindAndModify: false
});

app.use(cors());
app.use((req, res, next) => {
    req.io = io
    return next()
});
app.use(express.json());
app.use(require('./routes'));

server.listen(process.env.PORT);

module.exports = app;