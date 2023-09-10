const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const useragent = require('useragent');
const {errorlogger} = require('../middleware/errorHandler');
const {loginUser,storeToken,verifyUserToken} = require('./databaseController');

const handleLogin = async (req, res) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family;
    const system = agent.os.family;
    const cookies = req.cookies;
    console.log(cookies.humming);
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try{

        const foundUser = await loginUser(user);
        if (!foundUser) return res.sendStatus(401);
        const match = await bcrypt.compare(pwd, foundUser.password);
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
            foundUser.system = system;
            const result = await storeToken(foundUser);
            if(result.success){
                res.cookie('humming', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.json({ accessToken });
            }else{
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(401);
        }
    }catch(error){
        errorlogger(error);
        res.sendStatus(500);
    }
    
}

const verifyUser = async(req,res) => {
    let newRefreshToken;
    let accessToken;
    let user;
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family;
    const system = agent.os.family;
    const cookies = req.cookies;
    if (!cookies?.humming) return res.sendStatus(401);
    const refreshToken = cookies.humming;
    console.log(refreshToken);
    try{
        const foundUser = await verifyUserToken(refreshToken,browser,system);
        if (!foundUser) return res.sendStatus(403); //Forbidden 
        console.log('after user');
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || (foundUser.username !== decoded.username && foundUser.id !== decoded.id)) return res.sendStatus(403);
                const currentTimestamp = Math.floor(Date.now() / 1000); // in seconds
                const timeUntilExpiration = decoded.exp - currentTimestamp;
                if (timeUntilExpiration < 259200) {
                    console.log('in refresh cookie');
                    newRefreshToken = jwt.sign({
                        "username": foundUser.username,
                        "id": foundUser.id
                    }, process.env.REFRESH_TOKEN_SECRET, {
                            algorithm: 'HS256',
                            expiresIn: '1w'
                    });       
                };
                accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": foundUser.username,
                            "id": foundUser.id
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { algorithm: 'HS256',
                      expiresIn: 86400 }
                );
                
            });
            user = foundUser.username;        
            if(newRefreshToken){
                console.log('in refresh user token');
                foundUser.refreshToken = newRefreshToken;
                foundUser.browser = browser;
                foundUser.system = system;
                const result = await storeToken(foundUser);
                if(result.success){
                    console.log('in token success');
                    res.cookie('humming', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
                    res.json({ user,accessToken });
                }else{
                    res.sendStatus(500);
                } 
            }else{
                console.log('without updating');
                res.json({ user,accessToken });
            }                
    }catch(error){
        errorlogger(error);
        return res.sendStatus(403);
    }
}

module.exports = { handleLogin,verifyUser };