/**
 * @author p.baboo@huulke.com
 * created on 26.03.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.orders').directive('ordersList', ordersList);
    /** @ngInject */
    function ordersList() {
        return {
            restrict: 'EA',
            controller: 'OrderController',
            templateUrl: 'app/pages/orders/views/list.html'
        };
    }
})();
