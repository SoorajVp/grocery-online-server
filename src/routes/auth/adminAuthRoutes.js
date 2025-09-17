const express = require('express');
const { admiLogin } = require('../../controllers/auth/adminAuth');
const router = express.Router();

router.post('/login', admiLogin);

router.get('/login', (req, res) => res.send("hyyyyy"));


module.exports = router;
