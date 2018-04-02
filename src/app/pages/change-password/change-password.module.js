/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
'use strict';

    angular.module('BlurAdmin.pages.change-password', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('changepassword', {
            url: '/changepassword',
            title: 'Change Password',
            templateUrl: 'app/pages/change-password/change-password.html',
            controller: 'ChangePasswordController',
        });
    }
})();
