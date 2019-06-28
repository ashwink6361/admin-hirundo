/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.settings')
        .controller('SettingsController', SettingsController)

    /** @ngInject */
    function SettingsController($scope, $state, $http, _, $timeout, SettingsService, AlertService) {
        $scope._ = _;
        $scope.Settings = {
            seatCost: ''
        };
        $scope.devices = [];
        var deviceData = JSON.parse(localStorage.getItem('selectedDevice'));
        var devicesData = JSON.parse(localStorage.getItem('devices'));
        $scope.devices = devicesData ? devicesData : [];
        $scope.deviceSelected = deviceData ? deviceData : null; 
        $scope.deviceLoading = false;
        $scope.getSettings = function () {
            SettingsService.getSettings().then(function (data) {
                $scope.Settings.seatCost = data.data.seatCost;
                $scope.Settings.printer = data.data.printer;
            }).catch(function (error) {
                $scope.Settings.seatCost = '';
                $scope.Settings.printer = '';
            });
        };
        $scope.getDevices = function () {
        $scope.deviceLoading = true;            
            SettingsService.getDevices().then(function (data) {
                if($scope.devices.length){
                    if(data.data.length){
                        for(var i=0;i<data.data.length;i++){
                            $scope.devices.push(data.data[i]);
                        }
                    }
                }
                else{
                    $scope.devices = data.data;
                }
                $scope.devices = _.uniqBy($scope.devices, 'address');  
                localStorage.setItem('devices',JSON.stringify($scope.devices));
                $scope.deviceLoading = false;
            }).catch(function (error) {
                $scope.devices = [];
                $scope.deviceLoading = false;
            });
        };
        $scope.getSettings();
        $scope.getDevices();

        $scope.loader = false;
        $scope.save = function () {
            var opts = {
                seatCost: $scope.Settings.seatCost,
                printer: $scope.Settings.printer
            };
            $scope.loader = true;
            SettingsService.saveSettings(opts).then(function (data) {
                AlertService.success('settingmsg', data.message, 4000);
                $scope.Settings.seatCost = data.data.seatCost;
                $scope.Settings.printer = data.data.printer;
                $scope.loader = false;
            }).catch(function (error) {
                $scope.loader = false;
                AlertService.error('settingmsg', error.message, 4000);
            });
        };

        $scope.deviceChanged = function (device) {
            localStorage.removeItem('selectedDevice');            
            if (device) {
                localStorage.setItem('selectedDevice', JSON.stringify(device));
                $scope.deviceSelected = device;
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
    }
})();