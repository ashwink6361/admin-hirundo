/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories', ['autoCompleteModule','angucomplete-alt']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('editormenu', {
                url: '/menu',
                templateUrl: 'app/pages/categories/views/layout.html',
                title: 'Editor menu',
                sidebarMeta: {
                    icon: 'icon-notebook',
                    order: 3,
                },
                accessLevel: [2]
            })
            .state('addcategory', {
                url: '/category/add/:id',
                templateUrl: 'app/pages/categories/views/add.html',
                title: 'Add Category',
                controller: 'AddCategoryController',
            })
            .state('addsubcategory', {
                url: '/subcategory/add/:id',
                templateUrl: 'app/pages/categories/views/addSubcategory.html',
                title: 'Add Sub Category',
                controller: 'AddSubCategoryController',
            })
            .state('viewcategory', {
                url: '/category',
                templateUrl: 'app/pages/categories/views/view.html',
                title: 'View Sub Category',
                controller: 'ViewCategoryController',
            });
    }
})();
