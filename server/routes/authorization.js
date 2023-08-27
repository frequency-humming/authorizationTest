const express = require('express');
const router = express.Router();
const {handleNewUser} = require('../controllers/registerController');
const {handleRefreshToken} = require('../controllers/refreshTokenController');
const {handleLogout} = require('../controllers/logoutController');
const {handleLogin} = require('../controllers/authController');
const {getAllData} = require('../controllers/DataController');
const verifyJWT = require('../middleware/verifyJWT');
const roles_list = require('../config/role_list');
const verifyRoles = require('../middleware/verifyRoles');

router.post('/auth', handleLogin);
router.post('/register',handleNewUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);
router.get('/users',verifyJWT,verifyRoles(roles_list.User),getAllData);


module.exports = router;