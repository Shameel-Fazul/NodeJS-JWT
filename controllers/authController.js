const User = require('../models/User');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }

    // duplicate error code
    if (err.code === 11000) { // Duplicate error code
        errors.email = 'That email is already registered';
        return errors; // Return if this condition is met
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => { // Destructuring 'properties' object from parent object
            errors[properties.path] = properties.message; // Updating the error object
        }) 
        // Object.values() > Only outputs/logs object values; { }
        // In this case, only the errors object, which is an array so we can use the forEach method.
    }
    return errors;
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
        res.status(201).json(user);
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error })
    }
}

module.exports.login_post = async (req, res) => {
    console.log(req.body);
    res.send('new login');
}
