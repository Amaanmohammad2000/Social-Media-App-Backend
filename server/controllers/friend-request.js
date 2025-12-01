const { friendRequestService } = require('../services');

class FriendRequestController {
    constructor() {}

    static sendFriendRequest = async (req, res) => {
        try {
            const requestData = {
                ...req.body,
                createdBy: req.body.fromUserId
            };

            const response = await friendRequestService.sendFriendRequest(requestData);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Friend request sent successfully",
                data: response
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: err.message
            });
        }
    };

    static updateFriendRequestStatus = async (req, res) => {
        try {
            const {
                body,
                params: { publicId },
                headers: { "x-coreplatform-concurrencystamp": concurrencyStamp }
            } = req;

            const requestData = {
                ...body,
                publicId,
                concurrencyStamp,
                updatedBy: body.toUserId
            };

            const response = await friendRequestService.updateFriendRequestStatus(requestData);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Successfully updated",
                data: response
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: err.message
            });
        }
    };
}

module.exports = FriendRequestController;