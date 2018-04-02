/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.department').service('DepartmentService', DepartmentService);
function DepartmentService($q, $http) {
    var _departmentDetails = {};
    return {
        getDepartments: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/department';
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
        addDepartment: function(opts) {
            var def = $q.defer();
            var url = '/api/department';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getDepartmentDetail: function(id) {
            var def = $q.defer();
            var url = '/api/department/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateDepartment: function(id, opts) {
            var def = $q.defer();
            var url = '/api/department/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeDepartment: function(id) {
            var def = $q.defer();
            var url = '/api/department/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getDepartmentDetails: function() {
            return _departmentDetails;
        },
        setDepartmentDetails: function(data) {
            _departmentDetails = data;
        }
    };
}
})();
