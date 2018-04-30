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
        //Fetch Department list
        $scope.getDepartmentList = function () {
            DepartmentService.getDepartments().then(function (data) {
                $scope.departments = data.data;
            }).catch(function (error) {
                $scope.departments = [];
            });
        };

        $scope.searchCategories = function () {
            $scope.getDepartmentList();
        };

        $scope.getDepartmentList();

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
        $scope.itms = [];
        $scope.selectedCategories = [];

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
                console.log($scope.Department, '$scope.Department')
                for (var i = 0; i < $scope.Department.category.length; i++) {
                    $scope.selectedCategories.push($scope.Department.category[i]._id);
                    $scope.itms.push($scope.Department.category[i]);
                }
                console.log($scope.selectedCategories, '$scope.selectedCategories')
                if(!$scope.Department)
                    $state.go('staff');
            }
        });

        $scope.departmentAddRequest = false;
        $scope.addDepartment = function () {
            if (!$scope.selectedCategories.length) {
                AlertService.error('departmentmsg', "Please select category", 4000);
                return false;
            }
            var opts = {
                userName: $scope.Department.userName,
                password: $scope.Department.password,
                name: $scope.Department.firstName, 
                category: ($scope.selectedCategories.length) ? $scope.selectedCategories : [],                            
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
            if (!$scope.selectedCategories.length) {
                AlertService.error('departmentmsg', "Please select category", 4000);
                return false;
            }
            var opts = {
                name: $scope.Department.firstName,
                category: ($scope.selectedCategories.length) ? $scope.selectedCategories : [],                
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

        $scope.selectCategory = function (category) {
            console.log('category',category);
            if ($scope.selectedCategories.indexOf(category.selected._id) === -1) {
                $scope.selectedCategories.push(category.selected._id);
                $scope.itms.push({
                    _id: category.selected._id,
                    name: category.selected.name
                });
            }
        };

        $scope.removeCategory = function (indx, item) {
            if ($scope.selectedCategories.indexOf(item._id) > -1) {
                $scope.selectedCategories.splice(indx, 1);
                $scope.itms.splice(indx, 1);
            }
        };
    }
})();
