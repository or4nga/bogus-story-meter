var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var handler = require('./request-handler.js');
// var cors = require('cors');
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();
var auth = require('./requestHandlers/auth.js');
var app = express();

// app.use(cors()); => at the moment CORS doesn't appear to be necessary (no errors thrown without it)

function authenticate(req, res, next) {
  if(req.session.key) {
    console.log('in authenticate function')
    next();
  }
};

app.use(session({
    secret: 'nosuchagency',
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl :  260}),
    saveUninitialized: false,
    resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth/', auth);

app.get('/urlvote/:urlId', handler.getUrlVotes);

app.post('/urlvote', handler.postUrlVotes);

app.put('/urlvote', handler.putUrlVotes);

app.get('/urldata', handler.getUrlData);

app.post('/urlcomment', handler.postUrlComment);

app.get('/useractivity', handler.getUserActivity);

app.get('/stats/generate-retrieve', handler.generateRetrieveStatsPageUrl);

app.post('/auth/signup', handler.signup);

app.get('/urlstats', handler.getUrlStats);

app.get('/urlcomments', handler.getUrlComments);

// app.post('/auth/login', handler.login);

app.get('/auth/logout', handler.logout);

app.get('/auth/getStatus', handler.getAuthStatus);

// TODO => for the below route send a 404 error if the corresponding url doesn't exist in the DB:

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/home', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/profile', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/login', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

module.exports = app;
