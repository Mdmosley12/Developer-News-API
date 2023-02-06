const express = require('express');
const app = express();
const apiRouter = require('../routes/api-router');
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use('/api', apiRouter);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Invalid input!'});
});

app.use((err, request, response, next) => {
    if(err.code === '23503') {
        response.status(404).send({msg: 'No username found!'})
    } else {
        next(err)
    }
});
app.use((err, request, response, next) => {
    if(err.code === '22P02') {
        response.status(400).send({msg: 'Invalid data type in request!'});
    } else {
        next(err);
    }
});

app.use((err, request, response, next) => {
    if(err.status === 404) {
        response.status(404).send({msg: 'Not Found!'});
    } else {
        next(err);
    }
});

app.use((err, request, response, next) => {
    if(err.status === 400) {
        response.status(400).send({msg: 'Bad Request!'})
    }
})

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
});

module.exports = app;