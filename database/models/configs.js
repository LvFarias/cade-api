'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Configs extends Model { }

  Configs.init({
    user_id: DataTypes.INTEGER,
    sync_time: DataTypes.INTEGER,
    notif_sms: DataTypes.BOOLEAN,
    notif_push: DataTypes.BOOLEAN,
    notif_email: DataTypes.BOOLEAN,
    sync_ml: DataTypes.BOOLEAN,
    sync_cpf: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Configs',
  });

  Configs.associate = (models) => {
    const { Users } = models;

    Configs.belongsTo(
      Users,
      { foreignKey: 'user_id' }
    );
  };

  return Configs;
};