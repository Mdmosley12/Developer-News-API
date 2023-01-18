const express = require('express');
const app = express();
const { getTopics, getArticles, postComment } = require('../controllor/controller');

app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.post('/api/articles/:article_id/comments', postComment);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Invalid input!'});
});

app.use((err, request, response, next) => {
    if(err.code === '23503') {
        response.status(404).send({msg: 'No username found!'})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
})

module.exports = app;