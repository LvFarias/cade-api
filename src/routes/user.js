const express = require('express');
const { eq } = require('sequelize/types/lib/operators');

const { jwt, logger } = require('../libs');
const { userService } = require('../services');

const router = express.Router();

router.get('/:id', jwt.isAuthorized, async (req, res, next) => {
    const user = await userService.getById(req.params.id).catch(logger.error);

    if (!!user) {
        return req.success(user);
    }
    
    return req.error('user_id_invalid');
});

router.get('/', (req, res, next) => {
    return req.success();
});

router.put('/', (req, res, next) => {
    return req.success();
});

module.exports = router;
