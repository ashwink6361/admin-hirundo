/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.waiter')
        .controller('WaiterController', WaiterController)
        .controller('AddWaiterController', AddWaiterController)
        .controller('ViewWaiterController', ViewWaiterController);

    /** @ngInject */
    function WaiterController($scope, $state, $http, $timeout, WaiterService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        //Fetch Waiter list
        $scope.getWaiterList = function (name, offset, itemsPerPage) {
            WaiterService.getWaiters(name, offset, itemsPerPage).then(function (data) {
                $scope.waiters = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.waiters = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getWaiterList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchCategories = function (name) {
            $scope.getWaiterList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getWaiterList($scope.name, $scope.offset, $scope.itemsPerPage);

        //Delete Waiter
        $scope.removeWaiter = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                WaiterService.removeWaiter(id).then(function (data) {
                    AlertService.success('waiterlistmsg', data.message, 4000);
                    $scope.getWaiterList();
                }).catch(function (error) {
                    AlertService.error('waiterlistmsg', error.message, 4000);
                });
            }
        };
    
        //View Waiter
        $scope.viewWaiter = function (data, id) {
            WaiterService.setWaiterDetails(data);
            $state.go('viewwaiter', {
                'id': id
            });
        };

        //Edit Waiter
        $scope.updateWaiter = function (data, id) {
            WaiterService.setWaiterDetails(data);
            $state.go('addwaiter', {
                'id': id
            });
        };
    }

    function ViewWaiterController($scope, $stateParams, $state, WaiterService, AlertService) {
        var id = $stateParams.id;
        $scope.waiterDetail = WaiterService.getWaiterDetails();
        if(!$scope.waiterDetail)
            $state.go('staff');
    }

    function AddWaiterController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, WaiterService, AlertService) {
        $scope.waiterId = $stateParams.id;
        if ($scope.waiterId) {
            $scope.Waiter = WaiterService.getWaiterDetails();
            if(!$scope.Waiter)
                $state.go('staff');
        }

        $scope.waiterAddRequest = false;
        $scope.addWaiter = function () {
            var opts = {
                firstName: $scope.Waiter.firstName,
                lastName: $scope.Waiter.lastName,
                userName: $scope.Waiter.userName,
                password: $scope.Waiter.password,
                deviceType: 'web',
                deviceId: '',
                deviceToken: ''
            };
            $scope.waiterAddRequest = true;
            WaiterService.addWaiter(opts).then(function (data) {
                $scope.waiterAddRequest = false;
                $state.go('staff');
            }).catch(function (error) {
                $scope.waiterAddRequest = false;
                AlertService.error('waitermsg', error.message, 4000);
            });
        };

        $scope.editWaiter = function () {
            var opts = {
                firstName: $scope.Waiter.firstName,
                lastName: $scope.Waiter.lastName,
                deviceType: 'web',
                deviceId: '',
                deviceToken: ''
            };
            $scope.waiterAddRequest = true;
            WaiterService.updateWaiter($scope.waiterId, opts).then(function (data) {
                $scope.waiterAddRequest = false;
                $state.go('staff');
            }).catch(function (error) {
                $scope.waiterAddRequest = false;
                AlertService.error('waitermsg', error.message, 4000);
            });
        };
    }
})();
