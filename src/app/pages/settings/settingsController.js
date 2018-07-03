/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.settings')
        .controller('SettingsController', SettingsController)

    /** @ngInject */
    function SettingsController($scope, $state, $http, $timeout, SettingsService, AlertService) {
        $scope.Settings = {
            seatCost: ''
        };

        $scope.getSeatCost = function () {
            SettingsService.getSeatCost().then(function (data) {
                $scope.Settings.seatCost = data.data.seatCost;
            }).catch(function (error) {
                $scope.Settings.seatCost = '';
            });
        };

        $scope.getSeatCost();

        $scope.loader = false;
        $scope.save = function () {
            var opts = {
                seatCost: $scope.Settings.seatCost,
            };
            $scope.loader = true;
            SettingsService.saveSeatCost(opts).then(function (data) {
                AlertService.success('settingmsg', data.message, 4000);
                $scope.Settings.seatCost = data.data.seatCost;                
                $scope.loader = false;
            }).catch(function (error) {
                $scope.loader = false;
                AlertService.error('settingmsg', error.message, 4000);
            });
        };
    }
})();