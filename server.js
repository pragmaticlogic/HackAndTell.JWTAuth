var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Account = require('./models/account.js'),
    passwordCheck = require('./services/passwordCheck.js'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    _ = require('lodash'),
    cors = require('cors'),
    app = express();

app.use(bodyParser.json());
//app.use(cors());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});


//var db = mongoose.connect('mongodb://127.0.0.1:27017/jwtauth');

var db = mongoose.connect(process.env.DB);
var connection = db.connection;

connection.once('open', function() {  
  console.log('connect to database successfully ', process.env.DB);  
});

app.get('/', function(req, res) {
  res.send('app is running');  
});

app.post('/register', function(req, res) {
  var body = req.body;
  var account = new Account({
    username: body.username,
    password: body.password
  });
  
  var payload = {
    sub: account.username,
    exp: moment().add(10, 'days').unix()
  };
  var token = jwt.encode(payload, "xYz...");

  account.save(function(err) {
    //res.status(200).json(account.toJSON());
    res.status(200).json({
      user: account.username,
      token: token
    });
  });
});



app.post('/token', function(req, res) {
  var account = req.body;
  
  passwordCheck(account.username, account.password, function(err, isMatch) {
    if (err) res.status(500);
    
    if (!isMatch) 
      res.status(200).json({match: false})
    else {
      var payload = {
        sub: account.username,
        exp: moment().add(10, 'days').unix()
      };
      var token = jwt.encode(payload, "xYz...");
      
      res.status(200).json({
        user: account.username,
        token: token
      });
    }
  });
});

var server = app.listen(process.env.PORT, function() {
  console.log('Server listens on port ', server.address().port);
});





