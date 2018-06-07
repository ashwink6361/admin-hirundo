/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
'use strict';

  angular.module('BlurAdmin.pages.change-password').controller('ChangePasswordController', ChangePasswordController);
    /** @ngInject */
    function ChangePasswordController($scope, $state, $timeout, ChangePasswordService) {
        $scope.passSuccessMsg = '';
        $scope.passErrorMsg = '';
        $scope.updatePassword = function (data) {
            $scope.passErrorMsg = "";
            $scope.activeRequest = true;
            ChangePasswordService.changePassword(data).then(function (data) {
                $scope.passSuccessMsg = data.message;
                $timeout(function () {
                    $scope.passSuccessMsg = '';
                    $state.go('dashboard');
                }, 4000);
            }).catch(function (error) {
                $scope.activeRequest = false;
                $scope.passErrorMsg = error.message;
            });
        }
    }
})();
