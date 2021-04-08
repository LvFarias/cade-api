'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model { }

  Users.init({
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });

  Users.associate = (models) => {
    const { Configs, Orders } = models;
    
    Users.hasOne(
      Configs,
      { foreignKey: 'user_id' }
    );

    Users.hasMany(
      Orders,
      { foreignKey: 'user_id', onDelete: 'CASCADE' }
    );
  };

  return Users;
};