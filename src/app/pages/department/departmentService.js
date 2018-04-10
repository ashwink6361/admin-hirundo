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
        getDepartments: function() {
            var def = $q.defer();
            var url = '/api/department';
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
