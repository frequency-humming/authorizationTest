const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const useragent = require('useragent');
const {eventData,storeToken} = require('../config/DbConfig');

const handleLogin = async (req, res) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family;
    console.log('browser : '+browser);
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try{

        const foundUser = await eventData(user);
        if (!foundUser) return res.sendStatus(401); //Unauthorized 
        // evaluate password 
        console.log(foundUser.password);
        console.log('pwd '+pwd);
        const match = await bcrypt.compare(pwd, foundUser.password);
        console.log('match : '+match);
        if (match) {

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '100s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            foundUser.refreshToken = refreshToken;
            foundUser.browser = browser;
            const result = await storeToken(foundUser);
            console.log(result);
            if(result.success){
                res.cookie('humming', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); 
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