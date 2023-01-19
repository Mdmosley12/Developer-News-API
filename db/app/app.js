const express = require('express');
const app = express();
const { getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle } = require('../controllor/controller');

app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles?:sort_by=column', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticle);

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
    } else {
        next(err);
    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Server Error!');
    next(err);
});

module.exports = app;