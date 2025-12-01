const { userService } = require('../services');

class UserController {
    constructor() {}

    static getFriendUserList = async (req, res) => {
        try {
            const {
                query: {
                    pageSize: pageSizeString,
                    pageNumber: pageNumberString,
                    ...query
                },
            } = req;

            const pageNumber = parseInt(pageNumberString || 1);
            const pageSize = parseInt(pageSizeString || 10);

            const requestData = {
                ...query,
                pageNumber,
                pageSize
            };

            const response = await userService.getFriendUserList(requestData);

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: "Bad request"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Successfully fetched",
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

module.exports = UserController;