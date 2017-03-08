    var a2zOnRentApp = angular.module('a2zOnRentApp', ['ngRoute']);
       
	 a2zOnRentApp.config(function($routeProvider) {
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'homeController'
            })

            // route for the login page
            .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            // route for the signup page
            .when('/signup', {
                templateUrl : 'pages/signup.html',
                controller  : 'signupController'
            })
			
			 .when('/update', {
                templateUrl : 'pages/signup.html',
                controller  : 'signupController'
            })
			 .otherwise({ redirectTo: '/login' });
			
    });

	a2zOnRentApp.run(run);
	
	 run.$inject = ['$rootScope', '$location', '$http','AuthenticationService'];
    function run($rootScope, $location, $http,AuthenticationService) {
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/signup']) === -1;
            var loggedIn = AuthenticationService.IsLoggedIn();
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
    
	//HomeController for the home page
    a2zOnRentApp.controller('homeController',['$scope','AuthenticationService', function($scope,AuthenticationService) {
       $scope.CurrentUser = AuthenticationService.GetCurrentUser();
    }]);

	//Controller for the login page
    a2zOnRentApp.controller('loginController',['$scope','$location','AuthenticationService',function($scope,$location,AuthenticationService) {
		(function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        $scope.submit= function() {
		    AuthenticationService.Login($scope.username, $scope.password, function (response) {
				if(response.status == "error"){
					$scope.message = response.error;
				}
				else
				$location.path('/');
            });
        }
	}]);

	//Controller for both creation and updating the user information.
    a2zOnRentApp.controller('signupController',['$scope','$http','UserService','AuthenticationService','$location',function($scope,$http,UserService,AuthenticationService,$location) {
		var currentUser = AuthenticationService.GetCurrentUser();
		$scope.registrationSuccess = false;
		if(currentUser){
			$scope.loggedIn = true;
			$scope.message1 = 'Here are your details, ' + currentUser.username;
			$scope.btnText = 'Update';
			UserService.GetById(currentUser.userId, currentUser.token)
			.then(function (response) {
                    if (response.status = 'success') {
						var data = response.result;
						$scope.user = data;
						$scope.username = data.username;
						$scope.firstname = data.firstname;
						$scope.lastname = data.lastname;
						$scope.email = data.email;
				    } else {
						$scope.message1 ="Someting went wrong";
                    }
                });
		}
		else
		{
			$scope.message1 = 'Sign up now!';
			$scope.message2 = 'Please enter the details below';
			$scope.btnText = 'Register';
		}
        
        $scope.submit = function() {
			var user = $scope.user||{};
			if($scope.loggedIn == true)
			{
				var userData = {
				"username": user.username,
				"firstname":user.firstname,
				"lastname": user.lastname,
				"email": user.email
				}
				UserService.Update(userData,currentUser.userId, currentUser.token)
					.then(function (response) {
						if (response.status == "success") {
							$scope.message1= "User Information updated successfully."
							
							$scope.updateSuccessful= true;
						  // $location.path('/');
						} else {
							$scope.message =response.error;
						}
					});
			}
			else{
			 var userData = {
				"username": user.username,
				"firstname": user.firstname,
				"lastname": user.lastname,
				"email": user.email,
				"nocode":true,
				"password":user.password
				}
				UserService.Create(userData)
					.then(function (response) {
						if (response.status=="success") {
							$scope.message1 = 'You registered successfully.';
							
							$scope.registrationSuccess = true;
							//$location.path('/login');
						} else {
							$scope.message =response.error;
						}
					});
			}
        }
		
		$scope.cancel =function(){
			 $location.path('/');
		}
    }]);