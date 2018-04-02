/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.users').directive('usersList', usersList);
    /** @ngInject */
    function usersList() {
        return {
            restrict: 'EA',
            controller: 'UsersController',
            templateUrl: 'app/pages/users/views/list.html'
        };
    }
})();
