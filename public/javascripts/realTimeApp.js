var app = angular.module('realTime', ['ui.router', 'ngMaterial', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('detalle-proyecto', {
		  url: '/detalle-proyecto/{id}',
		  templateUrl: '/detalle-proyecto.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			post: ['$stateParams', 'projects', function($stateParams, projects) {
				return projects.getProject($stateParams.id);
			}]
		  }
		});
	
	$stateProvider
		.state('usuario', {
		  url: '/usuario/{id}',
		  templateUrl: '/usuario.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			post: ['$stateParams', 'projects', function($stateParams, projects) {
				return projects.getUser($stateParams.id);
			}]
		  }
		});
	
	$stateProvider
		.state('usuarios', {
		  url: '/usuarios',
		  templateUrl: '/usuarios.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			post: ['$stateParams', 'projects', function($stateParams, projects) {
				if(projects.users.length==0)
					return projects.getUsers();
			}]
		  }
		});
	
	$stateProvider
		.state('proyectos-publicos', {
		  url: '/proyectos-publicos',
		  templateUrl: '/proyectos-publicos.html',
		  controller: 'MainCtrl',
		  resolve: {
			postPromise: ['projects', function(projects){
			  return projects.getAllPublic();
			}]
		  }
		});
	
	$stateProvider
		.state('proyectos', {
		  url: '/proyectos',
		  templateUrl: '/proyectos.html',
		  controller: 'MainCtrl',
		  resolve: {
			postPromise: ['projects', function(projects){
				debugger;
				if(projects.users.length==0)
					projects.getUsers();
				return projects.getAll();
			}]
		  }
		});
		
	$stateProvider
		.state('agregar-proyectos', {
		  url: '/agregar-proyectos',
		  templateUrl: '/agregar-proyectos.html',
		  controller: 'ProjectsCtrl'
		});
		
	$stateProvider
		.state('editar-proyectos', {
		  url: '/agregar-proyectos/{id}',
		  templateUrl: '/agregar-proyectos.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			//if($stateParams.id != null)
			post: ['$stateParams', 'projects', function($stateParams, projects) {
			  return projects.get($stateParams.id);
			}]
		  }
		});
		
	$stateProvider
		.state('proyecto', {
		  url: '/proyecto/{id}',
		  templateUrl: '/proyecto.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			post: ['$stateParams', 'projects', function($stateParams, projects) {
				/*if(projects.users.length==0)
					projects.getUsers();*/
			  return projects.get($stateParams.id);
			}]
		  }
		});

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });

	$stateProvider
	.state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
	});
	
	$stateProvider
	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
	});
	
	$stateProvider
	.state('editar-usuario', {
	  url: '/register/{id}',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
		  resolve: {
			post: ['$stateParams', 'auth', function($stateParams, auth) {
			  return auth.currentPayload();
			}]
		  }
	});
	
  //$urlRouterProvider.otherwise('home');
}]);


