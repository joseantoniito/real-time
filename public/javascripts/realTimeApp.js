var app = angular.module('realTime', ['ui.router', 'ngMaterial', 'ui.bootstrap'])

app.directive('disableAnimation', function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
});

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	//load projects
	$stateProvider
		.state('proyectos', {
		  url: '/proyectos',
		  templateUrl: '/proyectos.html',
		  controller: 'MainCtrl',
		  resolve: {
			postPromise: ['projects', function(projects){
			  return projects.getAll();
			}]
		  }
		});
		
	$stateProvider
		.state('agregar-proyectos', {
		  url: '/agregar-proyectos',
		  templateUrl: '/agregar-proyectos.html',
		  controller: 'MainCtrl'
		});
		
	$stateProvider
		.state('proyecto', {
		  url: '/proyecto/{id}',
		  templateUrl: '/proyecto.html',
		  controller: 'ProjectsCtrl',
		  resolve: {
			post: ['$stateParams', 'projects', function($stateParams, projects) {
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
	
  //$urlRouterProvider.otherwise('home');
}]);


app.controller('MainCtrl', [
'$scope',
'$state',
'auth',
'projects',
function($scope, $state, auth, projects){
  $scope.projects = projects.projects;

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

  $scope.addProject = function(){
	  if(!$scope.nombre || $scope.nombre === '') { return; }
	  projects.create({
		nombre: $scope.nombre,
		descripcion: $scope.descripcion,
	  }).then(function(){
		  $state.go('proyectos');
	  });;
	  $scope.nombre = '';
	  $scope.descripcion = '';
	};
	
	$scope.deleteProject = function(id){
	  projects.delete(id).then(function(){
		  $state.go('proyectos');
	  });; 
	};
  
}])

app.controller('ProjectsCtrl', [
'$scope',
'$stateParams',
'projects',
function($scope, $stateParams, projects){
	for(i=0; i< projects.projects.length; i++){
		if(projects.projects[i]._id == $stateParams.id ){
			$scope.project = projects.projects[i];
			break;
		}
	}
	
	//$scope.project = projects.projects[$stateParams.id];
	
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
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

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
		auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	  window.location.href = "/#/login";
	};
  
   
  return auth;
}])


app.factory('projects', ['$http', 'auth', function($http, auth){
	  var o = {
		projects: []
	  };
  
	o.getAll = function() {
		return $http.get('/projects',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
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
			}
			delete o.projects[index];
			
			if(data.ok == 1)
				alert("Proyecto eliminado correctamente.");
			else
				alert("Ocurrió un error al eliminar el proyecto.");
		});
	};
  
  return o;
}]);