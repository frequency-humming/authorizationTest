
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.humming) return res.sendStatus(204); //No content
    const refreshToken = cookies.humming;

    const foundUser = {"username":"dhelila","roles":{"User":2001},
    "password":"$2b$10$GULu1lvZxb6Hz0Eapt34Cu.B1c940Rj8Ya9mZjLy0c.iUB2EWEmL2",
    "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmUxIiwiaWF0IjoxNjMzOTkyMjkwLCJleHAiOjE2MzQwNzg2OTB9.U85HVX_gcDZkHHSRWeo7AHfIe7q9i03dGW2ed3fHqAk"}
    if (!foundUser) {
        console.log('not found in logout');
        res.clearCookie('humming', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    res.clearCookie('humming', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }