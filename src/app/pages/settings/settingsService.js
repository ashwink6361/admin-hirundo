/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.settings').service('SettingsService', SettingsService);
function SettingsService($q, $http) {
    var _variantDetails = {};
    return {
        getSeatCost: function() {
            var def = $q.defer();
            var url = '/api/seatcost';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        saveSeatCost: function(opts) {
            var def = $q.defer();
            var url = '/api/seatcost';
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getDevices: function() {
            var def = $q.defer();
            var url = '/api/bluetooth/scan';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        connectDevice: function(opts) {
            var def = $q.defer();
            var url = '/api/bluetooth/connection';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
