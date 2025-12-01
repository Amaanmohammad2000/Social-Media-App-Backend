module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      public_id: { type: DataTypes.UUID, unique: true, allowNull: false },

      name: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      phone_no: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },

      status: {
        type: DataTypes.STRING,
        enum: ["active", "inactive"],
        defaultValue: "active",
        index: true,
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
  user.associate = (models) => {
  }

  return user;
};