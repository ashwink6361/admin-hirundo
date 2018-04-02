/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.admins').directive('adminsList', adminsList);
    /** @ngInject */
    function adminsList() {
        return {
            restrict: 'EA',
            controller: 'AdminController',
            templateUrl: 'app/pages/admins/views/list.html'
        };
    }
})();
