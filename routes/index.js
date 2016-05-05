var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/updateUserProjects', function(req, res, next){
  User.update(
		{_id : new ObjectId(req.body._id)}, 
		{
			proyectos: req.body.proyectos
		},  
		function(err, numAffected){
			if(err){ return next(err); }
			res.json({ok: 1});
		});
  
  
});

router.post('/register', function(req, res, next){
  if(!req.body.username || 
	!req.body.password ||
	!req.body.nombreCompleto ||
	!req.body.correoElectronico ||
	!req.body.iconoAvatar){
    return res.status(400).json({message: 'Por favor llene todos los campos'});
  }
  if(req.body.password != req.body.confirmPassword)
	  return res.status(400).json({message: 'La confirmación de contraseña no coincide, favor de intentar nuevamente.'});

  var user = new User();
  user._id = req.body._id;
  user.username = req.body.username;
  user.setPassword(req.body.password);
  
  user.nombreCompleto = req.body.nombreCompleto;
  user.nombreInstitucion = req.body.nombreInstitucion;
  user.correoElectronico = req.body.correoElectronico;
  user.iconoAvatar = req.body.iconoAvatar;
  
  if(user._id == null){
	  user.save(function (err){
		if(err){ 
			return next(err);
		}

		return res.json({token: user.generateJWT()})
	  });
  }
  else{
	  User.update(
			{_id : new ObjectId(user._id)}, 
			{
				//username : user.username, 
				hash : user.hash, 
				salt : user.salt, 
				nombreCompleto : user.nombreCompleto,
				nombreInstitucion : user.nombreInstitucion,
				correoElectronico : user.correoElectronico, 
				iconoAvatar : user.iconoAvatar,
				proyectos: user.proyectos
			},  
			function(err, numAffected){
				if(err){ return next(err); }
				res.json({token: user.generateJWT()});
			});
  }
  
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


router.get('/allProjects', auth, function(req, res, next) {
  Project.find({ privado: false },
	  function(err, projects){
		if(err){ return next(err); }

		res.json(projects);
	  });
});

router.get('/projects', auth, function(req, res, next) {
  Project.find({ idUsuario: new ObjectId(req.payload._id) },
	  function(err, projects){
		if(err){ return next(err); }

		res.json(projects);
	  });
});

router.post('/projects', auth, function(req, res, next) {
	var project = new Project(req.body);
	project.idUsuario =  req.payload._id;

	if(project._id == null){
		project.save(function(err, project){
			if(err){ return next(err); }

			res.json(project);
		 });
	}
	else
	{
		Project.update(
			{_id : new ObjectId(project._id)}, 
			{
				nombre : project.nombre, 
				descripcion : project.descripcion, 
				icono : project.icono,
				colaboradores : project.colaboradores
			},  
			function(err, numAffected){
				if(err){ return next(err); }
				res.json(project);
			});
	}
});

router.param('project', function(req, res, next, id) {
  var query = Project.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('No se encuentra el proyecto')); }

    req.post = post;
    return next();
  });
});

router.get('/projects/:project', function(req, res) {
  res.json(req.post);
});	

router.delete('/projects/:project', auth, function(req, res, next) {
  //res.json(req.post);
  
  Project.remove({_id : new ObjectId(req.post._id)},
		function(err, data){
		if(err){ return next(err); }

		res.json(data);
	  }
	);
});

/*router.delete('/projects/:id', auth, function(req, res, next) {
  var id = req.id;
  
  Project.find({ _id: new ObjectId(id) },
	  function(err, projects){
		if(err){ return next(err); }

		res.json(projects);
	  });
});*/

router.get('/users', auth, function(req, res, next) {
  User.find(
	  function(err, users){
		if(err){ return next(err); }

		res.json(users);
	  });
});

router.param('user', function(req, res, next, id) {
  var query = User.findById(id).populate('proyectos');

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('No se encuentra el usuario.')); }

    req.user = user;
    return next();
  });
});

router.get('/users/:user', function(req, res) {
  res.json(req.user);
});	

module.exports = router;