app.controller('MainCtrl', [
'$scope',
'$state',
'auth',
'projects',
function($scope, $state, auth, projects){
  $scope.projects = projects.projects;
  debugger;
  if($state.current.name == "home")
	projects.users = [];
  
  $scope.myInterval = 3000;
  $scope.slides = [
    {
      image: 'http://lorempixel.com/1300/700/business',
	  text: 'Mientras se trabaja en grandes proyectos de desarrollo a gran escala todos los ingenieros de software se encuentran en algún momento, con la necesidad de utilizar un sistema de control de código fuente con el fin de añadir o revertir cambios en el código. Además que los proyectos de software que implican una multitud de programadores requieren de un sistema que permita la colaboración asíncrona para lograr un desarrollo exitoso. '
    },
    {
      image: 'http://lorempixel.com/1300/700/technics',
	  text: 'La tendencia de desarrollo tecnológico en la ingeniería de software ha ido mejorando, donde el diseño de software comenzó a moverse desde el escritorio a la web. Hoy en día, muchos IDEs (Entornos de Desarrollo Integrado)  existen en el mercado como Eclipse, Visual Studio, etc., pero IDEs basados en el escritorio todavía tienen significativas desventajas, como lo es el tiempo necesario para la configuración y la instalación de plugins necesarios para ejecutar el proyecto. Este problema podría ser una enorme pérdida de tiempo cuando hay muchos dispositivos que tienen que ser configurados. Muchas aplicaciones de software se han ejecutado en la nube, y el uso de un navegador web como una interfaz de usuario permite acceso ubicuo, colaboración instantánea, y evita la instalación y configuración en computadoras de escritorio'
    },
    {
      image: 'http://lorempixel.com/1300/700/people',
	  text: 'Una de las tecnologías que se utilizan para la colaboración instantánea es el uso del IDE (como la programación en parejas). La programación en parejas es la práctica de tener dos programadores que acceden y trabajan en el mismo código en un solo medio ambiente de desarrollo. En la programación en parejas, los programadores tienen la capacidad de crear, editar y borrar el código fuente en tiempo real. La programación en parejas podría resolver el problema de sincronización de código con el fin de mantenerlo vigente, y siempre que el código cambie cualquier programador que esté trabajando en el mismo proyecto podría ver quien realizó el cambio'
    },
    {
      image: 'http://lorempixel.com/1300/700/city',
	  text: 'Las tecnologías de colaboración podrían ayudar a los programadores a trabajar juntos mientras corrigen errores o discuten el programa en un mismo entorno único pero en diferentes áreas geográficas. Por lo tanto, es necesario hacer una aplicación que pueda mejorar el rendimiento en la etapa de desarrollo y ofrecer soluciones como la colaboración en tiempo real.'
    }
  ];

  
	
	$scope.deleteProject = function(id){
	  projects.delete(id).error(function(error){
		$scope.error = error;
		if(!$scope.error.message)
			$scope.error =
				new Object({message:"Ocurrió un error al eliminar el proyecto."});
			
		}).then(function(){
		  //$state.go('proyectos');
		  
		  $scope.error =
				new Object({message:"Proyecto eliminado correctamente."});
		  /*if(data.ok == 1)
				alert("Proyecto eliminado correctamente.");
			else
				alert("Ocurrió un error al eliminar el proyecto.");*/
	  });; 
	};
	
	$scope.viewUser = function(id){
		projects.getUser(id).then(function(){
		  
		  
	  });
	}
  
}])

