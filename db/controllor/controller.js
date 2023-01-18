const { selectAllTopics, selectAllArticles, selectArticleById, updateArticle } = require('../models/model');

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
}

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

const patchArticle = (request, response, next) => {
    const { article_id } = request.params;
    updateArticle(article_id, request.body)
    .then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = { getTopics, getArticles, getArticleById, patchArticle };