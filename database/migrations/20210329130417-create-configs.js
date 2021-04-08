'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      sync_time: {
        type: Sequelize.INTEGER
      },
      notif_sms: {
        type: Sequelize.BOOLEAN
      },
      notif_push: {
        type: Sequelize.BOOLEAN
      },
      notif_email: {
        type: Sequelize.BOOLEAN
      },
      sync_ml: {
        type: Sequelize.BOOLEAN
      },
      sync_cpf: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Configs');
  }
};