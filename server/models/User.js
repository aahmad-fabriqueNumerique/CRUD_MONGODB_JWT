
// Create user model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Create User Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'An email address is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'min length is 6 characters']
    },
    createdAt: {
        type: Date
    },

})

const saltRounds = 10;

// Using bcrypt to hash passwords
userSchema.pre('save', async function (next) { 
    
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
       
    next()
    
})

// Create static method
// create a method called login
userSchema.statics.login = async function(email, password) {
    // check the user with entered email
    const user = await this.findOne({ email: email}); // this refers to the user model not the instance of user
    if (user) {
        const authenticatedUser = await bcrypt.compare(password, user.password); // first arg password not hashed, 2nd hashed password in bd 
        if(authenticatedUser) {
            return user
        }
        throw Error ('password incorrect')
    }
    throw Error ('user does not exist')

}



const User = mongoose.model('user', userSchema);

module.exports = User;