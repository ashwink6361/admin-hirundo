/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.admins').service('AdminService', AdminService);
function AdminService($q, $http) {
    return {
        getAdmins: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/admins';
            if(name) {
                url += '?name='+name;
            }
            if(offset) {
                if(url.indexOf("?") > -1) {
                    url += '&offset='+offset;
                } else {
                    url += '?offset='+offset;
                }
            }
            if(limit) {
                if(url.indexOf("?") > -1) {
                    url += '&limit='+limit;
                } else {
                    url += '?limit='+limit;
                }
            }
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        addAdmin: function(opts) {
            var def = $q.defer();
            var url = '/api/admins';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getAdminDetail: function(id) {
            var def = $q.defer();
            var url = '/api/admins/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateAdmin: function(id, opts) {
            var def = $q.defer();
            var url = '/api/admins/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeAdmin: function(id) {
            var def = $q.defer();
            var url = '/api/admins/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
