const express = require('express');
const app = express();
const { getTopics, getArticleById, getArticles } = require('../controllor/controller');

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Invalid input!'});
});

app.use((err, request, response, next) => {
    if(err.code === '22P02') {
        response.status(400).send({msg: 'Invalid article request!'});
    }
    if(err.status === 404) {
        response.status(404).send({msg: 'Requested article not found!'})
    }
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
})

module.exports = app;