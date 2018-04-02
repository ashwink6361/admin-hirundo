(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ingredient', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      // .state('ingredient', {
      //   url: '/ingredient',
      //   templateUrl: 'app/pages/ingredients/views/layout.html',
      //   title: 'Ingredient',
      //   sidebarMeta: {
      //     icon: 'icon-chemistry',
      //     order: 5,
      //   },
      //   accessLevel: [2]
      // })
      .state('addingredient', {
        url: '/ingredient/add/:id',
        templateUrl: 'app/pages/ingredients/views/add.html',
        title: 'Add Ingredient',
        controller: 'AddIngredientController',
      })
      .state('viewingredient', {
        url: '/ingredient/{id}',
        templateUrl: 'app/pages/ingredients/views/view.html',
        title: 'View Ingredient',
        controller: 'ViewIngredientController',
      });
  }
})();