/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.items', ['ui.select']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        // .state('items', {
        //     url: '/items',
        //     templateUrl: 'app/pages/items/views/layout.html',
        //     title: 'Items',
        //     sidebarMeta: {
        //         icon: 'icon-notebook',
        //         order: 1,
        //     },
        //     accessLevel: [2]
        // })
        .state('additem', {
            url: '/item/add/:id',
            templateUrl: 'app/pages/items/views/add.html',
            title: 'Editor Menu',
            controller: 'AddItemController',
      })
      .state('viewitem', {
            url: '/item/{id}',
            templateUrl: 'app/pages/items/views/view.html',
            title: 'Editor Menu',
            controller: 'ViewItemController',
      });
    }
})();
