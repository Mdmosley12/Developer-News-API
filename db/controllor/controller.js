const { selectAllTopics, selectAllArticles, selectArticleById, selectCommentsByArticleId, addComment, selectAllUsers } = require('../models/model');

const getTopics = (request, response, next) => {
    selectAllTopics()
    .then((topics) => {
        response.status(200).send( topics );
    })
    .catch((err) => {
        next(err);
    })
};

const getArticles = (request, response, next) => {
    selectAllArticles()
    .then((articles) => {
        response.status(200).send( {articles} );
    })
    .catch((err) => {
        next(err);
    })
};

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleById(article_id)
    .then((article) => {
        response.status(200).send( {article} );
    })
    .catch((err) => {
        next(err);
    })
};

const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send( {comments} );
    })
    .catch((err) => {
        next(err);
    })
};

const postComment = (request, response, next) => {
    const { article_id } = request.params;
    const { body } = request;
    addComment(article_id, body)
    .then((comment) => {
        response.status(201).send({ comment })
    })
    .catch((err) => {
        next(err);
    })
};

const getUsers = (request, response, next) => {
    selectAllUsers()
    .then((users) => {
        response.status(200).send( users );
    })
    .catch((err) => {
        next(err);
    })
}


module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, getUsers };