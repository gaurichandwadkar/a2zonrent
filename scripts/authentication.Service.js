//Service that is responsible for Logging in the user. It also is responsible for setting,getting and clearing the user credentials.
(function () {
    'use strict';
	angular.module("a2zOnRentApp")
	.factory('AuthenticationService',AuthenticationService);
							
	AuthenticationService.$inject = ['$http', '$rootScope', '$timeout','$window', 'UserService'];
	function AuthenticationService($http, $rootScope, $timeout,$window, UserService) {
        var service = {};
 
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
		service.IsLoggedIn = IsLoggedIn;
		service.GetCurrentUser = GetCurrentUser;
        return service;
 
        function Login(username, password, callback) {
			var userData = {
				"username": username,
				"password":password
			}
			var req = {
						method: 'POST',
						url: 'https://api.a2zonrent.com/api/login',
						headers: {
						'Content-Type': 'application/json'
						},
						data: userData
					}
			$http(req)
			.success(function (data, status, headers, config){
				if(data.status == "success"){
					//Successful Login. Retain the token received for further API calls.
					SetCredentials(username, data.result)
				}
				callback(data);
			}).error(function (data, status, headers, config){
				//Something went wrong.
				callback(data);
			});
		}
		
		//Save the username, userId and token received in localStorage
		function SetCredentials(username,result) {
            $window.localStorage["username"] = username;
			$window.localStorage["userId"] = result.userId;
			$window.localStorage["token"] = result.token;
		}
		 
		 //Get the current user information in a structure
		 function GetCurrentUser(){
			 if($window.localStorage["token"]){
				 var currentUser = {username: $window.localStorage["username"],userId : $window.localStorage["userId"], token: $window.localStorage["token"]};
				 return currentUser;
			 }
			 return undefined;
		 }
 
		//Clear off the data, called during logout.
        function ClearCredentials() {
              $window.localStorage.clear();
         }
		 
		 //Returns whether the current user is already authenticated and logged in.
		 function IsLoggedIn(){
			var token = $window.localStorage["token"];
			if(token) {
				//not considering lifespan of the token.Keeping it simple.
				return true;
			} else {
				return false;
			}
		 }
			 	 
	}
})();