/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.items').directive('itemsList', itemsList);
    /** @ngInject */
    function itemsList() {
        return {
            restrict: 'EA',
            controller: 'ItemController',
            templateUrl: 'app/pages/items/views/list.html'
        };
    }
})();
