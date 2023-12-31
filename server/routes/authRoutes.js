const { Router } = require('express');
const authCtrl = require('../controller/authCtrl');
const {verifyJWTToken, verifyUser} = require('../middleware/middleware')

const router = Router();


// now we can access to the user info in the views
// with the * we apply the middleware to all routes
// router.get('*', verifyUser ); 

router.get('/register', authCtrl.get_signup);

router.post('/register', authCtrl.post_signup);

router.get('/login', authCtrl.get_login);

router.post('/login', authCtrl.post_login);

router.get('/logout', authCtrl.get_logout);

router.get("/", verifyUser, (req, res) => {
    res.render("home");
  });
  
  router.get("/dashboard", verifyJWTToken, verifyUser, (req, res) => {
    res.render("dashboard");
  });
  
  router.get("/profile",verifyJWTToken, verifyUser, (req, res) => {
    res.render("profile");
  });
  


module.exports = router;