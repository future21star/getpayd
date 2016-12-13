var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));
app.use('/', express.static(__dirname + '/../public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;


// Models
var User = require('./user.model.js');
var Content = require('./content.model.js');
var Reward = require('./reward.model.js');
var Department = require('./department.model.js');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');

  //authenticate user
  app.post('/authenticate', function(req, res){
      // find if any user matches login credentials
      User.findOne({email:req.body.email, password:req.body.password}, function(err, docs){
        if (err) return console.log(err);
        res.status(200).json(docs);
      });
    });

  //User
  // select all
  app.get('/users', function(req, res) {
    User.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  //get user
  app.get('/specific_user/:id', function(req, res) {
    User.findById(req.params.id, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  // create user
  app.post('/user', function(req, res) {
    var obj = new User(req.body);
    create_department(obj.department, function(obj1) {
      obj.department = obj1;
      obj.save(function(err, obj) {
        if(err) return console.error(err);
        res.status(200).json(obj);
      });
    });
  });
  // update by id
  app.put('/user/:id', function(req, res) {
    _id = req.params.id;
    delete req.body._id;
    User.findOneAndUpdate({_id: _id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });
  // delete by id
  app.delete('/user/:id', function(req, res) {
    User.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });
  //content
  //get all content
  app.get('/contents', function(req, res) {
    Content.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  //get content
  app.get('/content/:id', function(req, res) {
    Content.findById(req.params.id, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  // create content
  app.post('/content', function(req, res) {
    var obj = new Content(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);

      res.status(200).json(obj);
    });
  });
  // update by id
  app.put('/content/:id', function(req, res) {
    _id = req.params.id;
    delete req.body._id;
    Content.findOneAndUpdate({_id: _id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });
  //get available contents
  app.get('/get_available_contents/:department_v/:department_id/:department_name', function(req, res) {
    Content.find({available_to: {__v: Number(req.params.department_v), _id : req.params.department_id, department : req.params.department_name }}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  // delete by id
  app.delete('/content/:id', function(req, res) {
    Content.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });
  //reward
  //get all reward
  app.get('/rewards', function(req, res) {
    Reward.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  //get available rewards
  app.get('/get_available_rewards/:department_v/:department_id/:department_name', function(req, res) {
    Reward.find({available_to: {__v: Number(req.params.department_v), _id : req.params.department_id, department : req.params.department_name }}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  //get reward
  app.get('/reward/:id', function(req, res) {
    Reward.findById(req.params.id, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  // create reward
  app.post('/reward', function(req, res) {
    var obj = new Reward(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);

      res.status(200).json(obj);
    });
  });
  // update by id
  app.put('/reward/:id', function(req, res) {
    _id = req.params.id;
    delete req.body._id;
    Reward.findOneAndUpdate({_id: _id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });
  // delete by id
  app.delete('/reward/:id', function(req, res) {
    Reward.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });
  //department
  //get all departments
  app.get('/departments', function(req, res) {
    Department.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  // create department
  app.post('/department', function(req, res) {
    var obj = new Department(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });
  
  function create_department(department, cb) {
    let department_return = null;
    Department.findOne({department: department}, function(err, obj) {
        if (err) return console.errror(err);
        if (obj) {
          console.log("obj", obj);
          department_return = obj;
          return cb(obj);
        }
        else {
          var obj = new Department({department: department});
          obj.save(function(err, obj) {
            if (err) return console.errror(err);
            return cb(obj);
          });   
        }
    });
  }


  //Quizzes
  //get all quizzes
  app.get('/quizzes', function(req, res) {
    Quiz.find({}, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    });
  });
  //get by id
  app.get('/quiz/:id', function(req,res) {
    _id = req.params.id;
    Content.findOne({_id: _id}, function(err, obj) {
      if(err) return console.error(err);
      res.sendStatus(200).json(obj);
    })
  });
  // create quiz
  app.post('/quiz', function(req, res) {
    var obj = new Quiz(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });
  //send password reset email 
  app.post('/send_password_reset_email', function(req,res){
    console.log(req.body);
    var email   = require("../../node_modules/emailjs/email");
    var server  = email.server.connect({
       user:    "ptulr2016@gmail.com", 
       password:"dkzcviwerkzcv123", 
       host:    "smtp.gmail.com", 
       ssl:     true
    });
    // // send the message and get a callback with an error or details of the message that was sent
    server.send({
      text:    "We heard that you lost your GetPayd password. Sorry about that! But don’t worry! You can use the following link to reset your password: https://getpayd-demo-warzi117.c9users.io:8080/register/" + req.body["_id"], 
      from:    "ptulr2016@gmail.com", 
      to:      req.body["email"],
      subject: "testing emailjs"
    }, function(err, message) {  
      if(err)
        console.log(err);
      else
        res.json({success: true, msg: 'sent'});
    });
  });
  //send invitation email to user
  app.post('/send_invitation_to_user', function(req, res){
    var email   = require("../../node_modules/emailjs/email");
    var server  = email.server.connect({
      user:    "ptulr2016@gmail.com",
      password:"dkzcviwerkzcv123", 
      host:    "smtp.gmail.com", 
      ssl:     true
    });
    // send the message and get a callback with an error or details of the message that was sent
    server.send({
      text:    "We would like to invite you for our website. Please confirm at https://getpayd-demo-warzi117.c9users.io:8080/register/" + JSON.parse(req.body["_body"])._id + " to our website", 
      from:    "ptulr2016@gmail.com", 
      to:      JSON.parse(req.body["_body"])["email"],
      subject: "testing emailjs"
    }, function(err, message) {  
      if(err)
        console.log(err);
      else
        res.json({success: true, msg: 'sent'});
    });
  })

  // all other routes are handled by Angular
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/../../dist/index.html'));
  });

  app.listen(app.get('port'), function() {
    console.log('Angular 2 Full Stack listening on port '+app.get('port'));
  });
});


module.exports = app;