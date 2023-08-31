const dotenv = require("dotenv").config({ path: "config.env" });
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const errHandler = (err) => {
    console.log(err.message, err.code)

    // Login error messages
    if(err.message === 'password incorrect') {
        errors.password = " the password used is not correct"
    }

    if(err.message === 'user does not exist') {
        errors.password = "Email address doers not exist"
    }

    // Duplicate email
    if(err.code === 11000) {
        error.email = "Email already exists"
        return errors
    }

    // Bad email 
    if(err.message.includes("user validation failed")) {
        // console.log(err);
        // console.log(err.errors.properties);
        console.log(Object.values(err.errors));
        // Object.values(err.errors).forEach(error=> {
        //     console.log(error.properties);
        // })

        // Destructuring properties
        Object.values(err.errors).forEach(({propoerties}) => {
            console.log(properties)
            errors[propoerties.path] = properties.message
        })
    }

    return errors

}

const maxAge = 1 * 24 * 60 * 60  // day * hour * minutes * seconds
const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.SECRET_TOKEN, // Secret token
        { expiresIn: maxAge } // reconnect after expiration 
    )
}


/**
 * @method Get
 * @name _get_logout
 */

const get_logout = (req, res) => {
    res.cookie('dwwm', '', {
        maxAge: 1
    });
    res.redirect('/')
}


 /** Get signup page view
 * @method get
 * @name signup
 */
const get_signup = (req, res) => {
    res.render('register')
}


/**
 * Get login page view
 * @method get
 * @name login
 */
const get_login = (req, res) => {
    res.render('login')
}


/**
 * Create user 
 * @method post
 * @param signup
 */
const post_signup = async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const userCreated = await User.create({email, password})
        const token = generateToken(userCreated._id)
        res.cookie('dwwn', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: maxAge * 1000
        })
        res.status(200).json({user: userCreated._id}) // destructure it to get only the token
    } catch (err) {
        const errors = errHandler(err);
        res.status(400).json({errors})
    }
}   


/**
 * Login user 
 * @method post
 * @param login
 */

const post_login = async (req, res) => {
        const {email, password} = req.body;
      try {
         // import the user login static method
        const user = await User.login(email, password)

        const token = generateToken(user._id)
        res.cookie('dwwm', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })
      
        res.status(200).json({ user: user._id })

      } catch (err) {
        const errors = errHandler(err)
        res.status(400).json(errors)
      }
    }




module.exports= {
    get_signup,
    get_login,
    post_login,
    post_signup,
    get_logout
}

