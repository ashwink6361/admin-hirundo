/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.department').directive('departmentList',departmentList);
    /** @ngInject */
    function departmentList() {
        return {
            restrict: 'EA',
            controller: 'DepartmentController',
            templateUrl: 'app/pages/department/views/list.html'
        };
    }
})();