app.controller('ProjectsCtrl', [
'$scope',
'$stateParams',
'projects',
'$state',
'auth',
function($scope, $stateParams, projects, $state, auth){
	$scope.iconos = [
	{ url: 'ico-agenda'},
	{ url: 'ico-blackboard'},
	{ url: 'ico-blackboard-eraser'},
	{ url: 'ico-book'},
	{ url: 'ico-briefcase'},
	{ url: 'ico-calendar'},
	{ url: 'ico-computer'},
	{ url: 'ico-ebook'},
	{ url: 'ico-file'},
	{ url: 'ico-folder'}];
	
	$scope.users = projects.users;
	for(i=0; i< projects.projects.length; i++){
		if(projects.projects[i]._id == $stateParams.id ){
			$scope.project = projects.projects[i];
			break;
		}
	}
	$scope.projectF = projects.project;
	$scope.user = projects.user;
	if($scope.user)
		$scope.user.colaboradorIndependiente = $scope.user.nombreInstitucion == 'Colaborador Independiente';
	
	var colaboradores = [];
	
	if($scope.project){
		$scope._id = $stateParams.id;
		$scope.nombre = $scope.project.nombre;
		$scope.descripcion = $scope.project.descripcion;
		$scope.icono = $scope.project.icono;
		$scope.privado = $scope.project.privado + "";
		$scope.colaboradores =  $scope.project.colaboradores;
		
		for(i=0; i< $scope.project.colaboradores.length; i++){
			for(j=0; j< $scope.users.length; j++){
				if($scope.project.colaboradores[i] == $scope.users[j]._id)
					colaboradores.push($scope.users[j]);
			}
		}
	}
	
	
	var cachedQuery, lastSearch, pendingSearch, cancelSearch = angular.noop;
	
	$scope.loadContacts = function(){
		return $scope.users;
		
		return [
			{image: 'Avatar1', name: 'jose', email: 'jose@gmail.com'},
			{image: 'Avatar2', name: 'antonio', email: 'antonio@gmail.com'},
			{image: 'Avatar3', name: 'juan', email: 'juan@gmail.com'},
			{image: 'Avatar4', name: 'pedro', email: 'pedro@gmail.com'},
			{image: 'Avatar5', name: 'miguel', email: 'miguel@gmail.com'},
			{image: 'Avatar6', name: 'jesus', email: 'jesus@gmail.com'}];
	}
	
	
	$scope.allContacts = $scope.loadContacts();
	$scope.contacts = colaboradores;
	$scope.filterSelected = false;
	
	$scope.querySearch = function(criteria){
		cachedQuery = criteria;
      return cachedQuery ? $scope.allContacts.filter(createFilterFor(cachedQuery)) : [];
	}
	function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(contact) {
        return (contact.username.toLowerCase().indexOf(lowercaseQuery) != -1);
      };

    }
	
	$scope.getUsers = function(){
		projects.getUsers();
	}
	
	
	$scope.addProject = function(){
		  if(!$scope.nombre || $scope.nombre === '' ||
			 !$scope.descripcion ||
			 !$scope.icono) { 
				$scope.error =
					new Object({message:"Por favor llene todos los campos"});
					return; 
		  }
		  project = {
			nombre: $scope.nombre,
			descripcion: $scope.descripcion,
			icono: $scope.icono,
			privado: $scope.privado,
			colaboradores: $scope.colaboradores
		  };
		  if($scope._id) 
			  project._id = $scope._id;
		  else {
			  project._id = null;
			  project.colaboradores = [auth.currentId()];
		  }
			  
	  
		  projects.create(project).error(function(error){
			$scope.error = error;
			if(!$scope.error.message)
				if($scope.error.indexOf("duplicate key") != -1)
					$scope.error =
						new Object({message:"El nombre del proyecto ya esta registrado, favor de intentar con otro nombre de proyecto."});
			
			}).then(function(){
				debugger;
				if(project._id){
					$state.go('proyectos');
				}
				else{
					var idProyectoActual = projects.projects[projects.projects.length-1]._id;
					var usuarioLogueado= auth.currentPayload();
					if(!usuarioLogueado.proyectos)
						usuarioLogueado.proyectos = [];
					usuarioLogueado.proyectos.push(idProyectoActual);
					auth.updateUserProjects(usuarioLogueado)
							.error(function(error){
								$scope.error = error;
								
							}).then(function(){
								debugger;
								$state.go('proyectos');
								
							});
				}
			});;
		  $scope.nombre = '';
		  $scope.descripcion = '';
		  $scope._id = null;
	};
	
	$scope.saveCollaborators = function(){
		
		proyecto = angular.copy($scope.project);
		usuariosTotales = $scope.users;
		proyecto.colaboradores = angular.copy($scope.contacts);
		debugger;
		
		proyecto.colaboradores.splice(0,0,auth.currentPayload());
	
		projects.create(proyecto).error(function(error){
			$scope.error = error;
			if(!$scope.error.message)
				if($scope.error.indexOf("duplicate key") != -1)
					$scope.error =
						new Object({message:"El nombre del proyecto ya esta registrado, favor de intentar con otro nombre de proyecto."});
			
			}).then(function(){
			  debugger;
				for(i=0; i < proyecto.colaboradores.length; i++){
					
					if(proyecto.colaboradores[i].proyectos.indexOf(proyecto._id) == -1) 
						proyecto.colaboradores[i].proyectos.push(proyecto._id);
					
					auth.updateUserProjects(proyecto.colaboradores[i])
						.error(function(error){
							debugger;
							$scope.error = error;
							if(!$scope.error.message)
								if($scope.error.indexOf("duplicate key") != -1)
									$scope.error =
										new Object({message:"El nombre de usuario ya esta registrado, favor de intentar con otro nombre de usuario."});
						}).then(function(){
							debugger;
							$scope.error =
								new Object({message:"Los colaboradores fueron agregados exitosamente."});
						});
				}
			});;
	};
	
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.user = {};
  if(auth.isLoggedIn()){
	  $scope.user  = auth.currentPayload();
  }
  
  if($scope.user)
		$scope.user.colaboradorIndependiente = $scope.user.nombreInstitucion == 'Colaborador Independiente';

  $scope.avatars = [
	{ url: 'Avatar1'},
	{ url: 'Avatar2'},
	{ url: 'Avatar3'},
	{ url: 'Avatar4'},
	{ url: 'Avatar5'},
	{ url: 'Avatar6'}];
  
  $scope.register = function(){
	if(!$scope.user._id) $scope.user._id = null;
	
	if($scope.user.colaboradorIndependiente) 
		$scope.user.nombreInstitucion = 'Colaborador Independiente';
	
    auth.register($scope.user).error(function(error){
		$scope.error = error;
		if(!$scope.error.message)
			if($scope.error.indexOf("duplicate key") != -1)
				$scope.error =
					new Object({message:"El nombre de usuario ya esta registrado, favor de intentar con otro nombre de usuario."});
		
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])


app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.currentAvatar = auth.currentAvatar;
  $scope.currentId = auth.currentId;
  $scope.logOut = auth.logOut;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

    auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	}

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.exp > Date.now() / 1000;
	  } else {
		return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
		auth.saveToken(data.token);
	  });
	};
	
	auth.updateUserProjects = function(user){
	  return $http.post('/updateUserProjects', user).success(function(data){
		console.log(data);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
		auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	  window.location.href = "/#/login";
	};
	
	auth.currentAvatar = function(){
	  if(auth.isLoggedIn()){
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.iconoAvatar;
	  }
	};
	
	auth.currentPayload = function(){
	  if(auth.isLoggedIn()){
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload;
	  }
	};
	
	auth.currentId = function(){
	  if(auth.isLoggedIn()){
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload._id;
	  }
	};
   
  return auth;
}])


