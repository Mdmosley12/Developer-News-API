const { selectAllTopics, selectAllArticles } = require('../models/model');

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
        response.status(200).send( articles );
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = { getTopics, getArticles };