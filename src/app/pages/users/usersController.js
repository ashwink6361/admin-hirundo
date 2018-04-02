/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.users')
        .controller('UsersController', UsersController)
        .controller('ViewUserController', ViewUserController)

    /** @ngInject */
    function UsersController($scope, $state, $http, $timeout, UserService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        //Fetch Users list
        $scope.getUserList = function (name, offset, itemsPerPage) {
            UserService.getUsers(name, offset, itemsPerPage).then(function (data) {
                $scope.users = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.users = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getUserList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchUsers = function (name) {
            $scope.getUserList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getUserList($scope.name, $scope.offset, $scope.itemsPerPage);

        //View User
        $scope.viewUser = function (id) {
            $state.go('viewuser', {
                'id': id
            });
        };
    }

    function ViewUserController($scope, $stateParams, $state, UserService, AlertService) {
        var id = $stateParams.id;
        UserService.getUserDetail(id).then(function (data) {
            $scope.userDetail = data.data;
        }).catch(function (error) {
            AlertService.error('userslistmsg', error.message, 4000);
            $state.go('users');
        });
    }
})();
