(function () {
'use strict';
    angular.module('BlurAdmin.pages.department', ['ui.select']).config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('staff', {
            url: '/staff',
            templateUrl: 'app/pages/department/views/layout.html',
            title: 'Staff',
            sidebarMeta: {
                icon: 'icon-people',
                order: 4,
            },
            accessLevel: [2]
        })
        .state('adddepartment', {
            url: '/department/add/:id',
            templateUrl: 'app/pages/department/views/add.html',
            title: 'Add Department',
            controller: 'AddDepartmentController',
      })
      .state('viewdepartment', {
            url: '/department/{id}',
            templateUrl: 'app/pages/department/views/view.html',
            title: 'View Department',
            controller: 'ViewDepartmentController',
      });
    }
})();