app.factory('projects', ['$http', 'auth', function($http, auth){
	  var o = {
		projects: [],
		users: [],
		user: null,
		project: null
	  };
  
	o.getAll = function() {
		return $http.get('/projects',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		  angular.copy(data, o.projects);
		});
	};
	
	o.getAllPublic = function() {
		return $http.get('/allProjects',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		  angular.copy(data, o.projects);
		});
	};
	
  
	o.create = function(project) {
		return $http.post('/projects', project, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			o.projects.push(data);
		});
	};

	o.get = function(id) {
	  return $http.get('/projects/' + id).then(function(res){
			return res.data;
	  });
	};
	
	o.delete = function(id) {
		return $http.delete('/projects/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			console.log(data);
			
			var index;
			for(i=0; i<o.projects.length; i++){
				if(o.projects[i]._id == id){
					index = i;
					break;
				}
			};
			o.projects.splice(index, 1);
			
			/*if(data.ok == 1)
				alert("Proyecto eliminado correctamente.");
			else
				alert("Ocurrió un error al eliminar el proyecto.");*/
		});
	};
	
	o.getUsers = function() {
		return $http.get('/users',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		  for(i=0;i<data.length;i++){
			  if(data[i].iconoAvatar)
				  if( data[i].username != auth.currentUser())
					o.users.push(data[i]);
		  }
			
		  //angular.copy(data, o.users);
			for(i=0;i<o.users.length;i++){
				o.users[i].iconoAvatar = 
					"../images/" + o.users[i].iconoAvatar  +".png";
			}
		  
		});
	};
	
	o.getUser = function(id) {
	  return $http.get('/users/' + id).then(function(res){
		  o.user = res.data;
			return res.data;
	  });
	};
	
	o.getProject = function(id) {
	  return $http.get('/projects/' + id).then(function(res){
		  o.project = res.data;
			return res.data;
	  });
	};
  
  return o;
}]);