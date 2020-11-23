const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }

    // incorrect email - login validation
    if (err.message === 'Incorrect Email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password - login validation
    if (err.message === 'Incorrect Password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate error code - signup validation
    if (err.code === 11000) { // Duplicate error code
        errors.email = 'That email is already registered';
        return errors; // Return if this condition is met
    }

    // validation errors - signup validation
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => { // Destructuring 'properties' object from parent object
            errors[properties.path] = properties.message; // Updating the error object
        }) 
        // Object.values() > Only outputs/logs object values; { }
        // In this case, only the errors object, which is an array so we can use the forEach method.
    }
    return errors;
}

const maxAge = 60 * 60 * 24 * 3;
const createToken = (id) => { // Returns signed token
    return jwt.sign({ id: id }, 'shameel secret code', {
        expiresIn: maxAge
    });
    // Argument 1 : Payload | Argument 2:  Secret Code | Argument 3: Options Object
    // ^ Header is automatically attached ^ 
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
        const userID = user._id;
        res.status(201).json({ userID });
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error })
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); // Custom method using statics
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
        const userID = user._id;
        res.status(201).json({ userID });
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error })
    }
   
}
