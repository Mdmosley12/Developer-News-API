const { selectAllTopics, selectArticleById } = require('../models/model');

const getTopics = (request, response, next) => {
    selectAllTopics()
    .then((topics) => {
        response.status(200).send( topics );
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

module.exports = { getTopics, getArticleById };