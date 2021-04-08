const { Users, Artists, Albums, Musics } = require('../../database/models');

const getById = async (id) => {
    return new Promise(async (res, rej) => {
        const user = await Users.findOne({
            where: { id },
            attributes: [ 'id', 'email', 'name', 'avatar' ]
        });

        if(!user) return rej('user_not_found');
        
        user.dataValues.follows = await Artists.findAll({
            attributes: [ 'id', 'name' ],
            include: [ { model: Users, where: { id }, attributes: [] } ]
        });

        user.dataValues.likedAlbums = await Albums.findAll({
            attributes: [ 'id', 'name' ],
            include: [ { model: Users, where: { id }, attributes: [] } ]
        });

        user.dataValues.likedMusics = await Musics.findAll({
            attributes: [ 'id', 'name' ],
            include: [ { model: Users, as: 'Likes', where: { id }, attributes: [] } ]
        });

        user.dataValues.viewedMusics = await Musics.findAll({
            attributes: [ 'id', 'name' ],
            include: [ { model: Users, as: 'Views', where: { id }, attributes: [] } ]
        });

        res(user);
    });
};

module.exports = {
    getById
};
