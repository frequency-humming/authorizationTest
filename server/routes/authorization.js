const express = require('express');
const router = express.Router();
const {handleNewUser} = require('../controllers/registerController');
const {handleRefreshToken} = require('../controllers/refreshTokenController');
const {handleLogout} = require('../controllers/logoutController');
const {handleLogin,verifyUser} = require('../controllers/loginController');
const {getAllData} = require('../controllers/DataController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/auth', handleLogin);
router.get('/verify', verifyUser);
router.post('/register',handleNewUser);
router.get('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);
router.get('/users',verifyJWT,getAllData);


module.exports = router;