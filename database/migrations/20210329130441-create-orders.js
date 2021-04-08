'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      status_log: {
        type: Sequelize.STRING
      },
      track_code: {
        type: Sequelize.STRING
      },
      delivery_id: {
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING
      },
      destine: {
        type: Sequelize.STRING
      },
      last_sync: {
        type: Sequelize.DATE
      },
      shipping_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Orders');
  }
};