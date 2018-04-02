/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.waiter').directive('waiterList', waiterList);
    /** @ngInject */
    function waiterList() {
        return {
            restrict: 'EA',
            controller: 'WaiterController',
            templateUrl: 'app/pages/waiter/views/list.html'
        };
    }
})();
