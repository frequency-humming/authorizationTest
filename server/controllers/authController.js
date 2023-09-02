const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const useragent = require('useragent');
const {loginUser,storeToken} = require('../config/DbConfig');

const handleLogin = async (req, res) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family;
    console.log('browser : '+browser);
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try{

        const foundUser = await loginUser(user);
        if (!foundUser) return res.sendStatus(401);
        const match = await bcrypt.compare(pwd, foundUser.password);
        console.log('match : '+match);
        if (match) {

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id":foundUser.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { algorithm: 'HS256',
                  expiresIn: 86400 }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username,
                   "id":foundUser.id },
                process.env.REFRESH_TOKEN_SECRET,
                {  algorithm: 'HS256',
                   expiresIn: '1w' });

            foundUser.refreshToken = refreshToken;
            foundUser.browser = browser;
            const result = await storeToken(foundUser);
            if(result.success){
                res.cookie('humming', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.json({ accessToken });
            }else{
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(401);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
    
}

module.exports = { handleLogin };