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
        $scope.loginErrorMsgResend = '';        
        $scope.showLogin = true;
        $scope.showResend = false;
        
        $scope.forgetpassEmail = '';

        $scope.login = function(AdminUser) {
            $scope.loginErrorMsg = "";
            $scope.activeRequest = true;
            $http.post('/login', AdminUser).then(function (response) {
                $scope.loginSuccessMsg = "Login success!";
                localStorage.setItem('adminUser', JSON.stringify(response.data.data));
                localStorage.setItem('token', response.data.token);
                document.cookie = "session=" + response.data.token;
                $timeout(function () {
                    $scope.loginSuccessMsg = '';
                }, 4000);
                window.location = '/platform';
            }, function (error) {
                $scope.activeRequest = false;
                if(error.data.message == 'This activation link account is expired. Please request a new one.'){
                    $scope.loginErrorMsgResend = error.data.message;
                    $scope.loginErrorMsg = '';                                        
                }
                else{
                    $scope.loginErrorMsg = error.data.message;    
                    $scope.loginErrorMsgResend = '';                                                                
                }
                localStorage.removeItem('adminUser');
                localStorage.removeItem('token');
                if($scope.loginErrorMsgResend != ''){
                    $timeout(function () {
                        $scope.loginErrorMsgResend = '';
                    }, 10000);
                }
                if($scope.loginErrorMsg != ''){
                    $timeout(function () {
                        $scope.loginErrorMsg = '';
                    }, 4000);
                }
            });
        };

        $scope.showHideSection = function (type) {
            $scope.showLogin = type ? false : true;
            $scope.showResend = false;            
        }

        $scope.showResetSection = function () {
            $scope.showLogin = false;
            $scope.showResend = true;
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

        $scope.resendLink = function(email) {
            $scope.resendSuccessMsg = "";
            $scope.resendErrorMsg = "";
            $scope.resendRequest = true;
            $http.put('/api/resend/link/'+email).then(function (response) {
                $scope.resendSuccessMsg = response.data.message;
                $timeout(function () {
                    $scope.resendSuccessMsg = '';
                    $scope.resendRequest = false;
                }, 4000);
            }, function (error) {
                $scope.resendRequest = false;
                $scope.resendErrorMsg = error.data.message;
                $timeout(function () {
                    $scope.resendErrorMsg = '';
                }, 4000);
            });
        }
        
    }

})();
