const { Router } = require('express');
const userController = require('../controllers/user');

const userRouter = Router()

userRouter.get('/get-users-list', userController.getFriendUserList)

module.exports = userRouter;