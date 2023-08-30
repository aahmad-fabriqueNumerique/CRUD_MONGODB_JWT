# Steps te reproduce this application

### Install dev dep
- 
### Create server.js
- dotenv
- ejs
- express
- mongoose
- nodemon

### Create structure
- public folder
- controller
- database
- models
- routes
- views

### ejs view pages
- download
- create vieuws folder
    - add home page
    - add login page
    - add register page
    - add dashboard page
    - add profile page

### create thhe server
- 


### Routes folder
- Create authRoutes.js
    - const { Router } = require('express');
    - const router = Router();
    - router.get('/register', {}); // with all other routes and methods (post)
    - module.exports = router;

### Controller folder
- create authCtrl.js
    ``` js
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


    const post_signup = (req, res) => {
        res.send('register')
    }   


    /**
    * Login user route
    * @method post
    * @param login
    */
    const post_login = (req, res) => {
        res.send('login')
    }

    module.exports= {
        get_signup,
        get_login,
        post_login,
        post_signup
    }
    ```
- Continue with all other routes


### Routes folder
- import -> const authCtrl = require('../controller/authCtrl');



### Create user model and schema
- create in model folder , a file Users.js
- import mongoose
 ``` js
   import mongoose from 'mongoose';
    const { Schema } = mongoose;
```
- create the schema
- create the model (user in singular and mongodb use the collection in plural)
```js
    const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        createdAt: {
            type: Date
        },
    })

    const User = mongoose.model('user', userSchema);
```
- export the model


### Going back to the controller folder
- import the User model
- add try catch async to signup post func
- const userCreate = await User.create({email, password})
- add 200 status
- add 400 status for error handling
- test in Insomnia / postman



### Mongoose Validation
- install validator library
- add messages to required properties
- add validators for email address

### authCtrl ErrorHandler
- create function for handling errors
- console.log the error messages in the console
- loop over the properties to get to the messages
- return errors
- change res.send by res.json eand get the errors
-----
- Create the duplicate email address error
- get the error code from the console 11000


### hash passwords
- use mongoose hooks Pre & Post
- using bcrypt
    - install bcrypt
    ```js
    userSchema.pre('save', async function (next) { 
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
       
    next()
    
    })
    ```

### Cookies
- store data in user browser
- track activities 
- A cookie is usually a tiny text file stored in your web browser. A cookie was initially used to store information about the websites that you visit. But with the advances in technology, a cookie can track your web activities and retrieve your content preferences. For example; Cookies save your language preferences 
- Explination:

          

    - When a user logs into our application, we need to know who they are across all our HTTP methods and routes.

    - One way to do this is to store the users “session”. A session is started once a user logs in, and expires some time after that.

    - Each logged in user has some reference to the session (called a cookie), which they send with their requests. We then use this reference to look up the user that it belongs to and return information specific to them.
- install cookie-parser
- create route set-cookie
- go to browser and test the cookie wion this route
- confirm that the cookie was saved
- create route get-cookie
- check browser to verify the cookie
- Secure cookies:
    - One precaution that you should always take when setting cookies is security. In the above example, the cookie can be deemed insecure.

    - For example, you can access this cookie on a browser console using JavaScript (document.cookie). This means that this cookie is exposed and can be exploited through cross-site scripting.

### JWT
- intro jwt
- demo on jwt.io
- install npm i jsonwebtoken
- add it to authCtrl.js
- create token in seprate function
- add the token varaible to the sign_up function
```js
    const token = generateToken(userCreated._id) // we got access from the db
    res.cookie('dwwm-cookie', token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // need to convert it to seconds
     })
    res.status(200).json({user: userCreated._id})
```
### handle errors in the front:
 - in order to add the errors of signup and login, we should retrieve data from the response and inject it in the dom
 - in register.ejs:
    - Get the data object to check the errors
    ```js
    const data = await response.json()
    console.log(data);
    ```
    - get the textcontent
    ```js
    const emailError = document.querySelector('.emailErr');
        const passwordError = document.querySelector('.passErr');
    ```
    - fill the textContent
    ```js
     if (data.errors) {
         emailError.textContent = data.errors.email;
         passwordError.textContent = data.errors.password;
     }
    ```
    - send the user to another page
    ```js
      if (data.user) {
         location.assign('/dashboard')
        }
    ```

### Working with login page
- we want to log the user and comper password with the password in the db. 
- We need to create a static method to login user
    - static() method allows us to define static class methods for the models using schema objects. 
    - statics are functions you call on the whole model whereas methods are functions you call on a particular instance
- go to the user model js
- create static() method 
    ```js
    // Create static method
    // create a method called login
    userSchema.statics.login = async (email, password) => {
        // check the user with entered email
        const userLogging = await this.user.findOne({ email: email}); // this refers to the user model not the instance of user
        if (userLogging) {
            const userAuthentication = await bcrypt.compare(password, user.password) // first arg password not hashed, 2nd hashed pass in bd 
            if(userAuthentication) {
                return user
            }
            throw Error ('password incorrect')
        }
        throw Error ('user does not exist')

    }
    ```
- add the logic to the authCtrl.js in the login func
- create a tryCatch
- import the user login static method 
- res.status(200) and add the user id to verify it works when we get the id back
```js
    const post_login = async (req, res) => {
            const {email, password} = req.body;
            try {
                // import the user login static method
                const user = await User.login(email, password)
                res.status(200).json({ user: user._id })
            } catch (error) {
                res.status(400).json({})
            }
        }

```
- Add the token    
    - Reuse the generateToken() method to create the token for the logged in user
- handleErrors:
    - add the errHandler() method to the catch in post_login() function
    ```js
    catch (error) {
        const errors = errHandler(error)
        res.status(400).json({})
      }
    ```
    - demo the error by sending false credentials and log the messages in the console (messges from thro error in user model)
    - write the logic for the error:
    ```js
     // Error login messages
    if(err.message === 'password incorrect') {
        errors.password = "the password you entered is not correct"
    }

    if(err.message === 'user does not exist') {
        errors.email = "Email address does not exist"
    }
 
    ```


### Adding protection for routes
- create a middleware to verify token
```js
    const verifyJWTToken = (req, res, next) => {

        // grab the token from the cookie (exist in the application tab)
        const cookieToken = req.cookies.jwt
        if (cookieToken) {
            // verify the token
            jwt.verify(cookieToken,  process.env.SECRET_TOKEN, (err, decodedToken) =>{
                if(err) {
                    console.log(err.message);
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
```
- export the middleware
- add it in front of the routes protected
```js
  router.get("/dashboard", verifyJWTToken, (req, res) => {
    res.render("dashboard");
  });
```

### Logout Users
- create route /get_logout in the authRoutes.js
- create get method => get_logout()
    - we need to remove the jwt cookie
    - we can not delete from the server
    - we replace it with an empty string value (remove the token value) with a expiry date very rapid
    - redirect the user to the homepage

### Check current user
- add a middleware => verifyUser
- apply the middleware on the routes
- 