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

        $scope.getNoteList = function (name, offset, itemsPerPage) {
            VariantService.getNotes(name, offset, itemsPerPage).then(function (data) {
                $scope.notes = data.data;
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
        $scope.getNoteList($scope.name, $scope.offset, $scope.itemsPerPage);

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
            console.log(id, '++++');
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
                price: $scope.Variant.price,
                category: $scope.Variant.category ? $scope.Variant.category : '',
                subCategory: $scope.Variant.subCategory ? $scope.Variant.subCategory : ''
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


    function AddNoteController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, VariantService, AlertService) {
        $scope.noteId = $stateParams.id;
        $scope.Note = {};
        $scope.subCategories = [];

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
                    console.log(data, '++++++++++');
                    $scope.Note = data.data;
                    $scope.Note.category = $scope.Note.category._id;
                    $scope.subCategories = $scope.sub[$scope.Note.category];
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
                notes: $scope.Notes.notes
            };
            if($scope.Note.category){
                opts.category = $scope.Note.category
            }
            if($scope.Note.subCategory){
                opts.subCategory = $scope.Note.subCategory
            }
            console.log('opts', opts);
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
                notes: $scope.Notes.notes
            };
            if($scope.Note.category){
                opts.category = $scope.Note.category
            }
            if($scope.Note.subCategory){
                opts.subCategory = $scope.Note.subCategory
            };
            $scope.noteAddRequest = true;
            VariantService.updateNote($scope.noteId, opts).then(function (data) {
                $scope.noteAddRequest = false;
                $state.go('variant');
            }).catch(function (error) {
                $scope.noteAddRequest = false;
                AlertService.error('variantmsg', error.message, 4000);
            });
        };
    }
})();
    