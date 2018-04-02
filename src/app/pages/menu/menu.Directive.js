/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.menu').directive('menuList', menuList);
    /** @ngInject */
    function menuList() {
        return {
            restrict: 'EA',
            controller: 'menuController',
            templateUrl: 'app/pages/menu/views/list.html'
        };
    }
})();
