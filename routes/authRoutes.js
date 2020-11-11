const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router(); //Creating the Router instance

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;