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
        //Fetch Waiter list
        $scope.getWaiterList = function () {
            WaiterService.getWaiters().then(function (data) {
                $scope.waiters = data.data;
            }).catch(function (error) {
                $scope.waiters = [];
            });
        };

        $scope.getWaiterList();

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
    
        $scope.viewWaiter = function (data, id) {
            WaiterService.setWaiterDetails(data);
            $state.go('viewwaiter', {
                'id': id
            });
        };

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
        var tempUser = JSON.parse(localStorage.getItem('adminUser'));
        $scope.tempUserName = tempUser.userName;
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
                userName: $scope.tempUserName +'-'+ $scope.Waiter.userName,
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
