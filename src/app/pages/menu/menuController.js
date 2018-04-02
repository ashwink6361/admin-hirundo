/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.menu')
        .controller('menuController', menuController)
        .controller('ViewMenuController', ViewMenuController);

    /** @ngInject */
    function menuController($scope, $state, $http, $timeout, AlertService, MenuService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        //Fetch Feedback list
        $scope.getMenuList = function (name, offset, itemsPerPage) {
            MenuService.getMenu(name, offset, itemsPerPage).then(function (data) {
                $scope.menu = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.menu = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getMenuList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.getMenuList($scope.name, $scope.offset, $scope.itemsPerPage);
    
        //View Menu
        $scope.viewMenu = function (id) {
            $state.go('viewmenu', {
                'id': id
            });
        };
    }

    function ViewMenuController($scope, $stateParams, $state, MenuService, AlertService) {
        $scope.form = {};
        $scope.Menu = {};
        $scope.menuId = $stateParams.id;
        MenuService.getMenuDetail($scope.menuId).then(function (data) {
            $scope.menuDetail = data.data;
        }).catch(function (error) {
            AlertService.error('menulistmsg', error.message, 4000);
            $state.go('menu');
        });
    }
})();
