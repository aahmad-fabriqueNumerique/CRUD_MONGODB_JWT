const dotenv = require("dotenv").config({ path: "config.env" });
const User = require('../models/User')


/**
 * Get signup page view
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
        res.status(200).json({user: userCreated._id}) // destructure it to get only the token
    } catch (err) {
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

      
        res.status(200).json({ user: user._id })

      } catch (err) {
        // const errors = errHandler(err)
        res.status(400).json({errors})
      }
    }




module.exports= {
    get_signup,
    get_login,
    post_login,
    post_signup,
}

