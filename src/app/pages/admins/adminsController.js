/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.admins')
        .controller('AdminController', AdminController)
        .controller('AddAdminController', AddAdminController)
        .controller('ViewAdminController', ViewAdminController);

    /** @ngInject */
    function AdminController($scope, $state, $http, $timeout, AdminService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        //Fetch Admin list
        $scope.getAdminList = function (name, offset, itemsPerPage) {
            AdminService.getAdmins(name, offset, itemsPerPage).then(function (data) {
                $scope.admins = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.admins = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getAdminList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchCategories = function (name) {
            $scope.getAdminList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getAdminList($scope.name, $scope.offset, $scope.itemsPerPage);

        //Delete Admin
        $scope.removeAdmin = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                AdminService.removeAdmin(id).then(function (data) {
                    AlertService.success('adminlistmsg', data.message, 4000);
                    $scope.getAdminList();
                }).catch(function (error) {
                    AlertService.error('adminlistmsg', error.message, 4000);
                });
            }
        };
    
        //View Admin
        $scope.viewAdmin = function (id) {
            $state.go('viewadmin', {
                'id': id
            });
        };

        //Edit Admin
        $scope.updateAdmin = function (id) {
            $state.go('addadmin', {
                'id': id
            });
        }

    }

    function ViewAdminController($scope, $stateParams, $state, AdminService, AlertService) {
        var id = $stateParams.id;
        AdminService.getAdminDetail(id).then(function (data) {
            $scope.adminDetail = data.data;
        }).catch(function (error) {
            AlertService.error('adminlistmsg', error.message, 4000);
            $state.go('admins');
        });
    }

    function AddAdminController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, AdminService, AlertService) {
        $scope.adminId = $stateParams.id;
        if ($scope.adminId) {
            AdminService.getAdminDetail($scope.adminId).then(function (data) {
                $scope.Admin = data.data;
                $scope.adminPicture = $scope.Admin.logo;
            }).catch(function (error) {
                $state.go('admins');
            });
        }

        $scope.adminAddRequest = false;
        $scope.addAdmin = function () {
            var opts = {
                firstName: $scope.Admin.firstName,
                userName: $scope.Admin.userName,
                email: $scope.Admin.email,
                password: $scope.Admin.password
            };
            $scope.adminAddRequest = true;
            AdminService.addAdmin(opts).then(function (data) {
                $scope.adminAddRequest = false;
                $state.go('admins');
            }).catch(function (error) {
                $scope.adminAddRequest = false;
                AlertService.error('adminmsg', error.message, 4000);
            });
        };

        $scope.editAdmin = function () {
            var opts = {
                firstName: $scope.Admin.firstName,
            };
            $scope.adminAddRequest = true;
            AdminService.updateAdmin($scope.adminId, opts).then(function (data) {
                $scope.adminAddRequest = false;
                $state.go('admins');
            }).catch(function (error) {
                $scope.adminAddRequest = false;
                AlertService.error('adminmsg', error.message, 4000);
            });
        };
    }
})();
