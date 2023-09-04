const bcrypt = require('bcrypt');
const {duplicateUsers,createUser} = require('./databaseController');
const {errorlogger} = require('../middleware/errorHandler');

const handleNewUser = async (req, res) => {
    
    const { user, pwd, email} = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        const duplicate = await duplicateUsers(user,email);
        if (duplicate.found){
            return res.status(409).json({ 'Error': `${duplicate.basedOn}` });
        }
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const registeredUser = await createUser(user,hashedPwd,email);
        if(registeredUser){
            console.log('new user created');
            res.status(201).json({ 'success': `New user ${user} created!` });
        }else {
            res.status(500).json({ 'failure': 'Refresh and try again'});
        }
    } catch (error) {
        errorlogger(error);
        res.status(500);
    }
}

module.exports = { handleNewUser };