/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components').directive('pageTop', pageTop);

    /** @ngInject */
    function pageTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/pageTop/pageTop.html',
            controller: function ($scope, $translate, $rootScope, ProfileService) {
                $scope.currentlan = 'en';
                ProfileService.getDetails().then(function (data) {
                    $scope.adminProfile = data.data;
                }).catch(function (error) {});
                $rootScope.$on('profilePicUpdated', function () {
                    ProfileService.getDetails().then(function (data) {
                        $scope.adminProfile = data.data;
                    }).catch(function (error) {});
                });
                $scope.logout = function () {
                    localStorage.removeItem('adminUser');
                    localStorage.removeItem('token');
                    window.localStorage.clear();
                    window.location = '/';
                }
                $scope.changeLanguage = function (langKey) {
                    $scope.currentlan = langKey;
                    $rootScope.$broadcast('currentlan');        
                    $translate.use(langKey);
                };
            }
        };
    }

})();
