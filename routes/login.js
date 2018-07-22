var express = require('express');
var router = express.Router();
const api = require("../api");

// Login page
router.get("/", (req, res, next) => {
  res.render("login", { title: "Giriş yapın", errors: req.session.errors, success: req.session.success, email: req.session.email, password: req.session.password, message: req.session.message });
  req.session.errors = null;
  req.session.success = null;
  req.session.email = null;
  req.session.password = null;
  req.session.message = null;
});

// Login page post
router.post("/", (req, res, next) => {
  req.check('loginEmail', 'Hatalı Email').isEmail();
  let errors = req.validationErrors();

  req.session.email = req.body.loginEmail;
        req.session.password = req.body.loginPassword;

  if (errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/login');
  }else{
    req.session.success = true;
  }

  api.apiCall(
    null,
    "/user/login",
    "POST",
    {
      email: req.body.loginEmail,
      password: req.body.loginPassword
    },
    (result) => {
      if (result.messageType == 0) {
        req.session.message = result.message;
        req.session.success = false;
        res.redirect('/login');
      } else {
        req.session.token=result.token;
        res.redirect('/');
      }
    }
  );
});

// logout page
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
