/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.rooms')
        .controller('RoomsController', RoomsController)
        .controller('StepsController', StepsController)
        .controller('ViewRoomsController', ViewRoomsController);

    /** @ngInject */
    function RoomsController($scope, $rootScope, baRoomService, $uibModal, $state, $http, $translate, $timeout, RoomService, CategoryService, AlertService, ItemService, $q) {
        console.log($translate.instant('Rooms'));
        $scope.tableModal = false;
        $scope.editTableModal = false;
        $scope.isMultiple = false;
        $scope.editBtn = -1;
        $scope.Room = {};
        $scope.Table = {};
        $scope.form = {};
        $scope.editTable = {};
        $scope.editRoom = {};
        $scope.editForm = {};
        $scope.Order = {};
        $scope.showOrder = false;
        $scope.rooms = [];
        $scope.activeTab = [true,false,false,false,false];
        $scope.showCategory = false;
        $scope.variantList = [];
        $scope.noteList = [];
        $scope.notes = [];
        $scope.variantData = {
            quantity: 0,
            variant: [],
            notes: ''
          }
        $q.all([            
            RoomService.getCategories()
        ]).then(function (data) {
            $scope.categories = data[0].data;
        });


        //Fetch Room list
        RoomService.getRooms().then(function(data) {
            $scope.rooms = RoomService.listRoom();
        }).catch(function(error) {
            console.log("Error ", error);
        });
        $scope.getRoomList = function () {
            RoomService.getRooms().then(function(data) {
                $scope.rooms = RoomService.listRoom();
            }).catch(function(error) {
                console.log("Error ", error);
            });
        };

        $scope.switchTableOption = function(option) {
            $scope.isMultiple = option;
        }
        $scope.openAddTable = function (roomId, page, size) {
            $scope.roomId = roomId;
            $scope.addTableInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size
            });
        };

        $scope.cancelAddTable = function () {
            $scope.addTableInstance.dismiss('cancel');
            $scope.Table = {};
        };

        $scope.openEditTable = function (table, roomId, page, size) {
            $scope.roomId = roomId;
            $scope.tableId = table._id;
            $scope.editTable = angular.copy(table);
            $scope.editTableInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size
            });
        };

        $scope.cancelEditTable = function () {
            $scope.editTableInstance.dismiss('cancel');
            $scope.editTable = {};
        };

        $scope.tableAddRequest = false;
        $scope.addTable = function () {
            var opts = {};
            opts.isMultiple = $scope.isMultiple;
            if($scope.isMultiple) {
                if(!($scope.Table.startNumber && $scope.Table.numberOfTable)) {
                    AlertService.error('roomlistmsg', "Start number & number of table is required", 4000);
                    return false;
                }
                opts.startNumber = $scope.Table.startNumber;
                opts.numberOfTable = $scope.Table.numberOfTable;
                opts.name = '',
                opts.numberOfSeat = '';
            } else {
                if(!$scope.Table.name) {
                    AlertService.error('roomlistmsg', "Table name is required", 4000);
                    return false;
                }
                opts.startNumber = '';
                opts.numberOfTable = '';
                opts.name = $scope.Table.name,
                opts.numberOfSeat = $scope.numberOfSeat ? $scope.numberOfSeat : '';
            }
            $scope.tableAddRequest = true;
            RoomService.addTable($scope.roomId, opts).then(function (data) {
                $scope.tableAddRequest = false;
                AlertService.success('roomlistmsg', data.message, 4000);
                $scope.getRoomList();
            }).catch(function (error) {
                $scope.tableAddRequest = false;
                AlertService.error('tablemsg', error.message, 4000);
            });
        };



        $scope.updateTable = function () {
            var opts = {
                name: $scope.editTable.name ? $scope.editTable.name : '',
                numberOfSeat: $scope.editTable.numberOfSeat
            };
            $scope.tableAddRequest = true;
            RoomService.updateTable($scope.roomId, $scope.tableId, opts).then(function (data) {
                $scope.tableAddRequest = false;
                AlertService.success('roomlistmsg', data.message, 4000);
                $scope.getRoomList();
            }).catch(function (error) {
                $scope.tableAddRequest = false;
                AlertService.error('tableeditmsg', error.message, 4000);
            });
        };

        //Delete Room
        $scope.removeRoom = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                RoomService.removeRoom(id).then(function (data) {
                    AlertService.success('roomlistmsg', data.message, 4000);
                    $scope.getRoomList();
                }).catch(function (error) {
                    AlertService.error('roomlistmsg', error.message, 4000);
                });
            }
        };

        //Delete Table
        $scope.removeTable = function (roomId, tableId) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                RoomService.removeTable(roomId, tableId).then(function (data) {
                    AlertService.success('roomlistmsg', data.message, 4000);
                    $scope.getRoomList();
                }).catch(function (error) {
                    AlertService.error('roomlistmsg', error.message, 4000);
                });
            }
        };

        //View Room
        $scope.viewRoom = function (id) {
            $state.go('viewroom', {
                'id': id
            });
        };

        $scope.openAddRoom = function (page, size) {
            $scope.addRoomInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size
            });
        };

        $scope.cancelAddRoom = function () {
            $scope.addRoomInstance.dismiss('cancel');
            $scope.Room = {};
        };

        $scope.openEditRoom = function (room, index) {

            if ($scope.editBtn == index) {
                $scope.editBtn = -1;
            } else {
                $scope.editBtn = index;
            }
            $scope.roomId = room._id;
            $scope.editRoom = angular.copy(room);
        };

        $scope.cancelEditRoom = function () {
            $scope.editRoomInstance.dismiss('cancel');
            $scope.editRoom = {};
        };

        $scope.addRoom = function () {
            var opts = {
                name: $scope.Room.name,
                startNumber: $scope.Room.startNumber,
                numberOfTable: $scope.Room.numberOfTable
            };
            $scope.roomAddRequest = true;
            RoomService.addRoom(opts).then(function (data) {
                $scope.roomAddRequest = false;
                AlertService.success('roomlistmsg', data.message, 4000);
                $scope.getRoomList();
            }).catch(function (error) {
                $scope.roomAddRequest = false;
                AlertService.error('roommsg', error.message, 4000);
            });
        };

        $scope.updateRoom = function () {
            if ($scope.editRoom.name == '') {
                AlertService.error('roomlistmsg', "Name is required", 4000);
                return false;
            }
            var opts = {
                name: $scope.editRoom.name,
            };
            $scope.roomAddRequest = true;
            RoomService.updateRoom($scope.roomId, opts).then(function (data) {
                $scope.roomAddRequest = false;
                AlertService.success('roomlistmsg', data.message, 4000);
                $scope.editBtn = -1;
                $scope.getRoomList();
            }).catch(function (error) {
                $scope.roomAddRequest = false;
                AlertService.error('roommsg', error.message, 4000);
            });
        };

        $scope.openCreateOrder = function (table, room, page, size) {            
            $scope.roomData = angular.copy(room);
            $scope.tableData = angular.copy(table);
            baRoomService.setCreateModalCollapsed(true);
            // $scope.createOrderInstance = $uibModal.open({
            //     scope: $scope,
            //     animation: true,
            //     templateUrl: page,
            //     size: size,
            //     backdrop: 'static'
            // });
            $scope.showOrder = true;
            $scope.activeTab = [true,false,false,false,false];
        };

        $scope.cancelCreateOrder = function () {
            // $scope.createOrderInstance.dismiss('cancel');
            $scope.Order = {};
            $scope.Order = {
                errorMsg: '',
                error: false,
                selectedItems: [],
                cartTotalPrice: 0,
                cartTotalItem: 0,
                selectedSubcategory: [false],
                activeTab: [true,false]                                
            };
            $scope.activeTab = [true,false,false,false,false];
            $scope.showOrder = false;            
            baRoomService.setCreateModalCollapsed(false);            
        };

        $scope.changeTab = function (tab) {
            $scope.activeTab[tab] = true;
            for(var i = 0; i<$scope.activeTab.length; i++){
                if(i != tab){
                    $scope.activeTab[i] = false;
                }
            }
        }

        $scope.Order = {
            errorMsg: '',
            error: false,
            selectedItems: [],
            cartTotalPrice: 0,
            cartTotalItem: 0,
            selectedSubcategory: [false],
            activeTab: [true,false]
        };

        $scope.tabActive = function (tab) {
            if (tab == 1) {
                $scope.Order.activeTab[0] = true;
                $scope.Order.activeTab[1] = false;
            }
            else {
                $scope.Order.activeTab[1] = true;
                $scope.Order.activeTab[0] = false;
            }
        }

        $scope.makeOrder = function () {
            if ($scope.Order.noOfPeople) {
                $scope.changeTab(1);
            }
            else {
                $scope.Order.error = true;
                $scope.Order.errorMsg = 'Please choose number of person';
                $timeout(function () {
                    $scope.Order.error = false;
                    $scope.Order.errorMsg = '';
                }, 4000);
            }
        }

        $scope.showItems = function (category) {
            $scope.Order.selectedCategory = category;
            $scope.Order.categoryItems = [];
            RoomService.getCategoryWithItems().then(function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].category._id == category._id) {
                        $scope.Order.categoryItems = data.data[i].items;
                    }
                }
                $scope.changeTab(2);
                $scope.goToItems();
            })
                .catch(function (error) {
                    console.log('error', error);
                });
        }

        $scope.goToItems = function () {
            console.log($scope.order)
            if ($scope.Order.categoryItems) {
                for (var i = 0; i < $scope.Order.categoryItems.length; i++) {
                    if ($scope.Order.selectedItems.length) {
                        for (var j = 0; j < $scope.Order.selectedItems.length; j++) {
                            if ($scope.Order.selectedItems[j]._id == $scope.Order.categoryItems[i]._id) {
                                $scope.Order.categoryItems[i].quantity = $scope.Order.selectedItems[j].quantity;
                            }
                        }
                    }
                }
                $scope.Order.selectedSubcategory[-1] = true;
            }
        }

        $scope.increaseValue = function (item) {
            var value = item.quantity;
            value = isNaN(value) ? 0 : value;
            value++;
            item.quantity = value;
            for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                if ($scope.Order.selectedItems[i]._id == item._id) {
                    $scope.Order.selectedItems.splice(i, 1);
                }
            }
            $scope.Order.selectedItems.push(item);
            var cp = 0;
            var itemno = 0;
            for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                itemno += $scope.Order.selectedItems[i].quantity;
                cp += $scope.Order.selectedItems[i].price * $scope.Order.selectedItems[i].quantity;
                $scope.Order.cartTotalPrice = cp;
                $scope.Order.cartTotalItem = itemno;
            }
        }
        
        $scope.decreaseValue = function (item) {
            var value = item.quantity;
            value = isNaN(value) ? 0 : value;
            value < 1 ? value = 1 : '';
            value--;
            item.quantity = value;
            for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                if ($scope.Order.selectedItems[i]._id == item._id) {
                    $scope.Order.selectedItems.splice(i, 1);
                }
            }
            if (item.quantity > 0) {
                $scope.Order.selectedItems.push(item);
            } else if (item.quantity == 0) {
                for (var i = 0; i < $scope.Order.categoryItems.length; i++) {
                    if ($scope.Order.categoryItems[i]._id == item._id) {
                        delete $scope.Order.categoryItems[i].quantity;
                    }
                }
            }
            var cp = 0;
            var itemno = 0;
            if ($scope.Order.selectedItems.length) {
                for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                    itemno += $scope.Order.selectedItems[i].quantity;
                    cp += $scope.Order.selectedItems[i].price * $scope.Order.selectedItems[i].quantity;
                    $scope.Order.cartTotalPrice = cp;
                    $scope.Order.cartTotalItem = itemno;
                }
            } else {
                $scope.Order.cartTotalPrice = 0;
                $scope.Order.cartTotalItem = 0;
            }
        }

        $scope.deleteItemFromCart = function (item) {
            for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                if ($scope.Order.selectedItems[i]._id == item._id) {
                    $scope.Order.selectedItems.splice(i, 1);
                }
            }
            var cp = 0;
            var itemno = 0;
            if ($scope.Order.selectedItems.length) {
                for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                    itemno += $scope.Order.selectedItems[i].quantity;
                    cp += $scope.Order.selectedItems[i].price * $scope.Order.selectedItems[i].quantity;
                    $scope.Order.cartTotalPrice = cp;
                    $scope.Order.cartTotalItem = itemno;
                }
            } else {
                $scope.Order.cartTotalPrice = 0;
                $scope.Order.cartTotalItem = 0;
            }
            for (var i = 0; i < $scope.Order.categoryItems.length; i++) {
                if ($scope.Order.categoryItems[i]._id == item._id) {
                    delete $scope.Order.categoryItems[i].quantity;
                }
            }
        }

        $scope.createOrder = function () {
            var itemarray = [];
            for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
                var item = {
                    id: $scope.Order.selectedItems[i]._id,
                    category: $scope.Order.selectedItems[i].category._id,
                    quantity: $scope.Order.selectedItems[i].quantity,
                    price: $scope.Order.selectedItems[i].price,
                    notes: '',
                    variant: []
                }
                itemarray.push(item);
            }
            var createorder = {
                room: $scope.roomData["_id"],
                table: $scope.tableData["_id"],
                noOfPeople: $scope.Order.noOfPeople,
                item: itemarray
            }
            RoomService.createOrder(createorder)
                .then(function (data) {
                    AlertService.success('createOrderMsg', data.message, 4000);
                    $scope.cancelCreateOrder();
                })
                .catch(function (error) {
                    AlertService.error('createOrderMsg', error.message, 4000);
                });
        }

        $scope.filterBySubcategory = function (subcategory, index) {
            $scope.subcategory = subcategory;
            if (typeof index !== 'undefined') {
                $scope.Order.selectedSubcategory[index] = true;
                $scope.Order.selectedSubcategory[-1] = false;
                for (var i = 0; i < $scope.Order.selectedSubcategory.length; i++) {
                    if (index != i) {
                        $scope.Order.selectedSubcategory[i] = false;
                    }
                }
            }
            else {
                $scope.Order.selectedSubcategory[-1] = true;
                for (var i = 0; i < $scope.Order.selectedSubcategory.length; i++) {
                    $scope.Order.selectedSubcategory[i] = false;
                }
            }
        }

        $scope.viewVarient = function (article) {
            RoomService.getVariantsAndNotes()
                .then(function (data) {
                    $scope.variantList = data.data.variants;
                    $scope.noteList = data.data.notes;
                }).catch(function (error) {
                    console.log("Error ", error);
                });
            $scope.changeTab(3);
            $scope.articleData = angular.copy(article);
            $scope.notes = [];
            $scope.Order.activeTab[0] = true;
            $scope.Order.activeTab[1] = false;
        }


        $scope.hideVarient = function () {
            $scope.changeTab(2);
            $scope.variantData = {
                quantity: 0,
                variant: [],
                notes: ''
            };
            $scope.notes = [];
            $scope.articleData = {};
        }
    }

    function StepsController($scope, RoomService, AlertService) {
        
    }
    function ViewRoomsController($scope, $stateParams, $state, RoomService, AlertService) {
        var id = $stateParams.id;
        $scope.roomDetail = RoomService.getRoomDetails();
        if (!$scope.roomDetail)
            $state.go('rooms');
    }
})();
