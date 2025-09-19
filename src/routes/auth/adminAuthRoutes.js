const express = require('express');
const { admiLogin } = require('../../controllers/auth/adminAuth');
const router = express.Router();

router.post('/login', admiLogin);



module.exports = router;
