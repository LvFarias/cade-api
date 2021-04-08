'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Deliveries extends Model { }

  Deliveries.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    logo: DataTypes.STRING,
    color: DataTypes.STRING,
    code_mask: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Deliveries',
  });

  Deliveries.associate = (models) => {
    const { Orders } = models;

    Deliveries.hasMany(
      Orders,
      { foreignKey: 'delivery_id', onDelete: 'CASCADE' }
    );
  };
  
  return Deliveries;
};