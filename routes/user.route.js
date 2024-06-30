const express = require('express');
const router = express.Router();

const { signIn, signUp } = require('../controller/user.controller.js');

router.post('/register', signUp);
router.post('/login', signIn);

module.exports = router;