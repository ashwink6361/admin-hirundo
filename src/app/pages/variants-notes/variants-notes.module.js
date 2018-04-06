/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.variants', ['ui.select']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('variant', {
            url: '/variant',
            templateUrl: 'app/pages/variants-notes/views/list.html',
            title: 'Editor Menu',
            controller: 'VariantController',
        })
            .state('addvariant', {
                url: '/variant/add/:id',
                templateUrl: 'app/pages/variants-notes/views/add.html',
                title: 'Editor Menu',
                controller: 'AddVariantController',
            })
            .state('viewvariant', {
                url: '/variant/{id}',
                templateUrl: 'app/pages/variants-notes/views/view.html',
                title: 'Editor Menu',
                controller: 'ViewVariantController',
            });
    }
})();