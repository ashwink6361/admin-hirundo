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
        $scope.devices = [];
        var deviceData = JSON.parse(localStorage.getItem('selectedDevice'));
        var devicesData = JSON.parse(localStorage.getItem('devices'));
        $scope.devices = devicesData ? devicesData : [];
        console.log('deviceData',deviceData);
        console.log(' $scope.devices', $scope.devices);
        $scope.deviceSelected = deviceData ? deviceData : null; 
        console.log('$scope.deviceSelected',$scope.deviceSelected);
        $scope.deviceLoading = false;
        $scope.getSeatCost = function () {
            SettingsService.getSeatCost().then(function (data) {
                $scope.Settings.seatCost = data.data.seatCost;
            }).catch(function (error) {
                $scope.Settings.seatCost = '';
            });
        };
        $scope.getDevices = function () {
        $scope.deviceLoading = true;            
            SettingsService.getDevices().then(function (data) {
                $scope.devices = data.data;
                localStorage.setItem('devices',JSON.stringify($scope.devices));
                $scope.deviceLoading = false;
            }).catch(function (error) {
                $scope.devices = [];
                $scope.deviceLoading = false;
            });
        };
        $scope.getSeatCost();
        $scope.getDevices();

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

        $scope.deviceChanged = function (device) {
            localStorage.removeItem('selectedDevice');            
            console.log('device',device);
            if (device) {
                delete device.$$hashKey;
                var temp = angular.copy(device);
                localStorage.setItem('selectedDevice', JSON.stringify(temp));
                $scope.deviceSelected = device;
                console.log('$scope.deviceSelected+++++++++++', $scope.deviceSelected);
                var opts = {
                    channel: device.channel,
                    address: device.address
                }
                SettingsService.connectDevice(opts).then(function (data) {
                    AlertService.success('settingmsg', data.message, 4000);
                }).catch(function (error) {
                    AlertService.error('settingmsg', error.message, 4000);
                });
            }
            else {
                localStorage.removeItem('selectedDevice');
                $scope.deviceSelected = null;
                $scope.getDevices();
            }
        };

        // $scope.deviceChanged = function (device) {
        //     console.log('device',device);
        //     if(device){
        //         SettingsService.connectDevice(device).then(function (data) {
        //             localStorage.setItem('selectedDevice',JSON.stringify(device));
        //             $scope.deviceSelected = device;
        //             console.log('$scope.deviceSelected+++++++++++',$scope.deviceSelected);                    
        //             AlertService.success('settingmsg', data.message, 4000);
        //         }).catch(function (error) {
        //             AlertService.error('settingmsg', error.message, 4000);
        //         });
        //     }
        //     else{
        //         localStorage.removeItem('selectedDevice');
        //         $scope.deviceSelected = null;
        //         $scope.getDevices();                
        //     }
        // };
    }
})();