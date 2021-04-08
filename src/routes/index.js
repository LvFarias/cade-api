const express = require('express');

const models = require('../../database/models');
const { jwt, logger, email } = require('../libs');

const router = express.Router();

router.get('/', async (req, res, next) => {
  return req.success();
});

router.post('/forgot-password', async (req, res, next) => {
  const user = await models.Users.findOne({ where: { email: req.body.email } }).catch(logger.error);

  if (user) {
    const token = user.password;

    const result = await email.forgotPassword(user.email, user.name, token).catch(logger.error);

    if (result) {
      return req.success();
    }
  }

  return req.error();
});

router.get('/reset-password', async (req, res, next) => {
  const user = await models.Users.findOne({ where: { email: req.params.email } }).catch(logger.error);

  if (user) {
    const passwordMath = await jwt.comparePassword(user.password, req.params.token).catch(logger.error);

    if (passwordMath) {
      return req.success({
        id: user.id,
        name: user.name,
        email: user.email,
        token: user.password,
      });
    }
  }

  return req.error('user_or_password_invalid');
});

router.post('/reset-password', async (req, res, next) => {
  if (!req.body.password && !req.body.cPassword) {
    return req.error('invalid_params');
  }
  
  const user = await models.Users.findOne({ where: { email: req.body.email } }).catch(logger.error);

  if (user) {
    const passwordMath = await jwt.comparePassword(user.password, req.body.token).catch(logger.error);
    
    if (passwordMath) {
      const update = await models.Users.update({ password: req.body.password }, { where: { id: req.body.id } }).catch(logger.error);
      
      if (update[0] > 0) return req.success();
    }
  }
  
  return req.error('error_on_reset_password');
});

router.post('/login', async (req, res, next) => {
  const user = await models.Users.findOne({ where: { email: req.body.email } }).catch(logger.error);

  if (user) {
    const passwordMath = await jwt.comparePassword(user.password, req.body.password).catch((e) => { logger.error('error2', e) });
    
    if (passwordMath) {
      user.dataValues.token = jwt.createUserToken(user.id);
      
      return req.success(user);
    }
  }
  
  return req.error('user_or_password_invalid');
});

router.delete('/logout', async (req, res, next) => {
  return req.success();
});

module.exports = router;
