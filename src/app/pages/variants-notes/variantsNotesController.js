/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
        angular.module('BlurAdmin.pages.variants')
            .controller('VariantController', VariantController)
            .controller('AddVariantController', AddVariantController)
            .controller('ViewVariantController', ViewVariantController);
    
        /** @ngInject */
        function VariantController($scope, $state, $http, $timeout, VariantService, AlertService) {
            $scope.name = '';
            $scope.offset = 0;
            $scope.itemsPerPage = 10;
            $scope.currentPage = 1;
            //Fetch Variant list
            $scope.getVariantList = function (name, offset, itemsPerPage) {
                VariantService.getVariants(name, offset, itemsPerPage).then(function (data) {
                    $scope.variants = data.data;
                    $scope.totalCount = data.totalCount;
                    $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
                }).catch(function (error) {
                    $scope.variants = [];
                });
            };
    
            $scope.goToPage = function (pageNumber) {
                $scope.currentPage = pageNumber;
                $scope.getVariantList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
            };
    
            $scope.searchCategories = function (name) {
                $scope.getVariantList(name, $scope.offset, $scope.itemsPerPage);
            };
    
            $scope.getVariantList($scope.name, $scope.offset, $scope.itemsPerPage);
    
            //Delete Variant
            $scope.removeVariant = function (id) {
                var result = confirm("Do you really want to delete?");
                if (result) {
                    VariantService.removeVariant(id).then(function (data) {
                        AlertService.success('variantlistmsg', data.message, 4000);
                        $scope.getVariantList();
                    }).catch(function (error) {
                        AlertService.error('variantlistmsg', error.message, 4000);
                    });
                }
            };
        
            //View Variant
            $scope.viewVariant = function (id) {
                $state.go('viewvariant', {
                    'id': id
                });
            };
    
            //Edit Variant
            $scope.updateVariant = function (data, id) {
                VariantService.setVariantDetails(data);
                $state.go('addvariant', {
                    'id': id
                });
            };
        }
    
        function ViewVariantController($scope, $stateParams, $state, VariantService, AlertService) {
            var id = $stateParams.id;
            // $scope.variantDetail = VariantService.getVariantDetails();
            // if(!$scope.variantDetail)
            //     $state.go('variant');

                VariantService.getVariantDetail(id).then(function(data) {
                    $scope.variantDetail = data.data;
                }).catch(function (error) {
                    $state.go('variant');
                });
        }
    
        function AddVariantController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, VariantService, AlertService) {
            $scope.variantId = $stateParams.id;
            $scope.Variant = {};
            $scope.subCategories = [];

            $q.all([
                VariantService.getCategories(),
            ]).then(function (data) {
                $scope.categories = data[0].data;
                $scope.sub = [];
                for (var i = 0; i < $scope.categories.length; i++) {
                    $scope.sub[$scope.categories[i]._id] = $scope.categories[i].subCategory;
                }
                // if ($scope.variantId) {
                //     $scope.Variant = VariantService.getVariantDetails();
                // console.log('$scope.Variant',$scope.Variant);
                    
                //     $scope.Variant.category = $scope.Variant.category._id;
                //     $scope.subCategories = $scope.sub[$scope.Variant.category];
                //     if(!$scope.Variant)
                //     $state.go('variant');
                // }


                if ($scope.variantId) {
                    VariantService.getVariantDetail($scope.variantId).then(function (data) {
                        $scope.Variant = data.data;
                console.log('$scope.Variant',$scope.Variant);
                        
                        $scope.Variant.category = $scope.Variant.category._id;
                        $scope.subCategories = $scope.sub[$scope.Variant.category];
                    }).catch(function (error) {
                        $state.go('variant');
                    });
                }
            });

            $scope.categoryChanged = function (category) {
                $scope.Variant.subCategory = '';
                $scope.subCategories = $scope.sub[category];
            };

            $scope.variantAddRequest = false;
            $scope.addVariant = function () {
                var opts = {
                    name: $scope.Variant.name,
                    notes: $scope.Variant.notes? $scope.Variant.notes : '',
                    price: $scope.Variant.price,  
                    category: $scope.Variant.category ? $scope.Variant.category : '',
                    subCategory: $scope.Variant.subCategory ? $scope.Variant.subCategory : ''            
                };
                console.log('opts',opts);
                $scope.variantAddRequest = true;
                VariantService.addVariant(opts).then(function (data) {
                    $scope.variantAddRequest = false;
                    $state.go('variant');
                }).catch(function (error) {
                    $scope.variantAddRequest = false;
                    AlertService.error('variantmsg', error.message, 4000);
                });
            };
    
            $scope.editVariant = function () {
                var opts = {
                    name: $scope.Variant.name,
                    notes: $scope.Variant.notes? $scope.Variant.notes : '',
                    price: $scope.Variant.price,                
                    category: $scope.Variant.category ? $scope.Variant.category : '',
                    subCategory: $scope.Variant.subCategory ? $scope.Variant.subCategory : ''
                };
                $scope.variantAddRequest = true;
                VariantService.updateVariant($scope.variantId, opts).then(function (data) {
                    $scope.variantAddRequest = false;
                    $state.go('variant');
                }).catch(function (error) {
                    $scope.variantAddRequest = false;
                    AlertService.error('variantmsg', error.message, 4000);
                });
            };
        }
    })();
    