const {
    user: UserModel,
    friend_request: FriendRequestModel,
    sequelize,
} = require('../../database');

const { Op } = require("sequelize");
const Helper = require("../utils/Helper");

// Gets the list of users who has not rejected or not sent the friend request
const getFriendUserList = async (payload) => {
    try {
        const { pageSize, pageNumber, filters, sorting, loginUserId, profileOwnerUserId } = payload;

        // check friendship between viewer and profile owner
        const checkFriends = await FriendRequestModel.findOne({
            where: {
                status: "accepted",
                [Op.or]: [
                    { from_user_id: loginUserId, to_user_id: profileOwnerUserId },
                    { from_user_id: profileOwnerUserId, to_user_id: loginUserId }
                ]
            }
        });

        if (!checkFriends) {
            throw new Error("You are not friends with this user.");
        }

        const limit = Number(pageSize) || 10;
        const offset = (Number(pageNumber) - 1) * limit || 0;

        const where = Helper.generateWhereCondition(filters);
        const order = Helper.generateOrderCondition(sorting);

        // Get all accepted friendships of profileOwnerUserId
        const response = await FriendRequestModel.findAndCountAll({
            where: {
                ...where,
                status: "accepted",
                [Op.or]: [
                    { from_user_id: profileOwnerUserId },
                    { to_user_id: profileOwnerUserId }
                ]
            },
            include: [
                {
                    model: UserModel,
                    as: 'fromUser', 
                    required: false
                },
                {
                    model: UserModel,
                    as: 'toUser',
                    required: false
                }
            ],
            order,
            limit,
            offset
        });

        if (!response) return { count: 0, doc: [] };

        const { count, rows } = response;

        const friends = rows.map(row => {
            if (row.from_user_id === profileOwnerUserId) {
                return row.toUser;
            }
            return row.fromUser;
        });

        return { count, doc: friends };

    } catch (err) {
        console.error("User Service Error:", err);
        throw new Error(err.message || "User service failed");
    }
};

module.exports = {
    getFriendUserList
};