const express = require('express');
const app = express();
const { getTopics } = require('../controllor/controller');

app.get('/api/topics', getTopics);

app.use((err, request, response, next) => {
    if(err.status === 404) {
        response.status(404).send('Invalid input')
    }
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
})

module.exports = app;