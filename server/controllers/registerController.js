const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    //const duplicate = await User.findOne({ username: user }).exec();
    //if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        console.log('in controller for register try');
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        console.log(hashedPwd);
        console.log('new user created');
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };