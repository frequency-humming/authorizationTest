const getAllUsers = async (req, res) => {
    const users = [
            {"username": "deliala"},
            {"username": "foo"}
    ];
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    console.log(users);
    res.json(users);
}



module.exports = {
    getAllUsers
}