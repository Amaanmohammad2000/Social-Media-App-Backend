"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "user",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },

        public_id: { type: Sequelize.UUID, unique: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        phone_no: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },

        status: {
          type: Sequelize.STRING,
          enum: ["active", "inactive"],
          defaultValue: "active",
          index: true,
        },
        concurrency_stamp: {
          type: Sequelize.UUID,
          unique: true,
          allowNull: false,
        },
        created_by: Sequelize.UUID,
        updated_by: Sequelize.UUID,
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        schema: "social_media_app",
      }
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable("user", {
      schema: "social_media_app",
    }),
};