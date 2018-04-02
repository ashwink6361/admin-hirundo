(function () {
'use strict';
    angular.module('BlurAdmin.pages.menu', []).config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('menu', {
            url: '/menu',
            templateUrl: 'app/pages/menu/views/layout.html',
            title: 'Menu',
            sidebarMeta: {
                icon: 'icon-list',
                order: 4,
            },
            accessLevel: [2]
        })
        .state('viewmenu', {
            url: '/menu/{id}',
            templateUrl: 'app/pages/menu/views/view.html',
            title: 'View Menu',
            controller: 'ViewMenuController',
        });
    }
})();
