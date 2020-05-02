var express = require('express');
var router = express.Router();
var handleBlog = require('../public/javascripts/handleBlog');

router.get('/:username/:postid', function(req, res, next) {
    
  handleBlog.handleUsernamePostid(req, res, next);
});

router.get('/:username', function(req, res, next) {
    handleBlog.handleUsername(req, res, next);
});

module.exports = router;
