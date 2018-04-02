/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.change-password').service('ChangePasswordService', ChangePasswordService);

    function ChangePasswordService($q, $http) {
        return {
            changePassword: function(opts) {
                var def = $q.defer();
                var url = '/api/user/change/password';
                doPut($q, $http, url, opts).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            }
        };
    }
})();
