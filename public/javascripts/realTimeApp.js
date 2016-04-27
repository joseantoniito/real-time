var app = angular.module('realTime', ['ui.router'])



app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	/*$stateProvider
		.state('proyectos', {
		  url: '/proyectos',
		  templateUrl: '/proyectos.html',
		  controller: 'MainCtrl'
		});*/
		
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
      $state.go('proyectos');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('proyectos');
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

   
   auth.getAll = function() {
    return $http.get('/projects').success(function(data){
      angular.copy(data, o.posts);
    });
  };
   
  return auth;
}])


//app.factory('projects', ['$http', function($http){
app.factory('projects', ['$http', 'auth', function($http, auth){
  //var o = {};
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
			o.posts.push(data);
		});
	};

	o.get = function(id) {
	  return $http.get('/projects/' + id).then(function(res){
			return res.data;
	  });
	};
  
  return o;
}]);