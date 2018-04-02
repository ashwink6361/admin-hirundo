/**
 * @author p.baboo@huulke.com
 * created on 16.12.2015
 */
(function () {
'use strict';
angular.module('ThyAdmin', []).controller('LoginPageController', LoginPageController);
    /** @ngInject */
    function LoginPageController($scope, $http, $timeout) {
        $scope.Admin  = {};
        $scope.loginSuccessMsg = '';
        $scope.loginErrorMsg = '';
        $scope.showLogin = true;
        $scope.forgetpassEmail = '';

        $scope.login = function(AdminUser) {
            $scope.loginErrorMsg = "";
            $scope.activeRequest = true;
            $http.post('/login', AdminUser).then(function (response) {
                console.log('response',response);
                $scope.loginSuccessMsg = "Login success!";
                localStorage.setItem('adminUser', JSON.stringify(response.data.data));
                localStorage.setItem('token', response.data.token);
                document.cookie = "session=" + response.data.token;
                $timeout(function () {
                    $scope.loginSuccessMsg = '';
                }, 4000);
                window.location = '/platform';
            }, function (error) {
                console.log("Error", error);
                $scope.activeRequest = false;
                $scope.loginErrorMsg = error.data.message;
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                $timeout(function () {
                    $scope.loginErrorMsg = '';
                }, 4000);
            });
        };

        $scope.showHideSection = function (type) {
            $scope.showLogin = type ? false : true;
        }

        $scope.forgetPassword = function(email) {
            $scope.forgotSuccessMsg = "";
            $scope.forgotErrorMsg = "";
            $scope.forgotRequest = true;
            $http.post('/forgetpassword', {email: email}).then(function (response) {
                $scope.forgotSuccessMsg = response.data.message;
                $timeout(function () {
                    $scope.forgotSuccessMsg = '';
                    $scope.forgotRequest = false;
                }, 4000);
            }, function (error) {
                $scope.forgotRequest = false;
                $scope.forgotErrorMsg = error.data.message;
                $timeout(function () {
                    $scope.forgotErrorMsg = '';
                }, 4000);
            });
        }
    }

})();
