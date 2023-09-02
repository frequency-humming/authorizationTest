const bcrypt = require('bcrypt');
const {duplicateUsers,createUser} = require('../config/DbConfig');

const handleNewUser = async (req, res) => {
    
    const { user, pwd, email} = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await duplicateUsers(user,email);
    if (duplicate.found){
        return res.status(409).json({ 'Error': `${duplicate.basedOn}` });//Conflict 
    } 

    try {
        console.log('in controller for register try');
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const registeredUser = await createUser(user,hashedPwd,email);
        if(registeredUser){
            console.log('new user created');
            res.status(201).json({ 'success': `New user ${user} created!` });
        }
    } catch (err) {
        console.log('getting eror in register controller');
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };