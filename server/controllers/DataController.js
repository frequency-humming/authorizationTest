const getAllData = async (req, res) => {
    const users = [
            {"username": "deliala"},
            {"username": "foo"},
            {"username":"yesdo"}
    ];
    if (!users) return res.status(204).json({ 'message': 'Error retrieving data' });
    res.json(users);
}

module.exports = {getAllData};