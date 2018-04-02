/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.department')
        .controller('DepartmentController', DepartmentController)
        .controller('AddDepartmentController', AddDepartmentController)
        .controller('ViewDepartmentController', ViewDepartmentController);

    /** @ngInject */
    function DepartmentController($scope, $state, $http, $timeout, DepartmentService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 100;
        $scope.currentPage = 1;
        //Fetch Department list
        $scope.getDepartmentList = function (name, offset, itemsPerPage) {
            DepartmentService.getDepartments(name, offset, itemsPerPage).then(function (data) {
                $scope.departments = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.departments = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getDepartmentList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchCategories = function (name) {
            $scope.getDepartmentList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getDepartmentList($scope.name, $scope.offset, $scope.itemsPerPage);

        //Delete Department
        $scope.removeDepartment = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                DepartmentService.removeDepartment(id).then(function (data) {
                    AlertService.success('departmentlistmsg', data.message, 4000);
                    $scope.getDepartmentList();
                }).catch(function (error) {
                    AlertService.error('departmentlistmsg', error.message, 4000);
                });
            }
        };
    
        //View Department
        $scope.viewDepartment = function (data, id) {
            DepartmentService.setDepartmentDetails(data);
            $state.go('viewdepartment', {
                'id': id
            });
        };

        //Edit Department
        $scope.updateDepartment = function (data, id) {
            DepartmentService.setDepartmentDetails(data);
            $state.go('adddepartment', {
                'id': id
            });
        };
    }

    function ViewDepartmentController($scope, $stateParams, $state, DepartmentService, AlertService) {
        var id = $stateParams.id;
        $scope.departmentDetail = DepartmentService.getDepartmentDetails();
        if(!$scope.departmentDetail)
            $state.go('staff');
    }

    function AddDepartmentController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, DepartmentService, ItemService, AlertService) {
        $scope.departmentId = $stateParams.id;
        $q.all([
            ItemService.getCategories()
        ]).then(function (data) {
            var categories = data[0].data;
            $scope.categories = [];
            for(var i=0; i<categories.length; i++) {
                $scope.categories.push({
                    _id: categories[i]._id,
                    name: categories[i].name,
                });
            }
            if ($scope.departmentId) {
                $scope.Department = DepartmentService.getDepartmentDetails();
                if(!$scope.Department)
                    $state.go('staff');
            }
        });

        $scope.departmentAddRequest = false;
        $scope.addDepartment = function () {
            var opts = {
                userName: $scope.Department.userName,
                password: $scope.Department.password,
                name: $scope.Department.firstName, 
                category: $scope.Department.category,               
                deviceType: 'web',
                deviceId: '',
                deviceToken: ''
            };
            $scope.departmentAddRequest = true;
            DepartmentService.addDepartment(opts).then(function (data) {
                $scope.departmentAddRequest = false;
                $state.go('staff');
            }).catch(function (error) {
                $scope.departmentAddRequest = false;
                AlertService.error('departmentmsg', error.message, 4000);
            });
        };

        $scope.editDepartment = function () {
            var opts = {
                name: $scope.Department.firstName,
                category: $scope.Department.category,               
                deviceType: 'web',
                deviceId: '',
                deviceToken: ''
            };
            $scope.departmentAddRequest = true;
            DepartmentService.updateDepartment($scope.departmentId, opts).then(function (data) {
                $scope.departmentAddRequest = false;
                $state.go('staff');
            }).catch(function (error) {
                $scope.departmentAddRequest = false;
                AlertService.error('departmentmsg', error.message, 4000);
            });
        };
    }
})();
