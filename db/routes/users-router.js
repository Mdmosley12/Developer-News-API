const usersRouter = require('express').Router();
const { getUsers } = require('../controllor/controller');

usersRouter.get('/', getUsers);

module.exports = usersRouter;