/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/pages/settings/views/addSeat.html',
                title: 'Settings',
                controller: 'SettingsController',
                sidebarMeta: {
                    icon: 'icon-basket-loaded',
                    order: 2,
                },
                accessLevel: [2]
            });
    }
})();