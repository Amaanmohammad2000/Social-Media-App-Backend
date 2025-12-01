'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createSchema('social_media_app');
  },

  async down(queryInterface) {
    await queryInterface.dropSchema('social_media_app');
  }
};