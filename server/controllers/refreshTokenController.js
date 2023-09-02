const jwt = require('jsonwebtoken');
const {refreshUserToken} = require('../config/DbConfig');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log('cookies : '+cookies);
    if (!cookies?.humming) return res.sendStatus(401);
    const refreshToken = cookies.humming;

    const foundUser = await refreshUserToken(refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }