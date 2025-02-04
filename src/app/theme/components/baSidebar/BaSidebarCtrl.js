/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($scope,$rootScope, ProfileService, baSidebarService, CategoryService, baRoomService) {

    $scope.menuItems = baSidebarService.getMenuItems();
    $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
      var menuTopValue = 66;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden()) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
    $scope.accessLevel = JSON.parse(localStorage.getItem('adminUser')).adminType;

    $scope.selectedTab = function () {
      CategoryService.setActiveTab(0);
      baRoomService.setCreateModalCollapsed(false);
      localStorage.setItem('activeTab', 0);
    }
    
    ProfileService.getDetails().then(function (data) {
      $scope.adminProfile = data.data;
    }).catch(function (error) { });
    $rootScope.$on('profilePicUpdated', function () {
      ProfileService.getDetails().then(function (data) {
        $scope.adminProfile = data.data;
      }).catch(function (error) { });
    });
    
  }
})();
