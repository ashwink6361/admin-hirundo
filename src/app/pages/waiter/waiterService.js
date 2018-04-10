/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.waiter').service('WaiterService', WaiterService);
function WaiterService($q, $http) {
    var _waiterDetails = {};
    return {
        getWaiters: function() {
            var def = $q.defer();
            var url = '/api/waiter';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        addWaiter: function(opts) {
            var def = $q.defer();
            var url = '/api/waiter';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getWaiterDetail: function(id) {
            var def = $q.defer();
            var url = '/api/waiter/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateWaiter: function(id, opts) {
            var def = $q.defer();
            var url = '/api/waiter/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeWaiter: function(id) {
            var def = $q.defer();
            var url = '/api/waiter/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getWaiterDetails: function() {
            return _waiterDetails;
        },
        setWaiterDetails: function(data) {
            _waiterDetails = data;
        }
    };
}
})();
