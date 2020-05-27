var express = require('express');
var router = express.Router();
var handleBlog = require('../public/javascripts/handleBlog');
// router.get('/editor', function(req, res, next) {
//   console.log("router");
//   if('jwt' in req.cookies) {
//     res.redirect('/blog/login');
//   }
 
// })

router.get('/:username/:postid', function(req, res, next) {
    
  handleBlog.handleUsernamePostid(req, res, next);
});

router.get('/:username', function(req, res, next) {
    handleBlog.handleUsername(req, res, next);
});


module.exports = router;
