/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.rooms',
    'BlurAdmin.pages.department',
    'BlurAdmin.pages.waiter',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.categories',
    "BlurAdmin.pages.change-password",
    'BlurAdmin.pages.orders',
    'BlurAdmin.pages.ingredient',
    'BlurAdmin.pages.settings',
    'BlurAdmin.pages.items',
    'BlurAdmin.pages.variants',
    'BlurAdmin.pages.admins'
  ]).config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, $translateProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    // baSidebarServiceProvider.addStaticItem({
    //   title: 'Pages',
    //   icon: 'ion-document',
    //   subMenu: [{
    //     title: 'Sign In',
    //     fixedHref: 'auth.html',
    //     blank: true
    //   }, {
    //     title: 'Sign Up',
    //     fixedHref: 'reg.html',
    //     blank: truey
    //   }, {
    //     title: 'User Profile',
    //     stateRef: 'profile'
    //   }, {
    //     title: '404 Page',
    //     fixedHref: '404.html',
    //     blank: true
    //   }]
    // });
    // baSidebarServiceProvider.addStaticItem({
    //   title: 'Menu Level 1',
    //   icon: 'ion-ios-more',
    //   subMenu: [{
    //     title: 'Menu Level 1.1',
    //     disabled: true
    //   }, {
    //     title: 'Menu Level 1.2',
    //     subMenu: [{
    //       title: 'Menu Level 1.2.1',
    //       disabled: true
    //     }]
    //   }]
    // });
  }

})();
