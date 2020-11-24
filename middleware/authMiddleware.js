const jwt = require('jsonwebtoken');
const User = require('../models/User');

// require auth
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'shameel secret code', (err, decodedToken) => {
           if (err) {
               console.log(err.message);
               res.redirect('/login');
           } else {
               console.log(decodedToken);
               next();
           }
        })
    }
    else {
        res.redirect('/login');
    }
}

// check user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'shameel secret code', async (err, decodedToken) => {
           if (err) {
               console.log(err.message);
               res.locals.user = null;
               next();
           } else {
               console.log(decodedToken);
               let user = await User.findById(decodedToken.id);
               //res.locals.`variablename` = data  // Locals are used to declare variable that can be accessed in the view
               res.locals.user = user;
               console.log(user);
               next();
           }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser }