const mongoose = require('mongoose');
const { isEmail } = require('validator'); // Package for validating emails/passwords etc.
const bcrypt = require('bcrypt'); // Package for password hashing.

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'], // Second Array value is for error messages
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'] // Triggers the function and passes the value to it to check if it's a valid email.
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum passsword length is 6 characters'],
    },
});

// MONGOOSE HOOKS

// fire a function after doc saved to db
userSchema.post('save', (doc, next) => {
    console.log('new user has been created', doc);
    next(); // [middleware] To continue with the process or current process will be paused and there won't be a response.
});

// fire a function before doc saved to db
userSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
    // When creating a user using User.create(), it creates a new instance of the user.
    // ^ We can access this local instance using the 'this' syntax ^
    // ^ 'this' syntax can't be accessed in a arrow function ^
});

// static method to login user - Creating static methods - EX : User.login()
userSchema.statics.login = async function(email, password) {                                     // EX: User.findOne({ })
    const user = await this.findOne({ email: email }); // In this case; 'this' is not an instance, we're defining User
    if (user) {
        const auth = bcrypt.compareSync(password, user.password); // Bcrypt will hash the 'password' and compare with 'user.password', and return true or false. 
        
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}



const User = mongoose.model('user', userSchema);

module.exports = User;