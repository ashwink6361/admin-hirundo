/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('users', {
            url: '/users',
            templateUrl: 'app/pages/users/views/layout.html',
            title: 'Users',
            sidebarMeta: {
                icon: 'icon-user',
                order: 7,
            },
            accessLevel: [2]
        })
      .state('viewuser', {
            url: '/user/{id}',
            templateUrl: 'app/pages/users/views/view.html',
            title: 'View User',
            controller: 'ViewUserController',
      });
    }
  })();
