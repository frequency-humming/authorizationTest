const jwt = require('jsonwebtoken');
const {refreshUserToken} = require('../config/DbConfig');

const handleRefreshToken = async (req, res) => {
    console.log('34545');
    const cookies = req.cookies;
    if (!cookies?.humming) return res.sendStatus(401);
    const refreshToken = cookies.humming;

    try{
        const foundUser = await refreshUserToken(refreshToken);
        if (!foundUser) return res.sendStatus(403); //Forbidden 
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || (foundUser.username !== decoded.username && foundUser.id !== decoded.id)) return res.sendStatus(403);
                const user = foundUser.username;
                const id = foundUser.id;
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "id":decoded.id
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { algorithm: 'HS256',
                    expiresIn: 86400 }
                );
                res.json({ accessToken });
            }
        );
    }catch(err){
        console.log('refresh token : '+err);
        return res.sendStatus(403);
    }
    
}

module.exports = { handleRefreshToken }