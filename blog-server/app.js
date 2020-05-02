var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assert = require('assert');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//

// var jwt = require('jsonwebtoken');

var jwtModule = require('./jwtModule');

var bcrypt = require('bcryptjs');

var markdownGen = require('./markdownGen');

var blogRouter = require('./routes/blog');
//Mongo DB connection pool
var MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://localhost:27017';
// var db;
let db;
MongoClient.connect(MONGODB_URI, function(err, client){
  assert.equal(err, null);
  console.log("DB connected");
  // var db_temp = client.db('BlogServer', function(db_temp){
  //   db = db_temp;
  // });
  db = client.db('BlogServer');
  app.listen(3000);
  console.log('Listening on port 3000');
   
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO: handle login



app.get('/blog/:username/:postid', function(req, res, next) {

  var myquery = {'username': req.params.username,'postid': parseInt(req.params.postid)};
  db.collection('Posts').find(myquery).toArray((err, result) => {
    if(result.length === 0) {
      next();
      // return;
    }
    var doc = result[0];
    res.render('singlePost', {title: markdownGen.markdownGen(doc.title), 
      body: markdownGen.markdownGen(doc.body)});
  });
});


app.get('/blog/login/:redirect?', function(req, res, next) {
  var redirectInQuery = ("redirect" in req.query);
  if(redirectInQuery) {
    res.render('login', {redirectInQuery: redirectInQuery, redirect: req.query.redirect});
  } else {
    res.render('login',{redirectInQuery: redirectInQuery});
  }
});

app.post('/blog/login/:redirect?', function(req, res, next) {

  if((req.body.username == "") || (req.body.password == "")) {
    res.render('error');
  }
  db.collection('Users').find({'username': req.body.username}).toArray(
    function(err, result) {
      if(result.length === 0) {
        res.redirect(401, 'http://localhost:3000/blog/login/');
      }
      var dbPassword = result[0].password;
      bcrypt.compare(req.body.password, dbPassword, function(err, result) {
        if(result) {
          var token = jwtModule.sign(req.body.username);
          res.cookie('jwt', token);        
          if('redirect' in req.body) {
            var reAddress = req.body.redirect;
            res.redirect(200, reAddress);
          } else {
            res.redirect(200, '/status/loginsuc/');
          }
        } else {  
          res.redirect(401, '/blog/login/');
        }
      });
    }
  );
});


app.get('/blog/:username', function(req, res, next) {

  db.collection('Posts').find({'username': req.params.username}).toArray(
    function(err, result) {
      // console.log(req.query.start);
      var start = req.query.start;
      if(!start) {
        start = 1;
      }
      res.render('postList', {username: req.params.username, 
        list: result, start: start});
    }
  );
});




app.get('/status/loginsuc', function(req, res, next) {
  res.render('loginsuc');
});

app.get('/api/:username', function(req, res, next) {

  if(!('jwt' in req.cookies) || !(jwtModule.verify(req.cookies.jwt, req.params.username))) {
    res.status(401).send("Unauthorized");
    return;
  } else {
    db.collection('Posts').find({'username': req.params.username},
    {fields:{_id: 0, username: 0}}).toArray(
    (err, result) => {
      res.status(200).json(result);
    }
  );
  }

  // console.log(jwtModule.verify(req.cookies.jwt, req.params.username));
  
});


app.get('/api/:username/:postid', function(req, res, next) {
  if(!('jwt' in req.cookies) || !(jwtModule.verify(req.cookies.jwt, req.params.username))) {
    res.status(401).send("Unauthorized");
    return;
  }
  db.collection('Posts').find({'username': req.params.username, 'postid': parseInt(req.params.postid)},
    {fields:{_id: 0, username: 0}}).toArray(
    (err, result) => {
      if(result.length === 0) {
        res.status(404);
        return;
      } else {
        res.status(200).json(result);
        
      }
      
    }
  );
});
app.post('/api/:username/:postid', (req, res, next) => {
  if(!('jwt' in req.cookies) && !(jwtModule.verify(req.cookies.jwt, req.params.username))) {
    res.status(401).send("Unauthorized");
    return;
  }
  // console.log(req.params);
  if((!'body' in req.body) || (!'title' in req.body)) {
    res.status(400).send("Bad Request");
  }
  // console.log(req.body.body);
  db.collection('Posts').find({'username':req.params.username, 'postid': req.params.postid}).toArray(
    (err, result) => {
      if(result.length != 0) {
        res.status(400).send("Bad Request");
        return;
      } else {
        var newPost = {'username': req.params.username, 'postid': req.params.postid,
        'created': Date.now(), 'modified': Date.now(), 'title': req.body.title,
        'body': req.body.body};
        db.collection('Posts').insertOne(newPost, (err, result) => {
          // console.log("inserting");
          if(err) {
            next();
          } else {
            res.status(201).send("Success");
          }
        });
      }
    } 
  );
});

app.put('/api/:username/:postid', (req, res, next) => {
  if(!('jwt' in req.cookies) || !(jwtModule.verify(req.cookies.jwt, req.params.username))) {
    res.status(401).send("Unauthorized");
    return;
  }
  // console.log(req.body);
  if((!'body' in req.body) || (!'title' in req.body)) {
    res.status(400).send("Bad Request");
    return;
  }
  // console.log(req.body.body);
  db.collection('Posts').find({'username':req.params.username, 'postid': req.params.postid}).toArray(
    (err, result) => {
      if(result.length === 0) {
        res.status(400).send("Bad Request");
        return;
        // next();
      } else {
        var newValue = { $set: {title: req.body.title, body: req.body.body,
          modified: Date.now()} };
        var query = {username: req.params.username, postid: req.params.postid};
        db.collection('Posts').updateOne(query, newValue, (err, result) => {
          if(err) {
            next();
          } else {
            res.status(201);
          }
        });
      }
    } 
  );
});

app.delete('/api/:username/:postid', (req, res, next) => {
  if(!('jwt' in req.cookies) || !(jwtModule.verify(req.cookies.jwt, req.params.username))) {
    res.status(401).send("Unauthorized");
    return;
  }
  var myquery = {username: req.params.username, postid: req.params.postid};
  db.collection('Posts').deleteOne(myquery, (err, result) => {
    if(err) {
      next();
    } 
    res.status(204).send("No content");
  });
});







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
