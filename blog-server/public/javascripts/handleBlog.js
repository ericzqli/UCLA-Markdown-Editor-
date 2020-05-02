var app = require('../../app');

var dbFunc = require('./dbFunc');
exports.handleUsernamePostid = function(req, res, next) {

    // let dbtest = dbFunc.dbFind(db);
    // console.log(dbtest);
    db.collection('Users').find({}, function(err, docs){
    docs.each(function(err, doc) {
        if(doc) {
        console.log(JSON.stringify(doc) + "\n");
        } 
    })
    });
    res.render('blog', { username: req.params.username, postid: req.params.postid, start: "1"});
}

exports.handleUsername = function(req, res, next) {
    res.render('posts', {});

}