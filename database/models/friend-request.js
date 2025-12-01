module.exports = (sequelize, DataTypes) => {
  const friend_request = sequelize.define(
    "friend_request",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      public_id: { type: DataTypes.UUID, unique: true, allowNull: false },

      from_user_id: { type: DataTypes.INTEGER, allowNull: false },
      to_user_id: { type: DataTypes.INTEGER, allowNull: false },

      status: {
        type: DataTypes.STRING,
        enum: ["Pending", "Accepted", "Rejected"],
        defaultValue: "Pending",
        allowNull: false
      },

      concurrency_stamp: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      created_by: DataTypes.UUID,
      updated_by: DataTypes.UUID,
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      schema: "socia_media_app",
    }
  );
  friend_request.associate = (models) => {
    friend_request.hasOne(models.user, {
      foreignKey: "from_user_id",
      sourceKey: "public_id",
      as: 'fromUser'
    });
    friend_request.hasOne(models.user, {
      foreignKey: "from_user_id",
      sourceKey: "public_id",
      as: 'toUser'
    });
  }

  return friend_request;
};