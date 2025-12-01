const { v1: uuidV1 } = require("uuid");
const {
    friend_request: FriendRequestModel,
    sequelize,
} = require('../../database');
const { Op } = require("sequelize");

const sendFriendRequest = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const { fromUserId, toUserId, createdBy } = payload;

        const existing = await FriendRequestModel.findOne({
            where: {
                from_user_id: fromUserId,
                to_user_id: toUserId
            }
        });

        if (existing) {
            throw new Error("Friend request already sent.");
        }

        const doc = {
            public_id: uuidV1(),
            concurrency_stamp: uuidV1(),
            from_user_id: fromUserId,
            to_user_id: toUserId,
            created_by: createdBy
        };

        await FriendRequestModel.create(doc, { transaction });

        await transaction.commit();
        return doc;

    } catch (err) {
        if (transaction && transaction.finished !== "rollback") {
            await transaction.rollback();
        }
        throw err;
    }
};

const updateFriendRequestStatus = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const { publicId, concurrencyStamp, ...data } = payload;

        const isExists = await FriendRequestModel.findOne({
            where: { public_id: publicId }
        });

        if (!isExists) {
            throw new Error("Friend request not found.");
        }

        if (concurrencyStamp !== isExists.concurrency_stamp) {
            throw new Error("Concurrency stamp mismatch.");
        }

        const newConcurrencyStamp = uuidV1();

        const updateDoc = {
            ...data,
            concurrency_stamp: newConcurrencyStamp
        };

        await FriendRequestModel.update(updateDoc, {
            where: { public_id: publicId },
            transaction
        });

        await transaction.commit();
        return updateDoc;

    } catch (err) {
        if (transaction && transaction.finished !== "rollback") {
            await transaction.rollback();
        }
        throw err;
    }
};

module.exports = {
    sendFriendRequest,
    updateFriendRequestStatus
};