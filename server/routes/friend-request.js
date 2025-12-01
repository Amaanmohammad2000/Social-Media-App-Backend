const { Router } = require('express');
const FriendRequestController = require('../controllers/friend-request');

const userRouter = Router()

userRouter.post('/send-friend-request', FriendRequestController.sendFriendRequest);
userRouter.patch('/update-friend-request-status', FriendRequestController.updateFriendRequestStatus);

module.exports = userRouter;