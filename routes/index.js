var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    debugger;
	if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

function loggedIn(req, res, next) {
    if (req.payload.username) {
        next();
    } else {
        res.redirect('/#/login');
    }
}

router.get('/projects', auth, function(req, res, next) {
  Project.find(function(err, projects){
    if(err){ return next(err); }

    res.json(projects);
  });
});

router.post('/projects', auth, function(req, res, next) {
  var project = new Project(req.body);
  project.idUsuario =  req.payload._id;

  project.save(function(err, project){
    if(err){ return next(err); }

    res.json(project);
 });
});

router.param('project', function(req, res, next, id) {
  var query = Project.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/projects/:project', function(req, res) {
  res.json(req.post);
});


module.exports = router;
