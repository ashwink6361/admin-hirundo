(function () {
'use strict';
    angular.module('BlurAdmin.pages.waiter', []).config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        // .state('waiter', {
        //     url: '/waiter',
        //     templateUrl: 'app/pages/waiter/views/layout.html',
        //     title: 'Waiters',
        //     sidebarMeta: {
        //         icon: 'icon-people',
        //         order: 8,
        //     },
        //     accessLevel: [2]
        // })
        .state('addwaiter', {
            url: '/waiter/add/:id',
            templateUrl: 'app/pages/waiter/views/add.html',
            title: 'Add Waiter',
            controller: 'AddWaiterController',
      })
      .state('viewwaiter', {
            url: '/waiter/{id}',
            templateUrl: 'app/pages/waiter/views/view.html',
            title: 'View Waiter',
            controller: 'ViewWaiterController',
      });
    }
})();
