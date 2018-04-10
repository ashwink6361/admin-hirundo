/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
        angular.module('BlurAdmin.pages.items')
            .controller('ItemController', ItemController)
            .controller('AddItemController', AddItemController)
            .controller('ViewItemController', ViewItemController);

        /** @ngInject */
        function ItemController($scope, $state, $http, $timeout, ItemService, AlertService) {
            $scope.name = '';
            $scope.offset = 0;
            $scope.itemsPerPage = 10;
            $scope.currentPage = 1;
            $scope.itemEditBtn = false;
            //Fetch Item list
            $scope.getItemList = function (name, offset, itemsPerPage) {
                ItemService.getItems(name, offset, itemsPerPage).then(function (data) {
                    $scope.items = data.data;
                    $scope.totalCount = data.totalCount;
                    $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
                }).catch(function (error) {
                    $scope.items = [];
                });
            };

            $scope.goToPage = function (pageNumber) {
                $scope.currentPage = pageNumber;
                $scope.getItemList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
            };

            $scope.searchItems = function (name) {
                $scope.getItemList(name, $scope.offset, $scope.itemsPerPage);
            };

            $scope.getItemList($scope.name, $scope.offset, $scope.itemsPerPage);

            //Delete Item
            $scope.removeItem = function (id) {
                var result = confirm("Do you really want to delete?");
                if (result) {
                    ItemService.removeItem(id).then(function (data) {
                        AlertService.success('itemlistmsg', data.message, 4000);
                        $scope.getItemList();
                    }).catch(function (error) {
                        AlertService.error('itemlistmsg', error.message, 4000);
                    });
                }
            };

            $scope.itemEdit = function (){
                $scope.itemEditBtn =  !$scope.itemEditBtn;
            }

            //View Item
            $scope.viewItem = function (data, id) {
                $state.go('viewitem', {
                    'id': id
                });
            };

            //Edit Item
            $scope.updateItem = function (data, id) {
                $state.go('additem', {
                    'id': id
                });
            }

        }

        function ViewItemController($scope, $stateParams, $state, ItemService, AlertService) {
            var id = $stateParams.id;
            ItemService.getItemDetail($scope.itemId).then(function(data) {
                $scope.itemDetail = data.data;
            }).catch(function (error) {
                $state.go('items');
            });
        }

        function AddItemController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, ItemService, AlertService,CategoryService) {
            $scope.itemId = $stateParams.id;
            $scope.itms = [];
            $scope.Item = {};
            $scope.selectedIngredients = [];
            $scope.selectedIconImage = [];
            $scope.showAllergenIcon = false;
            $scope.Item = { allergens: [], foodCost: 0 };
            $scope.subCategories = [];
            var categoryData = CategoryService.getItemCategoryDetails();
            $scope.Item.category = categoryData._id;
            $scope.subCategories = categoryData.subCategory;
            $q.all([
                ItemService.getIngredients(),
                ItemService.getCategories(),
                ItemService.getAllergens()
            ]).then(function (data) {
                $scope.ingredients = data[0].data;
                $scope.categories = data[1].data;
                $scope.allergens = data[2].data;
                $scope.sub = [];
                for (var i = 0; i < $scope.categories.length; i++) {
                    $scope.sub[$scope.categories[i]._id] = $scope.categories[i].subCategory;
                }
                if ($scope.itemId) {
                    ItemService.getItemDetail($scope.itemId).then(function (data) {
                        $scope.Item = data.data;
                        $scope.Item.preparationTime = parseInt($scope.Item.preparationTime);
                        $scope.Item.category = $scope.Item.category._id;
                        $scope.subCategories = $scope.sub[$scope.Item.category];
                        $scope.itemPicture = $scope.Item.logo.original ? $scope.Item.logo.original : '';
                        for (var i = 0; i < $scope.Item.allergens.length; i++) {
                            $scope.selectedIconImage.push($scope.Item.allergens[i]);
                        }
                        for (var i = 0; i < $scope.Item.ingredients.length; i++) {
                            $scope.selectedIngredients.push($scope.Item.ingredients[i].id);
                            $scope.itms.push($scope.Item.ingredients[i]);
                        }
                        $scope.profit = $scope.Item.price - $scope.Item.foodCost;
                    }).catch(function (error) {
                        $scope.items = [];
                    });
                }
            });

            $scope.selectIngredient = function (ingredient) {
                if ($scope.selectedIngredients.indexOf(ingredient.selected._id) === -1) {
                    $scope.selectedIngredients.push(ingredient.selected._id);
                    $scope.itms.push({
                        id: ingredient.selected._id,
                        name: ingredient.selected.name,
                        ingredientQuantity: '',
                        quantity: ingredient.selected.quantity,
                        price: '',
                        priceOfQuantity: ingredient.selected.price,
                        unit: ingredient.selected.unit
                    });
                }
            };

            $scope.getQuantity = function (item) {
                var price = (item.ingredientQuantity * item.priceOfQuantity);
                item.price = Number(Math.round(price+'e2')+'e-2');
                var fc = 0;
                if ($scope.itms.length) {
                    for (var i = 0; i < $scope.itms.length; i++) {
                        if($scope.itms[i].price){
                            fc += Number($scope.itms[i].price);
                        }
                      
                    }
                }
                $scope.Item.foodCost = fc;
                $scope.profit = $scope.Item.price - $scope.Item.foodCost;
            };

            $scope.priceUpdate = function (){
                $scope.profit = $scope.Item.price - $scope.Item.foodCost;
            }
            $scope.allergenIcon = function () {
                $scope.showAllergenIcon = !$scope.showAllergenIcon;
            };

            $scope.selectedIcon = function (icon) {
                if ($scope.selectedIconImage.indexOf(icon.image) === -1) {
                    $scope.selectedIconImage.push(icon.image);
                }
                $scope.showAllergenIcon = false;
            };

            $scope.removeIngredient = function (indx, item) {
                if ($scope.selectedIngredients.indexOf(item.id) > -1) {
                    $scope.selectedIngredients.splice(indx, 1);
                    $scope.itms.splice(indx, 1);
                    $scope.Item.foodCost = $scope.Item.foodCost - item.price;
                    $scope.profit = $scope.Item.price - $scope.Item.foodCost;
                }
            };

            $scope.removeAllergens = function (indx, item) {
                if ($scope.selectedIconImage.indexOf(item) > -1) {
                    $scope.selectedIconImage.splice(indx, 1);
                }
            };

            $scope.categoryChanged = function (category) {
                $scope.Item.subCategory = '';
                $scope.subCategories = $scope.sub[category];
            };

            //Image crop options
            $scope.cropper = {};
            $scope.cropper.sourceImage = null;
            $scope.cropper.croppedImage = null;
            $scope.bounds = {};
            $scope.bounds.left = 0;
            $scope.bounds.right = 0;
            $scope.bounds.top = 0;
            $scope.bounds.bottom = 0;

            $scope.getFile = function () {
                fileReader.readAsDataUrl($scope.file, $scope)
                    .then(function (result) {
                        $scope.itemPicture = result;
                        var datauri = result.split(',')[1];
                        var binary = atob(datauri);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        //Convert the binary format of image into image file object to upload
                        $scope.itemLogo = new File([new Uint8Array(array)], 'category.png', {
                            type: 'image/png'
                        });
                    });
            };

            $scope.removeCategoryPicture = function () {
                $scope.itemPicture = '';
                $scope.itemLogo = '';
                $scope.cropper = {};
                $scope.cropper.sourceImage = null;
                $scope.cropper.croppedImage = null;
                $scope.bounds = {};
                $scope.bounds.left = 0;
                $scope.bounds.right = 0;
                $scope.bounds.top = 0;
                $scope.bounds.bottom = 0;
            };

            $scope.itemAddRequest = false;
            $scope.addItem = function () {
                if ( !$scope.Item.category ) {
                    AlertService.error('itemmsg', "Please select category", 4000);
                    return false;
                }
                var fitems = [];
                if($scope.itms.length) {
                    for(var i=0;i<$scope.itms.length;i++){
                        if($scope.itms[i].ingredientQuantity == '' || typeof($scope.itms[i].ingredientQuantity) === "undefined"){
                            AlertService.error('qtymsg', "Please enter ingredient quantity", 4000);
                            return false;
                        }
                        else{
                            fitems.push({
                                id: $scope.itms[i].id,
                                name: $scope.itms[i].name,
                                ingredientQuantity: $scope.itms[i].ingredientQuantity,
                                price: $scope.itms[i].price,
                                priceOfQuantity: $scope.itms[i].priceOfQuantity,
                                unit: $scope.itms[i].unit,
                                quantity: $scope.itms[i].quantity
                            });
                        }
                    }
                }
                var opts = {
                    name: $scope.Item.name,
                    description: $scope.Item.description ? $scope.Item.description : '',
                    price: $scope.Item.price,
                    ingredients: (fitems.length) ? JSON.stringify(fitems) : '',
                    preparationTime: $scope.Item.preparationTime ? $scope.Item.preparationTime : '',
                    category: $scope.Item.category,
                    subCategory: $scope.Item.subCategory ? $scope.Item.subCategory : '',
                    allergens: $scope.selectedIconImage ? JSON.stringify($scope.selectedIconImage) : '',
                    notes: $scope.Item.notes ? $scope.Item.notes : '',
                    foodCost: $scope.Item.foodCost ? $scope.Item.foodCost : '',
                    logo: $scope.itemLogo ? $scope.itemLogo : '',
                    logoBounds: $scope.itemLogo ? JSON.stringify($scope.bounds) : ''
                };
                $scope.itemAddRequest = true;
                ItemService.addItem(opts).then(function (data) {
                    $scope.itemAddRequest = false;
                    AlertService.success('categorylistmsg', data.message, 4000);
                    $state.go('viewcategory');
                }).catch(function (error) {
                    $scope.itemAddRequest = false;
                    AlertService.error('itemmsg', error.message, 4000);
                });
            };

            $scope.editItem = function () {
                if ( !$scope.Item.category ) {
                    AlertService.error('itemmsg', "Please select category", 4000);
                    return false;
                }
                var fitems = [];
                if($scope.itms.length) {
                    for(var i=0;i<$scope.itms.length;i++){
                        if($scope.itms[i].ingredientQuantity == '' || typeof($scope.itms[i].ingredientQuantity) === "undefined"){
                            AlertService.error('qtymsg', "Please enter ingredient quantity", 4000);
                            return false;
                        }
                        else{
                            fitems.push({
                                id: $scope.itms[i].id,
                                name: $scope.itms[i].name,
                                ingredientQuantity: $scope.itms[i].ingredientQuantity,
                                price: $scope.itms[i].price,
                                priceOfQuantity: $scope.itms[i].priceOfQuantity,
                                unit: $scope.itms[i].unit,
                                quantity: $scope.itms[i].quantity                                
                            });
                        }
                    }
                }
                var opts = {
                    name: $scope.Item.name,
                    description: $scope.Item.description ? $scope.Item.description : '',
                    price: $scope.Item.price,
                    ingredients: (fitems.length) ? JSON.stringify(fitems) : '',
                    preparationTime: $scope.Item.preparationTime ? $scope.Item.preparationTime : '',
                    category: $scope.Item.category,
                    subCategory: $scope.Item.subCategory ? $scope.Item.subCategory : '',
                    allergens: $scope.selectedIconImage ? JSON.stringify($scope.selectedIconImage) : '',
                    notes: $scope.Item.notes ? $scope.Item.notes : '',
                    foodCost: $scope.Item.foodCost ? $scope.Item.foodCost : '',
                    logo: $scope.itemLogo ? $scope.itemLogo : '',
                    logoBounds: $scope.itemLogo ? JSON.stringify($scope.bounds) : ''
                };
                $scope.itemAddRequest = true;
                ItemService.updateItem($scope.itemId, opts).then(function (data) {
                    $scope.itemAddRequest = false;
                    AlertService.success('categorylistmsg', data.message, 4000);
                    $state.go('viewcategory');
                }).catch(function (error) {
                    $scope.itemAddRequest = false;
                    AlertService.error('itemmsg', error.message, 4000);
                });
            };
        }
    })();
