/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.variants')
        .controller('VariantController', VariantController)
        .controller('AddVariantController', AddVariantController)
        .controller('ViewVariantController', ViewVariantController)
        .controller('AddNoteController', AddNoteController)
        .controller('ViewNoteController', ViewNoteController);
    
        /** @ngInject */
    function VariantController($scope, $state, $http, $timeout, VariantService, AlertService) {
        //Fetch Variant list
        $scope.getVariantList = function () {
            VariantService.getVariants().then(function (data) {
                $scope.variants = data.data;
            }).catch(function (error) {
                $scope.variants = [];
            });
        };

        $scope.getNoteList = function () {
            VariantService.getNotes().then(function (data) {
                $scope.notes = data.data;
            }).catch(function (error) {
                $scope.variants = [];
            });
        };

        $scope.getVariantList();
        $scope.getNoteList();

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

        //Delete Note
        $scope.removeNote = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                VariantService.removeNote(id).then(function (data) {
                    AlertService.success('variantlistmsg', data.message, 4000);
                    $scope.getNoteList();
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
        $scope.updateVariant = function (id) {
            $state.go('addvariant', {
                'id': id
            });
        };

        //View Notes
        $scope.viewNote = function (id) {
            $state.go('viewnote', {
                'id': id
            });
        };

        //Edit Notes
        $scope.updateNote = function (id) {
            $state.go('addnote', {
                'id': id
            });
        };
    }
    
    function ViewVariantController($scope, $stateParams, $state, VariantService, AlertService) {
        var id = $stateParams.id;
        VariantService.getVariantDetail(id).then(function (data) {
            $scope.variantDetail = data.data;
        }).catch(function (error) {
            $state.go('variant');
        });
    }

    function ViewNoteController($scope, $stateParams, $state, VariantService, AlertService) {
        var id = $stateParams.id;
        VariantService.getNoteDetail(id).then(function (data) {
            $scope.noteDetail = data.data;
        }).catch(function (error) {
            $state.go('variant');
        });
    }
    
    function AddVariantController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, VariantService, AlertService) {
        $scope.variantId = $stateParams.id;
        $scope.Variant = {};
        $scope.subCategories = [];
        $scope.itms = [];
        $scope.selectedCategories = [];
        $q.all([
            VariantService.getCategories(),
        ]).then(function (data) {
            $scope.categories = data[0].data;
            $scope.sub = [];
            for (var i = 0; i < $scope.categories.length; i++) {
                $scope.sub[$scope.categories[i]._id] = $scope.categories[i].subCategory;
            }
            if ($scope.variantId) {
                VariantService.getVariantDetail($scope.variantId).then(function (data) {
                    $scope.Variant = data.data;
                    $scope.subCategories = $scope.sub[$scope.Variant.category];
                    for (var i = 0; i < $scope.Variant.category.length; i++) {
                        $scope.selectedCategories.push($scope.Variant.category[i]._id);
                        $scope.itms.push($scope.Variant.category[i]);
                    }
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
                price: $scope.Variant.price,
                // subCategory: $scope.Variant.subCategory ? $scope.Variant.subCategory : '',
                category: ($scope.selectedCategories.length) ? JSON.stringify($scope.selectedCategories) : '',

            };
            console.log('opts', opts);
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
                price: $scope.Variant.price,
                // subCategory: $scope.Variant.subCategory ? $scope.Variant.subCategory : ''
                category: ($scope.selectedCategories.length) ? JSON.stringify($scope.selectedCategories) : '',                
            };
            console.log('opts', opts);            
            $scope.variantAddRequest = true;
            VariantService.updateVariant($scope.variantId, opts).then(function (data) {
                $scope.variantAddRequest = false;
                $state.go('variant');
            }).catch(function (error) {
                $scope.variantAddRequest = false;
                AlertService.error('variantmsg', error.message, 4000);
            });
        };

        $scope.selectCategory = function (category) {
            if ($scope.selectedCategories.indexOf(category.selected._id) === -1) {
                $scope.selectedCategories.push(category.selected._id);
                $scope.itms.push({
                    _id: category.selected._id,
                    name: category.selected.name
                });
            }
        };

        $scope.removeCategory = function (indx, item) {
            if ($scope.selectedCategories.indexOf(item._id) > -1) {
                $scope.selectedCategories.splice(indx, 1);
                $scope.itms.splice(indx, 1);
            }
        };
    }


    function AddNoteController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, VariantService, AlertService) {
        $scope.noteId = $stateParams.id;
        $scope.Note = {};
        $scope.subCategories = [];
        $scope.itms = [];
        $scope.selectedCategories = [];
        $q.all([
            VariantService.getCategories(),
        ]).then(function (data) {
            $scope.categories = data[0].data;
            $scope.sub = [];
            for (var i = 0; i < $scope.categories.length; i++) {
                $scope.sub[$scope.categories[i]._id] = $scope.categories[i].subCategory;
            }
            if ($scope.noteId) {
                VariantService.getNoteDetail($scope.noteId).then(function (data) {
                    $scope.Note = data.data;
                    $scope.subCategories = $scope.sub[$scope.Note.category];
                    for (var i = 0; i < $scope.Note.category.length; i++) {
                        $scope.selectedCategories.push($scope.Note.category[i]._id);
                        $scope.itms.push($scope.Note.category[i]);
                    }
                }).catch(function (error) {
                    $state.go('variant');
                });
            }
        });

        $scope.categoryChanged = function (category) {
            $scope.Note.subCategory = '';
            $scope.subCategories = $scope.sub[category];
        };

        $scope.noteAddRequest = false;
        $scope.addNote = function () {
            var opts = {
                notes: $scope.Note.notes,
                category: ($scope.selectedCategories.length) ? JSON.stringify($scope.selectedCategories) : []                
            };
            // if($scope.Note.subCategory){
            //     opts.subCategory = $scope.Note.subCategory
            // }
            $scope.noteAddRequest = true;
            VariantService.addNote(opts).then(function (data) {
                $scope.noteAddRequest = false;
                $state.go('variant');
            }).catch(function (error) {
                $scope.noteAddRequest = false;
                AlertService.error('variantmsg', error.message, 4000);
            });
        };

        $scope.editNote = function () {
            var opts = {
                notes: $scope.Note.notes,
                category: ($scope.selectedCategories.length) ? JSON.stringify($scope.selectedCategories) : []                
            };
            // if($scope.Note.subCategory){
            //     opts.subCategory = $scope.Note.subCategory
            // };
            $scope.noteAddRequest = true;
            VariantService.updateNote($scope.noteId, opts).then(function (data) {
                $scope.noteAddRequest = false;
                $state.go('variant');
            }).catch(function (error) {
                $scope.noteAddRequest = false;
                AlertService.error('variantmsg', error.message, 4000);
            });
        };

        $scope.selectCategory = function (category) {
            if ($scope.selectedCategories.indexOf(category.selected._id) === -1) {
                $scope.selectedCategories.push(category.selected._id);
                $scope.itms.push({
                    _id: category.selected._id,
                    name: category.selected.name
                });
            }
        };

        $scope.removeCategory = function (indx, item) {
            if ($scope.selectedCategories.indexOf(item._id) > -1) {
                $scope.selectedCategories.splice(indx, 1);
                $scope.itms.splice(indx, 1);
            }
        };
    }
})();
    