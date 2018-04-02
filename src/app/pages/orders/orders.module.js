(function () {
    'use strict';
    angular.module('BlurAdmin.pages.orders', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('orders', {
            url: '/orders',
            templateUrl: 'app/pages/orders/views/layout.html',
            title: 'Orders',
            sidebarMeta: {
                icon: 'icon-basket-loaded',
                order: 2,
            },
            accessLevel: [2]
        });
    }
  })();
