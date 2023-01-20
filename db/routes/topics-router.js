const topicsRouter = require('express').Router()
const { getTopics } = require('../controllor/controller');

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;