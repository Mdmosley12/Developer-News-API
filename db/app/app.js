const express = require('express');
const app = express();
const { getTopics, getArticles } = require('../controllor/controller');

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Invalid input!'});
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
})

module.exports = app;