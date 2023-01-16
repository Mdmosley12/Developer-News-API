const express = require('express');
const app = express();
const { getTopics } = require('../controllor/controller');

app.use(express.json());
app.get('/api/topics', getTopics);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
})

module.exports = app;