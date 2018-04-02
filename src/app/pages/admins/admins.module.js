(function () {
'use strict';
    angular.module('BlurAdmin.pages.admins', []).config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('admins', {
            url: '/admins',
            templateUrl: 'app/pages/admins/views/layout.html',
            title: 'Restaurants',
            sidebarMeta: {
                icon: 'icon-cup',
                order: 2,
            },
            accessLevel: [1]
        })
        .state('addadmin', {
            url: '/admin/add/:id',
            templateUrl: 'app/pages/admins/views/add.html',
            title: 'Add Restaurant',
            controller: 'AddAdminController',
      })
      .state('viewadmin', {
            url: '/admin/{id}',
            templateUrl: 'app/pages/admins/views/view.html',
            title: 'View Restaurant',
            controller: 'ViewAdminController',
      });
    }
})();
