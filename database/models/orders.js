'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model { }

  Orders.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    status_log: DataTypes.STRING,
    track_code: DataTypes.STRING,
    delivery_id: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destine: DataTypes.STRING,
    last_sync: DataTypes.DATE,
    shipping_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Orders',
  });

  Orders.associate = (models) => {
    const { Users, Deliveries } = models;

    Orders.belongsTo(
      Users,
      { foreignKey: 'user_id', onDelete: 'CASCADE' }
    );

    Orders.belongsTo(
      Deliveries,
      { foreignKey: 'delivery_id', onDelete: 'CASCADE' }
    );
  };

  return Orders;
};