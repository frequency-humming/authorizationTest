const {loginUser,deleteToken} = require('./databaseController');
const {errorlogger} = require('../middleware/errorHandler');
const useragent = require('useragent');

const handleLogout = async (req, res) => {
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family;
    const system = agent.os.family;
    const user = req.body.user;
    const cookies = req.cookies;
    if (!cookies?.humming) return res.sendStatus(204); //No content

    try{
        const foundUser = await loginUser(user);
        if (!foundUser) {
            console.log('not found in logout');
            res.clearCookie('humming', { httpOnly: true, sameSite: 'strict', secure: true });
            return res.sendStatus(204);
        }
        foundUser.browser = browser;
        foundUser.system = system;
        await deleteToken(foundUser);
        res.clearCookie('humming', { httpOnly: true, sameSite: 'strict', secure: true });
        res.sendStatus(204);
    } catch(error){
        errorlogger(error);
        res.sendStatus(500);
    } 
    
}

module.exports = { handleLogout }