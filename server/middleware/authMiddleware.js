const dotenv = require("dotenv").config({ path: "config.env" });
const jwt = require('jsonwebtoken');
const User = require('../models/User')


// we can put this middlewre  before any route we want to protect

const verifyJWTToken = (req, res, next) => {

    // grab the token from the cookie (exist in the application tab)
    const token = req.cookies.dwwm;
    console.log(req.cookies);
    console.log(token);
    if (token) {
        // verify the token
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) =>{
            if(err) {
                console.log(err.message);
                console.log('failed');
                res.redirect('/login')
            } else {
                console.log(decodedToken);
                next() // carry on with what you are doing => log the user
            }
        })
    } else {
        res.redirect('/login')
    }

}


const verifyUser = (req, res, next) => {

    // grab the token from the cookie 
    const token = req.cookies.dwwm;
 
    // we want to check if the token exists
    if (token) {
        // verify the token againt our secret
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) =>{
            if(err) {
                console.log(err.message);
                // we give it a null value as there is an error and we need not to show anything in the view
                // to be added after ====>>>> res.locals.user = user -- > down there
                res.locals.user = null; 
                next() // just move to the next handler as we do not want to inject anything in the view
                
            } else {
                console.log(decodedToken); 
                
                // there is a user logged in and we want their info
                // on the decodedToken we have a payload which contain {id} (check authCtrl generateToken func)
                // we have the id on the decodedToken
                // now find the the user in the db and inject it in the view.. we want to use the User model
                let user = await User.findById(decodedToken.id);
        
                // to inject the user in the view, we need to use locals
                // we create a property called user, available in the views so we can access email
                res.locals.user = user;
                next() // cfire a handler and go to next step
            }
        })
    } else {
        res.locals.user = null
        next()
    }

}

module.exports = {verifyJWTToken, verifyUser}