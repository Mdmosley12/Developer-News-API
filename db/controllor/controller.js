const { selectAllTopics } = require('../models/model');

const getTopics = (request, response, next) => {
    selectAllTopics()
    .then((topics) => {
        response.status(200).send( topics );
    })
    .catch((err) => {
        next(err);
    })
};

module.exports = { getTopics };