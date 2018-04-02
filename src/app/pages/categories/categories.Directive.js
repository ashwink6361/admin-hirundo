/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.categories').directive('categoriesList', categoriesList);
    /** @ngInject */
    function categoriesList() {
        return {
            restrict: 'EA',
            controller: 'CategoryController',
            templateUrl: 'app/pages/categories/views/list.html'
        };
    }
})();
