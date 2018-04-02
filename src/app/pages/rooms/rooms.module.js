(function () {
    'use strict';
    angular.module('BlurAdmin.pages.rooms', []).config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('rooms', {
                url: '/rooms',
                templateUrl: 'app/pages/rooms/views/layout.html',
                title: 'Rooms',
                sidebarMeta: {
                    icon: 'icon-drawer',
                    order: 1,
                },
                accessLevel: [2]
            })
            .state('viewroom', {
                url: '/room/{id}',
                templateUrl: 'app/pages/rooms/views/view.html',
                title: 'View Room',
                controller: 'ViewRoomsController',
            });
    }
})();
