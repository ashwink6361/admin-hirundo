/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.profile').service('ProfileService', ProfileService);
function ProfileService($q, $http) {
    return {
        getDetails: function() {
            var def = $q.defer();
            var url = '/api/user';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },     
        updateProfile: function(opts) {
            var def = $q.defer();
            var url = '/api/user';
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        addProfilePicture: function(opts) {
            var def = $q.defer();
            var url = '/api/user/picture/upload';
            console.log(opts);
            doPostWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
