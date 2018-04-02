/**
 * @author p.baboo@huulke.com
 * created on 16.12.2015
 */
(function () {
    'use strict';
    angular.module('ThyAdmin', []).controller('ResetPasswordController', ResetPasswordController)
    .config(['$locationProvider', function($locationProvider) { $locationProvider.html5Mode({ enabled: true, requireBase: false }); }])
        /** @ngInject */
        function ResetPasswordController($scope, $http, $timeout, $location) {
            $scope.Admin  = {};
            $scope.resetSuccessMsg = '';
            $scope.resetErrorMsg = '';
            $scope.access_token  = '';
                        
            $scope.resetPassword = function(Admin) {
                $scope.access_token = $location.search().token;
                console.log('$scope.access_token',$scope.access_token);
                localStorage.setItem('token', $scope.access_token);
                document.cookie = "session=" + $scope.access_token;
                $scope.resetErrorMsg = "";
                $scope.activeRequest = true;
                $http.put('/api/user/reset/password', Admin).then(function (response) {
                    console.log('response',response);
                    $scope.resetSuccessMsg = response.data.message;
                    $timeout(function () {
                        $scope.resetSuccessMsg = '';
                        window.location = '/';
                    }, 4000);
                }, function (error) {
                    console.log("Error", error);
                    $scope.activeRequest = false;
                    $scope.resetErrorMsg = error.data.message;
                    $timeout(function () {
                        $scope.resetErrorMsg = '';
                    }, 4000);
                });
            };
    
            
    
           
        }
    
    })();
    