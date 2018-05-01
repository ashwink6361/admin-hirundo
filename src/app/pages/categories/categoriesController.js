/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.categories')
        .controller('CategoryController', CategoryController)
        .controller('AddCategoryController', AddCategoryController)
        .controller('ViewCategoryController', ViewCategoryController)
        .controller('TabController', TabController)

    /** @ngInject */
    function CategoryController($scope, $state, $http, $timeout, CategoryService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 100;
        $scope.currentPage = 1;
        $scope.showOptions = false;

        //Fetch Category list
        $scope.getCategoryList = function (name, offset, itemsPerPage) {
            CategoryService.getCategories(name, offset, itemsPerPage).then(function (data) {
                $scope.categories = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.brands = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getCategoryList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchCategories = function (name) {
            $scope.getCategoryList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getCategoryList($scope.name, $scope.offset, $scope.itemsPerPage);

        //Delete Category
        $scope.removeCategory = function (id, event) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                CategoryService.removeCategory(id).then(function (data) {
                    AlertService.success('categorylistmsg', data.message, 4000);
                    $scope.getCategoryList();
                }).catch(function (error) {
                    AlertService.error('categorylistmsg', error.message, 4000);
                });
            }
            event.stopImmediatePropagation();
        };

        //View Category
        $scope.viewCategory = function () {
            $state.go('viewcategory');
        };

        //Edit Category
        $scope.updateCategory = function (id) {
            $state.go('addcategory', {
                'id': id
            });
        };

        $scope.categoryEdit = function () {
            $scope.showOptions = !$scope.showOptions;
        };
    }

    function ViewCategoryController($scope, $stateParams, $state, CategoryService, AlertService) {
        var id = $stateParams.id;
        $scope._ = _;
        $scope.showSubCategoryOptions = false;
        $scope.isArticleEdit = false;
        $scope.categorySearchData = [];
        CategoryService.getCategoryWithItems().then(function (data) {
            $scope.categoryItems = data.data;
            console.log('$scope.categoryItems',$scope.categoryItems);
            for (var i = 0; i < $scope.categoryItems.length; i++) {
                $scope.categorySearchData.push({
                    _id: $scope.categoryItems[i].category._id,
                    name: $scope.categoryItems[i].category.name,
                });
            }
        }).catch(function (error) {
            AlertService.error('subcategorylistmsg', error.message, 4000);
            $state.go('editormenu');
        })

        $scope.articleEdit = function () {
            $scope.isArticleEdit = !$scope.isArticleEdit;
        };

        //Delete Article
        $scope.removeArticle = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                CategoryService.removeItem(id).then(function (data) {
                    AlertService.success('subcategorylistmsg', data.message, 4000);
                    CategoryService.getCategoryWithItems().then(function (data) {
                        $scope.categoryItems = data.data;
                    }).catch(function (error) {
                        AlertService.error('subcategorylistmsg', error.message, 4000);
                        $state.go('editormenu');
                    })
                }).catch(function (error) {
                    AlertService.error('subcategorylistmsg', error.message, 4000);
                });
            }
            event.stopImmediatePropagation();
        };

        // Add Article
        $scope.addArticle = function (category,subcategory) {
            CategoryService.setItemCategoryDetails(category);
            if(subcategory){
                CategoryService.setSubCategoryDetails(subcategory);            
            }else{
                CategoryService.setSubCategoryDetails('');
            }
            $state.go('additem');
        }

        //Edit Article
        $scope.updateArticle = function (data, id) {
            $state.go('additem', {
                'id': id
            });
        }

        //Delete Sub Category
        $scope.removeSubCategory = function (subCategoryId) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                CategoryService.removeSubCategory(id, subCategoryId).then(function (data) {
                    AlertService.success('subcategorylistmsg', data.message, 4000);
                    CategoryService.getCategoryDetail(id).then(function (data) {
                        $scope.categoryDetail = data.data;
                    }).catch(function (error) {
                        AlertService.error('subcategorylistmsg', error.message, 4000);
                        $state.go('editormenu');
                    });
                }).catch(function (error) {
                    AlertService.error('subcategorylistmsg', error.message, 4000);
                });
            }
        };

        $scope.selectedCategory = function ($item) {
            if ($item) {
                $scope.selectedItem = $item.originalObject.name; // the actual object which was selected
            }
        }
        $scope.inputChanged = function (data) {
            if (data == '') {
                $scope.selectedItem = null;
            }
        }
    }

    function AddCategoryController($scope, $http, $stateParams, $q, $state, $timeout, fileReader, CategoryService, AlertService) {
        $scope.showCategoryIcon = false;
        $scope.isIcon = true;
        $scope.categoryId = $stateParams.id;
        $scope.selectedIconImage = '';
        $scope.Category = {};
        $scope.Category = {
            color: '#fdab00'
        }
        $scope.subCategories = [];
        if ($scope.categoryId) {
            CategoryService.getCategoryDetail($scope.categoryId).then(function (data) {
                $scope.Category = data.data;
                for (var i = 0; i < $scope.Category.subCategory.length; i++) {
                    $scope.subCategories.push($scope.Category.subCategory[i]);
                }
                if (!$scope.Category.isIcon) {
                    $scope.categoryPicture = $scope.Category.logo.original;
                    $scope.Category.color = '#fdab00';
                    $scope.isIcon = false;
                } else {
                    $scope.selectedIconImage = angular.copy($scope.Category.icon);
                    if ($scope.selectedIconImage.indexOf('/') !== -1) {
                        var result = $scope.selectedIconImage.substring($scope.selectedIconImage.lastIndexOf("/") + 1, $scope.selectedIconImage.lastIndexOf("."));
                        $scope.Category.icon = result;
                    }
                    $scope.isIcon = true;
                }
            }).catch(function (error) {
                $state.go('editormenu');
            });
        }
        $q.all([
            CategoryService.getIcons('', 0, 100)
        ]).then(function (data) {
            $scope.icons = data[0].data;
        });

        $scope.addNewSubCategory = function () {
            $scope.subCategories[$scope.subCategories.length] = '';
        };

        $scope.removeSubCategory = function (index, item) {
            if ($scope.subCategories.indexOf(item) > -1) {
                $scope.subCategories.splice(index, 1);
            }
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
                    $scope.categoryPicture = result;
                    var datauri = result.split(',')[1];
                    var binary = atob(datauri);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    //Convert the binary format of image into image file object to upload
                    $scope.categoryLogo = new File([new Uint8Array(array)], 'category.png', {
                        type: 'image/png'
                    });
                });
        };

        $scope.removeCategoryPicture = function () {
            $scope.categoryPicture = '';
            $scope.categoryLogo = '';
            $scope.cropper = {};
            $scope.cropper.sourceImage = null;
            $scope.cropper.croppedImage = null;
            $scope.bounds = {};
            $scope.bounds.left = 0;
            $scope.bounds.right = 0;
            $scope.bounds.top = 0;
            $scope.bounds.bottom = 0;
        };

        $scope.categoryAddRequest = false;
        $scope.addCategory = function () {
            if (!$scope.isIcon && !$scope.categoryLogo) {
                AlertService.error('categorymsg', "Please attach category logo that is missing", 4000);
                return false;
            }
            if ($scope.isIcon) {
                if (!$scope.Category.icon) {
                    AlertService.error('categorymsg', "Please attach category icon that is missing", 4000);
                    return false;
                }
                if (!$scope.Category.color) {
                    AlertService.error('categorymsg', "Please attach category color that is missing", 4000);
                    return false;
                }
            }
            var opts = {
                name: $scope.Category.name,
                description: $scope.Category.description ? $scope.Category.description : '',
                isIcon: $scope.isIcon ? true : false,
                subCategory: $scope.subCategories ? JSON.stringify($scope.subCategories) : ''
            };
            if ($scope.isIcon) {
                if ($scope.Category.color.indexOf('#') === -1) {
                    $scope.Category.color = '#' + $scope.Category.color;
                }
                opts.icon = $scope.Category.icon,
                    opts.color = $scope.Category.color,
                    opts.logo = '',
                    opts.logoBounds = ''
            } else {
                $scope.api.clear();
                opts.icon = '',
                    opts.color = '',
                    opts.logo = $scope.categoryLogo,
                    opts.logoBounds = JSON.stringify($scope.bounds)
            }
            console.log(opts);
            $scope.categoryAddRequest = true;
            CategoryService.addCategory(opts).then(function (data) {
                $scope.categoryAddRequest = false;
                $state.go('editormenu');
            }).catch(function (error) {
                $scope.categoryAddRequest = false;
                AlertService.error('categorymsg', error.message, 4000);
            });
        };

        $scope.editCategory = function () {
            if ($scope.isIcon) {
                if (!$scope.Category.icon) {
                    AlertService.error('categorymsg', "Please attach category icon that is missing", 4000);
                    return false;
                }
                if (!$scope.Category.color) {
                    AlertService.error('categorymsg', "Please attach category color that is missing", 4000);
                    return false;
                }
            }
            if ($scope.Category.color.indexOf('#') === -1) {
                $scope.Category.color = '#' + $scope.Category.color;
            }
            var opts = {
                name: $scope.Category.name,
                description: $scope.Category.description ? $scope.Category.description : '',
                isIcon: $scope.isIcon ? true : false,
                subCategory: $scope.subCategories ? JSON.stringify($scope.subCategories) : ''
            };
            if ($scope.isIcon) {
                opts.icon = $scope.Category.icon,
                    opts.color = $scope.Category.color,
                    opts.logo = '',
                    opts.logoBounds = ''
            } else {
                opts.icon = '',
                    opts.color = '',
                    opts.logo = $scope.categoryLogo ? $scope.categoryLogo : '',
                    opts.logoBounds = $scope.categoryLogo ? JSON.stringify($scope.bounds) : ''
            }
            $scope.categoryAddRequest = true;
            CategoryService.updateCategory($scope.categoryId, opts).then(function (data) {
                $scope.categoryAddRequest = false;
                $state.go('editormenu');
            }).catch(function (error) {
                $scope.categoryAddRequest = false;
                AlertService.error('categorymsg', error.message, 4000);
            });
        };
        $scope.categoryIcon = function () {
            $scope.showCategoryIcon = !$scope.showCategoryIcon;
        }
        $scope.chooseIcon = function () {
            $scope.isIcon = true;
        }
        $scope.chooseImg = function () {
            $scope.isIcon = false;
            $scope.showCategoryIcon = false;
        }
        $scope.selectedIcon = function (icon) {
            $scope.Category.icon = icon.key;
            $scope.selectedIconImage = icon.image;
            $scope.showCategoryIcon = false;
        }
    }

    function TabController($scope, $state, $http, $timeout, CategoryService, AlertService) {
        console.log(localStorage.getItem('activeTab'));
        if(localStorage.getItem('activeTab')){
            $scope.activeTab = localStorage.getItem('activeTab');
        }
        else{
            $scope.activeTab = CategoryService.getActiveTab();
        }        
        $scope.selectTab = function (tab) {
            if (tab == 1) {
                $state.reload();
            }
            CategoryService.setActiveTab(tab);
            localStorage.setItem('activeTab', tab);
        };
    }
})();