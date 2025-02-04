/**
 * @author p.baboo@huulke.com
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.home', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('login', {
            url: '/login',
            title: 'Thankyooh|Admin',
            templateUrl: 'app/pages/home/login.html',
            controller: 'LoginPageController',
        });
    }

})();
