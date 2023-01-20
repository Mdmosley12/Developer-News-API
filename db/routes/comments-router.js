const commentsRouter = require('express').Router()
const { deleteComment } = require('../controllor/controller');

commentsRouter.use('/:comment_id', deleteComment);

module.exports = commentsRouter;