//User Service responsible for CRUD operations.

(function () {
    'use strict';
	angular.module("a2zOnRentApp")
	.factory('UserService',UserService);
							
	UserService.$inject = ['$http'];
	function UserService($http) {
		var service = {};
		service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
		
        return service;
		
		//Get User by Id
		function GetById(id, token){
			var req = {
						method: 'GET',
						url: 'https://api.a2zonrent.com/api/users/'+id + '?authtoken='+ token,
						headers: {
						'Content-Type': 'application/json'
						}
						}
			return $http(req).then(handleSuccess, handleError('Error fetching user'))
		}
		
		//Makes a call to create new user
		function Create(user){
			var req = {
						method: 'POST',
						url: 'https://api.a2zonrent.com/api/register',
						headers: {
						'Content-Type': 'application/json'
						},
						data: user
					}
			return $http(req).then(handleSuccess, handleError('Error creating user'));
		}
		
		//Updates existing user information
		function Update(user,id,token){
			var req = {
						method: 'PUT',
						url: 'https://api.a2zonrent.com/api/users/'+id + '?authtoken='+ token,
						headers: {
						'Content-Type': 'application/json'
						},
						data: user
					}
			return $http(req).then(handleSuccess, handleError('Error updating user'));
		}
		
		
		function Delete(id){
			//Not implemented.Not required in the context of this assignment.
		}
		
		 function handleSuccess(res) {
			 return res.data;
        }
 
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
	}
})();