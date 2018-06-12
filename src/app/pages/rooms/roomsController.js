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
    function RoomsController($scope, $rootScope, baRoomService, $uibModal, $state, $http, $translate, $timeout, RoomService, CategoryService, AlertService, ItemService, $q, OrderService) {
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
        $rootScope.Order = {};
        $scope.showOrder = false;
        $scope.rooms = [];
        $scope.activeTab = [true, false, false, false, false, false, false];
        $scope.showCategory = false;
        $scope.variantList = [];
        $scope.noteList = [];
        $scope.notes = [];
        $scope.notesarray = [];
        $scope.showLedtSideBar = false;
        $scope.showCheckoutCart = false;
        $scope.variantData = {
            quantity: 0,
            variant: [],
            notes: ''
        };
        $scope.variantError = '';
        $scope.orderId = '';
        $scope.orderItems = [];

        $scope.variantList1 = [];
        $scope.noteList1 = [];
        $scope.variantData1 = {
            quantity: 0,
            variant: [],
            notes: ''
        }
        $scope.notes1 = [];
        $scope.notesarray1 = [];
        $scope.variantError1 = '';
        $scope.nonVariantData = false;
        $scope.selectAllClicked = false;
        $scope.selectedCheckoutItems = [];
        $scope.checkoutPeople = 0;
        $scope.checkoutPeoplePrice = 0;
        $scope.checkoutTotalPrice = 0;
        $scope.showCheckoutCart = false;

        $scope.variantList2 = [];
        $scope.noteList2 = [];
        $scope.variantData2 = {
            quantity: 0,
            variant: [],
            notes: ''
        }
        $scope.notes2 = [];
        $scope.notesarray2 = [];
        $scope.variantError2 = '';
        $scope.editNonVariantData = false;
        $scope.showLedtSideBar1 = false;

        $q.all([
            RoomService.getCategories()
        ]).then(function (data) {
            $scope.categories = data[0].data;
        });
        //Fetch Room list
        RoomService.getRooms().then(function (data) {
            $scope.rooms = RoomService.listRoom();
        }).catch(function (error) {
        });
        $scope.getRoomList = function () {
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
            }).catch(function (error) {
            });
        };

        $scope.switchTableOption = function (option) {
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
            if ($scope.isMultiple) {
                if (!($scope.Table.startNumber && $scope.Table.numberOfTable)) {
                    AlertService.error('roomlistmsg', "Start number & number of table is required", 4000);
                    return false;
                }
                opts.startNumber = $scope.Table.startNumber;
                opts.numberOfTable = $scope.Table.numberOfTable;
                opts.name = '',
                    opts.numberOfSeat = '';
            } else {
                if (!$scope.Table.name) {
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

        $scope.openCreateOrder = function (table, room) {
            $rootScope.Order = {
                errorMsg: '',
                error: false,
                selectedItems: {},
                cartTotalPrice: 0,
                cartTotalItem: 0,
                selectedSubcategory: [false],
                activeTab: [true, false],
                showMenu: false
            };
            $scope.selectAllClicked = false;
            $scope.selectedCheckoutItems = [];
            $scope.checkoutPeople = 0;
            $scope.checkoutPeoplePrice = 0;
            $scope.checkoutTotalPrice = 0;
            $scope.stepArray = [];
            $scope.roomData = angular.copy(room);
            $scope.tableData = angular.copy(table);
            baRoomService.setCreateModalCollapsed(true);
            if (table.orderId != null && table.orderId._id) {
                $scope.orderId = table.orderId._id;
                $scope.orderItems = table.orderId.item;
                $rootScope.Order.noOfPeople = table.orderId.noOfPeople;
                var cp = 0;
                var itemno = 0;
                var varicost = 0;
                $scope.orderItemsTotalPrice = 0;
                $scope.orderItemsTotalItem = 0;
                if ($scope.orderItems.length) {
                    for (var i = 0; i < $scope.orderItems.length; i++) {
                        if ($scope.orderItems[i].checkout && ($scope.selectedCheckoutItems.indexOf($scope.orderItems[i]._id) < 0)) {
                            $scope.selectedCheckoutItems.push($scope.orderItems[i]._id);
                        }
                        varicost = 0;
                        itemno += $scope.orderItems[i].quantity;
                        if ($scope.orderItems[i].variant) {
                            for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                if ($scope.orderItems[i].variant[j].status == 1) {
                                    varicost += $scope.orderItems[i].variant[j].price;
                                }
                            }
                        }
                        cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                        $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                        $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                        $scope.orderItemsTotalItem = itemno;
                    }
                }
                baRoomService.setOrderId(table.orderId._id);
                baRoomService.setOrderItems(table.orderId.item);
                for (var i = 0; i < table.orderId.step.length; i++) {
                    $scope.stepArray.push(table.orderId.step[i].step);
                }
                if ($scope.stepArray.length) {
                    baRoomService.setStepData($scope.stepArray);
                }
                var steps = [];
                var selectedItems = {};
                if (baRoomService.getStepData()) {
                    steps = baRoomService.getStepData();
                } else {
                    steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var j = 0; j < steps.length; j++) {
                    selectedItems[steps[j]] = [];
                }
                $rootScope.Order.selectedItems = selectedItems;
                $rootScope.Order.cartTotalPrice = 0;
                $rootScope.Order.cartTotalItem = 0;
                $rootScope.Order.showMenu = true;
            } else {
                $scope.orderId = '';
                $scope.orderItems = [];
                localStorage.removeItem('orderId');
                localStorage.removeItem('orderItems');
            }
            if (table.status == 1) {
                $scope.activeTab = [false, false, false, false, true, false, false];
            } else {
                $scope.activeTab = [true, false, false, false, false, false, false];
            }
            $scope.showOrder = true;
        };

        $scope.cancelCreateOrder = function () {
            $rootScope.Order = {};
            $rootScope.Order = {
                errorMsg: '',
                error: false,
                selectedItems: {},
                cartTotalPrice: 0,
                cartTotalItem: 0,
                selectedSubcategory: [false],
                activeTab: [true, false],
                showMenu: false
            };
            $scope.activeTab = [true, false, false, false, false, false, false];
            $scope.showOrder = false;
            $scope.showCheckoutCart = false;
            $scope.showLedtSideBar = false;
            $scope.stepArray = [];
            baRoomService.setCreateModalCollapsed(false);
            localStorage.removeItem('stepData');
            localStorage.removeItem('tabData');
        };

        $scope.changeTab = function (tab) {
            $scope.activeTab[tab] = true;
            for (var i = 0; i < $scope.activeTab.length; i++) {
                if (i != tab) {
                    $scope.activeTab[i] = false;
                }
            }
        }

        $rootScope.Order = {
            errorMsg: '',
            error: false,
            selectedItems: {},
            cartTotalPrice: 0,
            cartTotalItem: 0,
            selectedSubcategory: [false],
            activeTab: [true, false],
            showMenu: false
        };

        $scope.tabActive = function (tab) {
            if (tab == 1) {
                $rootScope.Order.activeTab[0] = true;
                $rootScope.Order.activeTab[1] = false;
            } else {
                $rootScope.Order.activeTab[1] = true;
                $rootScope.Order.activeTab[0] = false;
            }
        }

        $scope.makeOrder = function () {
            localStorage.removeItem('stepData');
            localStorage.removeItem('tabData');
            if ($rootScope.Order.noOfPeople) {
                var steps = [];
                var selectedItems = {};
                if (baRoomService.getStepData()) {
                    steps = baRoomService.getStepData();
                } else {
                    steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var j = 0; j < steps.length; j++) {
                    selectedItems[steps[j]] = [];
                }
                $rootScope.Order.selectedItems = selectedItems;
                $scope.changeTab(1);
                $rootScope.Order.showMenu = true;
            } else {
                $rootScope.Order.error = true;
                $rootScope.Order.errorMsg = 'Please choose number of person';
                $timeout(function () {
                    $rootScope.Order.error = false;
                    $rootScope.Order.errorMsg = '';
                }, 4000);
            }
        }

        $scope.showItems = function (category) {
            $rootScope.Order.selectedCategory = category;
            $rootScope.Order.categoryItems = {};
            RoomService.getCategoryWithItems().then(function (data) {
                    if (data.data.length) {
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].category._id == category._id) {
                                var steps = [];
                                if (baRoomService.getStepData()) {
                                    steps = baRoomService.getStepData();
                                } else {
                                    steps = ['Uscita 1', 'Uscita 2'];
                                }
                                for (var j = 0; j < steps.length; j++) {
                                    $rootScope.Order.categoryItems[steps[j]] = angular.copy(data.data[i].items);
                                    for (var k = 0; k < $rootScope.Order.categoryItems[steps[j]].length; k++) {
                                        $rootScope.Order.categoryItems[steps[j]][k].quantity = 0;
                                        $rootScope.Order.categoryItems[steps[j]][k].itemTotal = 0;
                                    }
                                }
                            }
                        }
                    }
                    $scope.changeTab(2);
                    $scope.goToItems();
                })
                .catch(function (error) {
                });
        }

        $scope.goToItems = function () {
            if ($rootScope.Order.categoryItems) {
                var steps = [];
                if (baRoomService.getStepData()) {
                    steps = baRoomService.getStepData();
                } else {
                    steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var k = 0; k < steps.length; k++) {
                    for (var i = 0; i < $rootScope.Order.categoryItems[steps[k]].length; i++) {
                        if ($rootScope.Order.selectedItems[steps[k]].length) {
                            var temp = 0;
                            for (var j = 0; j < $rootScope.Order.selectedItems[steps[k]].length; j++) {
                                if ($rootScope.Order.selectedItems[steps[k]][j]._id == $rootScope.Order.categoryItems[steps[k]][i]._id) {
                                    temp = temp + $rootScope.Order.selectedItems[steps[k]][j].quantity;
                                    $rootScope.Order.categoryItems[steps[k]][i].itemTotal = temp;
                                }
                            }
                        }
                    }
                }
                $rootScope.Order.selectedSubcategory[-1] = true;
            }
        }

        $scope.increaseValue = function (article) {
            article.step = baRoomService.getTabData().step;
            var currentStep = baRoomService.getTabData().step;
            $rootScope.Order = angular.copy($rootScope.Order);
            if ($rootScope.Order.selectedItems[currentStep].length) {
                var isExist = true;
                var isarr = [];
                for (var i = 0; i < $rootScope.Order.selectedItems[currentStep].length; i++) {
                    if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id) {
                        if (!$rootScope.Order.selectedItems[currentStep][i].variant) {
                            $rootScope.Order.selectedItems[currentStep][i].quantity += 1;
                            isarr.push($rootScope.Order.selectedItems[currentStep][i]._id);
                            for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                                if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                    $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal + 1;
                                }
                            }
                        }
                        if ($rootScope.Order.selectedItems[currentStep][i].variant) {
                            isExist = false;
                        }
                    }
                    if ($rootScope.Order.selectedItems[currentStep][i]._id != article._id) {
                        isExist = false;
                    }
                }
                if (!isExist && isarr.indexOf(article._id) < 0) {
                    article.quantity = article.quantity + 1;
                    for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                        if ($rootScope.Order.categoryItems[currentStep][j]._id == article._id) {
                            $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal + article.quantity;
                        }
                    }
                    $rootScope.Order.selectedItems[currentStep].push(article);
                }
            } else {
                article.quantity = article.quantity + 1;
                for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                    if ($rootScope.Order.categoryItems[currentStep][j]._id == article._id) {
                        $rootScope.Order.categoryItems[currentStep][j].itemTotal = article.quantity;
                    }
                }
                $rootScope.Order.selectedItems[currentStep].push(article);
            }
            var cp = 0;
            var itemno = 0;
            var varicost = 0;
            var steps = [];
            if (baRoomService.getStepData()) {
                steps = baRoomService.getStepData();
            } else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            for (var a = 0; a < steps.length; a++) {
                for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                    varicost = 0;
                    itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                    if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                        for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                            if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                            }
                        }
                    }
                    cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                    $rootScope.Order.cartTotalPrice = cp;
                    $rootScope.Order.cartTotalItem = itemno;
                }
            }
        }

        $scope.decreaseValue = function (article) {
            article.step = baRoomService.getTabData().step;
            var currentStep = baRoomService.getTabData().step;
            $rootScope.Order = angular.copy($rootScope.Order);
            for (var i = 0; i < $rootScope.Order.selectedItems[currentStep].length; i++) {
                if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id && !$rootScope.Order.selectedItems[currentStep][i].variant && $rootScope.Order.selectedItems[currentStep][i].step == article.step) {
                    if ($rootScope.Order.selectedItems[currentStep][i].quantity > 1) {
                        $rootScope.Order.selectedItems[currentStep][i].quantity = $rootScope.Order.selectedItems[currentStep][i].quantity - 1;
                        for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                            if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal - 1;
                            }
                        }
                    } else {
                        article.quantity = 0;
                        for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                            if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal - 1;
                            }
                        }
                        $rootScope.Order.selectedItems[currentStep].splice(i, 1);
                    }
                }
            }
            var cp = 0;
            var itemno = 0;
            var varicost = 0;
            var steps = [];
            if (baRoomService.getStepData()) {
                steps = baRoomService.getStepData();
            } else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            var emptyArray = [];
            for (var a = 0; a < steps.length; a++) {
                if ($rootScope.Order.selectedItems[steps[a]].length) {
                    for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                        varicost = 0;
                        itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                            for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                                if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                    varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                                }
                            }
                        }
                        cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        $rootScope.Order.cartTotalPrice = cp;
                        $rootScope.Order.cartTotalItem = itemno;
                    }
                }
                if ($rootScope.Order.selectedItems[steps[a]].length == 0) {
                    if (emptyArray.indexOf(steps[a]) < 0) {
                        emptyArray.push(steps[a]);
                    }
                }
                if (emptyArray.length == steps.length) {
                    $rootScope.Order.cartTotalPrice = 0;
                    $rootScope.Order.cartTotalItem = 0;
                }
            }
        }

        $scope.deleteItemFromCart = function (article) {
            var currentStep = baRoomService.getTabData().step;
            $rootScope.Order = angular.copy($rootScope.Order);
            for (var i = 0; i < $rootScope.Order.selectedItems[currentStep].length; i++) {
                if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id && !article.variant) {
                    //non variant type data
                    for (var m = 0; m < $rootScope.Order.categoryItems[currentStep].length; m++) {
                        if ($rootScope.Order.categoryItems[currentStep][m]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                            $rootScope.Order.categoryItems[currentStep][m].itemTotal = $rootScope.Order.categoryItems[currentStep][m].itemTotal - $rootScope.Order.selectedItems[currentStep][i].quantity;
                        }
                    }
                    if (!$rootScope.Order.selectedItems[currentStep][i].variant && currentStep == $rootScope.Order.selectedItems[currentStep][i].step) {
                        $rootScope.Order.selectedItems[currentStep].splice(i, 1);
                    }
                } else if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id && article.variant && $rootScope.Order.selectedItems[currentStep][i].variantUniqueId == article.variantUniqueId) {
                    //variant type data
                    for (var m = 0; m < $rootScope.Order.categoryItems[currentStep].length; m++) {
                        if ($rootScope.Order.categoryItems[currentStep][m]._id == $rootScope.Order.selectedItems[currentStep][i]._id && $rootScope.Order.selectedItems[currentStep][i].variantUniqueId == article.variantUniqueId) {
                            $rootScope.Order.categoryItems[currentStep][m].itemTotal = $rootScope.Order.categoryItems[currentStep][m].itemTotal - $rootScope.Order.selectedItems[currentStep][i].quantity;
                        }
                    }
                    if ($rootScope.Order.selectedItems[currentStep][i].variant && currentStep == $rootScope.Order.selectedItems[currentStep][i].step && $rootScope.Order.selectedItems[currentStep][i].variantUniqueId == article.variantUniqueId) {
                        $rootScope.Order.selectedItems[currentStep].splice(i, 1);
                    }
                }
            }
            var cp = 0;
            var itemno = 0;
            var varicost = 0;
            var steps = [];
            if (baRoomService.getStepData()) {
                steps = baRoomService.getStepData();
            } else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            var emptyArray = [];
            for (var a = 0; a < steps.length; a++) {
                if ($rootScope.Order.selectedItems[steps[a]].length) {
                    for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                        varicost = 0;
                        itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                            for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                                if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                    varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                                }
                            }
                        }
                        cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        $rootScope.Order.cartTotalPrice = cp;
                        $rootScope.Order.cartTotalItem = itemno;
                    }
                }
                if ($rootScope.Order.selectedItems[steps[a]].length == 0) {
                    if (emptyArray.indexOf(steps[a]) < 0) {
                        emptyArray.push(steps[a]);
                    }
                }
                if (emptyArray.length == steps.length) {
                    $rootScope.Order.cartTotalPrice = 0;
                    $rootScope.Order.cartTotalItem = 0;
                }
            }
        }
        $scope.createOrder = function () {
            var itemarray = [];
            var steps = [];
            if (baRoomService.getStepData()) {
                steps = baRoomService.getStepData();
            } else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            for (var a = 0; a < steps.length; a++) {
                for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                    var vararray = [];
                    if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                        for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                            var catarray = [];
                            for (var k = 0; k < $rootScope.Order.selectedItems[steps[a]][i].variant[j].category.length; k++) {
                                catarray.push($rootScope.Order.selectedItems[steps[a]][i].variant[j].category[k]._id);
                            }
                            var vari = {
                                name: $rootScope.Order.selectedItems[steps[a]][i].variant[j].name,
                                category: catarray,
                                price: $rootScope.Order.selectedItems[steps[a]][i].variant[j].price,
                                status: $rootScope.Order.selectedItems[steps[a]][i].variant[j].status,
                                id: $rootScope.Order.selectedItems[steps[a]][i].variant[j]._id
                            }
                            vararray.push(vari);
                        }
                    }
                    var item = {
                        id: $rootScope.Order.selectedItems[steps[a]][i]._id,
                        category: $rootScope.Order.selectedItems[steps[a]][i].category._id,
                        quantity: $rootScope.Order.selectedItems[steps[a]][i].quantity,
                        price: $rootScope.Order.selectedItems[steps[a]][i].price,
                        notes: $rootScope.Order.selectedItems[steps[a]][i].ordernote ? $rootScope.Order.selectedItems[steps[a]][i].ordernote : '',
                        variant: vararray,
                        step: $rootScope.Order.selectedItems[steps[a]][i].step,
                        department: $rootScope.Order.selectedItems[steps[a]][i].category.department
                    }
                    itemarray.push(item);
                }
            }
            var createorder = {
                room: $scope.roomData["_id"],
                table: $scope.tableData["_id"],
                noOfPeople: $rootScope.Order.noOfPeople,
                item: itemarray
            }
            if ($scope.orderId) {
                RoomService.updateOrder(itemarray, $scope.orderId)
                    .then(function (data) {
                        AlertService.success('createOrderMsg', data.message, 4000);
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                            for (var i = 0; i < $scope.rooms.length; i++) {
                                if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                                    for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                                        if ($scope.rooms[i].tables[j]._id == $scope.tableData["_id"]) {
                                            $scope.roomData = angular.copy($scope.rooms[i]);
                                            $scope.tableData = angular.copy($scope.rooms[i].tables[j]);
                                        }
                                    }
                                }
                            }
                            $rootScope.Order = {
                                errorMsg: '',
                                error: false,
                                selectedItems: {},
                                cartTotalPrice: 0,
                                cartTotalItem: 0,
                                selectedSubcategory: [false],
                                activeTab: [true, false],
                                showMenu: false
                            };
                            $scope.selectAllClicked = false;
                            $scope.selectedCheckoutItems = [];
                            $scope.checkoutPeople = 0;
                            $scope.checkoutPeoplePrice = 0;
                            $scope.checkoutTotalPrice = 0;
                            $scope.stepArray = [];
                            $scope.roomData = angular.copy($scope.roomData);
                            $scope.tableData = angular.copy($scope.tableData);
                            baRoomService.setCreateModalCollapsed(true);
                            if ($scope.tableData.orderId != null && $scope.tableData.orderId._id) {
                                $scope.orderId = $scope.tableData.orderId._id;
                                $scope.orderItems = $scope.tableData.orderId.item;
                                $rootScope.Order.noOfPeople = $scope.tableData.orderId.noOfPeople;
                                var cp = 0;
                                var itemno = 0;
                                var varicost = 0;
                                $scope.orderItemsTotalPrice = 0;
                                $scope.orderItemsTotalItem = 0;
                                if ($scope.orderItems.length) {
                                    for (var i = 0; i < $scope.orderItems.length; i++) {
                                        if ($scope.orderItems[i].checkout && ($scope.selectedCheckoutItems.indexOf($scope.orderItems[i]._id) < 0)) {
                                            $scope.selectedCheckoutItems.push($scope.orderItems[i]._id);
                                        }
                                        varicost = 0;
                                        itemno += $scope.orderItems[i].quantity;
                                        if ($scope.orderItems[i].variant) {
                                            for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                                if ($scope.orderItems[i].variant[j].status == 1) {
                                                    varicost += $scope.orderItems[i].variant[j].price;
                                                }
                                            }
                                        }
                                        cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                                        $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                                        $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                        $scope.orderItemsTotalItem = itemno;
                                    }
                                }
                                baRoomService.setOrderId($scope.tableData.orderId._id);
                                baRoomService.setOrderItems($scope.tableData.orderId.item);
                                for (var i = 0; i < $scope.tableData.orderId.step.length; i++) {
                                    $scope.stepArray.push($scope.tableData.orderId.step[i].step);
                                }
                                if ($scope.stepArray.length) {
                                    baRoomService.setStepData($scope.stepArray);
                                }
                                var steps = [];
                                var selectedItems = {};
                                if (baRoomService.getStepData()) {
                                    steps = baRoomService.getStepData();
                                } else {
                                    steps = ['Uscita 1', 'Uscita 2'];
                                }
                                for (var j = 0; j < steps.length; j++) {
                                    selectedItems[steps[j]] = [];
                                }
                                $rootScope.Order.selectedItems = selectedItems;
                                $rootScope.Order.cartTotalPrice = 0;
                                $rootScope.Order.cartTotalItem = 0;
                                $rootScope.Order.showMenu = true;
                            } else {
                                $scope.orderId = '';
                                $scope.orderItems = [];
                                localStorage.removeItem('orderId');
                                localStorage.removeItem('orderItems');
                            }
                            if ($scope.tableData.status == 1) {
                                $scope.activeTab = [false, false, false, false, true, false, false];
                            } else {
                                $scope.activeTab = [true, false, false, false, false, false, false];
                            }
                            $scope.showOrder = true;

                        }).catch(function (error) {
                        });
                    })
                    .catch(function (error) {
                        AlertService.error('createOrderMsg', error.message, 4000);
                    });
            } else {
                RoomService.createOrder(createorder)
                    .then(function (data) {
                        AlertService.success('createOrderMsg', data.message, 4000);
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                            for (var i = 0; i < $scope.rooms.length; i++) {
                                if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                                    for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                                        if ($scope.rooms[i].tables[j]._id == $scope.tableData["_id"]) {
                                            $scope.roomData = angular.copy($scope.rooms[i]);
                                            $scope.tableData = angular.copy($scope.rooms[i].tables[j]);
                                        }
                                    }
                                }
                            }
                            $rootScope.Order = {
                                errorMsg: '',
                                error: false,
                                selectedItems: {},
                                cartTotalPrice: 0,
                                cartTotalItem: 0,
                                selectedSubcategory: [false],
                                activeTab: [true, false],
                                showMenu: false
                            };
                            $scope.selectAllClicked = false;
                            $scope.selectedCheckoutItems = [];
                            $scope.checkoutPeople = 0;
                            $scope.checkoutPeoplePrice = 0;
                            $scope.checkoutTotalPrice = 0;
                            $scope.stepArray = [];
                            $scope.roomData = angular.copy($scope.roomData);
                            $scope.tableData = angular.copy($scope.tableData);
                            baRoomService.setCreateModalCollapsed(true);
                            if ($scope.tableData.orderId != null && $scope.tableData.orderId._id) {
                                $scope.orderId = $scope.tableData.orderId._id;
                                $scope.orderItems = $scope.tableData.orderId.item;
                                $rootScope.Order.noOfPeople = $scope.tableData.orderId.noOfPeople;
                                var cp = 0;
                                var itemno = 0;
                                var varicost = 0;
                                $scope.orderItemsTotalPrice = 0;
                                $scope.orderItemsTotalItem = 0;
                                if ($scope.orderItems.length) {
                                    for (var i = 0; i < $scope.orderItems.length; i++) {
                                        if ($scope.orderItems[i].checkout && ($scope.selectedCheckoutItems.indexOf($scope.orderItems[i]._id) < 0)) {
                                            $scope.selectedCheckoutItems.push($scope.orderItems[i]._id);
                                        }
                                        varicost = 0;
                                        itemno += $scope.orderItems[i].quantity;
                                        if ($scope.orderItems[i].variant) {
                                            for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                                if ($scope.orderItems[i].variant[j].status == 1) {
                                                    varicost += $scope.orderItems[i].variant[j].price;
                                                }
                                            }
                                        }
                                        cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                                        $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                                        $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                        $scope.orderItemsTotalItem = itemno;
                                    }
                                }
                                baRoomService.setOrderId($scope.tableData.orderId._id);
                                baRoomService.setOrderItems($scope.tableData.orderId.item);
                                for (var i = 0; i < $scope.tableData.orderId.step.length; i++) {
                                    $scope.stepArray.push($scope.tableData.orderId.step[i].step);
                                }
                                if ($scope.stepArray.length) {
                                    baRoomService.setStepData($scope.stepArray);
                                }
                                var steps = [];
                                var selectedItems = {};
                                if (baRoomService.getStepData()) {
                                    steps = baRoomService.getStepData();
                                } else {
                                    steps = ['Uscita 1', 'Uscita 2'];
                                }
                                for (var j = 0; j < steps.length; j++) {
                                    selectedItems[steps[j]] = [];
                                }
                                $rootScope.Order.selectedItems = selectedItems;
                                $rootScope.Order.cartTotalPrice = 0;
                                $rootScope.Order.cartTotalItem = 0;
                                $rootScope.Order.showMenu = true;
                            } else {
                                $scope.orderId = '';
                                $scope.orderItems = [];
                                localStorage.removeItem('orderId');
                                localStorage.removeItem('orderItems');
                            }
                            if ($scope.tableData.status == 1) {
                                $scope.activeTab = [false, false, false, false, true, false, false];
                            } else {
                                $scope.activeTab = [true, false, false, false, false, false, false];
                            }
                            $scope.showOrder = true;

                        }).catch(function (error) {
                        });
                    })
                    .catch(function (error) {
                        AlertService.error('createOrderMsg', error.message, 4000);
                    });
            }
            $scope.showLedtSideBar = false;
        }

        $scope.filterBySubcategory = function (subcategory, index) {
            $scope.subcategory = subcategory;
            if (typeof index !== 'undefined') {
                $rootScope.Order.selectedSubcategory[index] = true;
                $rootScope.Order.selectedSubcategory[-1] = false;
                for (var i = 0; i < $rootScope.Order.selectedSubcategory.length; i++) {
                    if (index != i) {
                        $rootScope.Order.selectedSubcategory[i] = false;
                    }
                }
            } else {
                $rootScope.Order.selectedSubcategory[-1] = true;
                for (var i = 0; i < $rootScope.Order.selectedSubcategory.length; i++) {
                    $rootScope.Order.selectedSubcategory[i] = false;
                }
            }
        }

        $scope.viewVarient = function (article) {
            RoomService.getVariantsAndNotes()
                .then(function (data) {
                    $scope.variantList = data.data.variants;
                    $scope.noteList = data.data.notes;
                }).catch(function (error) {
                });
            $scope.changeTab(3);
            $scope.articleData = angular.copy(article);
            $scope.notes = [];
            $scope.notesarray = [];
            $rootScope.Order.activeTab[0] = true;
            $rootScope.Order.activeTab[1] = false;
        }

        $scope.hideVarient = function () {
            $scope.changeTab(2);
            $scope.variantData = {
                quantity: 0,
                variant: [],
                notes: ''
            };
            $scope.notes = [];
            $scope.notesarray = [];
            $scope.articleData = {};
        }

        $scope.addNote = function (note, i) {
            if ($scope.notes[note]) {
                $scope.notesarray.push(note);
            } else {
                $scope.notesarray.splice($scope.notesarray.indexOf(note), 1);
            }
            $scope.variantData.notes = $scope.notesarray.toString();
        }

        $scope.addRemoveVariant = function (variant, status) {
            if (status == 0) {
                variant.status = 0;
            } else {
                variant.status = 1;
            }
            for (var i = 0; i < $scope.variantData.variant.length; i++) {
                if ($scope.variantData.variant[i]._id == variant._id) {
                    $scope.variantData.variant.splice(i, 1);
                }
            }
            $scope.variantData.variant.push(variant);
        }

        $scope.decreaseQty = function () {
            var value = $scope.variantData.quantity;
            value = isNaN(value) ? 0 : value;
            value < 1 ? value = 1 : '';
            value--;
            $scope.variantData.quantity = value;
        }

        $scope.increaseQty = function () {
            var value = $scope.variantData.quantity;
            value = isNaN(value) ? 0 : value;
            value++;
            $scope.variantData.quantity = value;
        }

        $scope.saveVariantData = function () {
            var currentStep = baRoomService.getTabData().step;
            if ($scope.variantData.quantity == 0) {
                $scope.variantError = 'Please enter quantity';
                $timeout(function () {
                    $scope.variantError = '';
                }, 4000);
            } else if ($scope.variantData.quantity > 0 && !$scope.variantData.variant.length && !$scope.variantData.notes) {
                $scope.variantError = 'Please select variants/notes';
                $timeout(function () {
                    $scope.variantError = '';
                }, 4000);
            } else {
                $scope.articleData.quantity = $scope.variantData.quantity;
                $scope.articleData.variant = $scope.variantData.variant;
                $scope.articleData.ordernote = $scope.variantData.notes;
                $scope.articleData.step = currentStep;
                $scope.articleData.variantUniqueId = Math.floor(Math.random() * 10000);
                $rootScope.Order.selectedItems[currentStep].push($scope.articleData);
                for (var i = 0; i < $rootScope.Order.categoryItems[currentStep].length; i++) {
                    if ($rootScope.Order.categoryItems[currentStep][i]._id == $scope.articleData._id) {
                        $rootScope.Order.categoryItems[currentStep][i].itemTotal = $rootScope.Order.categoryItems[currentStep][i].itemTotal + $scope.articleData.quantity;
                    }
                }
                var cp = 0;
                var itemno = 0;
                var varicost = 0;
                var steps = [];
                if (baRoomService.getStepData()) {
                    steps = baRoomService.getStepData();
                } else {
                    steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var a = 0; a < steps.length; a++) {
                    for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                        varicost = 0;
                        itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                            for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                                if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                    varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                                }
                            }
                        }
                        cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                        $rootScope.Order.cartTotalPrice = cp;
                        $rootScope.Order.cartTotalItem = itemno;
                    }
                }
                $scope.hideVarient();
            }
        }
        //edit code
        $scope.viewVarient1 = function (article) {
            $scope.nonVariantData = false;
            RoomService.getVariantsAndNotes()
                .then(function (data) {
                    $scope.variantList1 = data.data.variants;
                    $scope.noteList1 = data.data.notes;
                    $scope.articleData1 = angular.copy(article);
                    if (!$scope.articleData1.variant) {
                        $scope.nonVariantData = true;
                        $scope.variantData1.quantity = $scope.articleData1.quantity;
                    } else {
                        $scope.nonVariantData = false;
                        $scope.variantData1.quantity = $scope.articleData1.quantity;
                        $scope.variantData1.variant = $scope.articleData1.variant;
                        $scope.variantData1.notes = $scope.articleData1.ordernote;
                        if ($scope.articleData1.ordernote) {
                            $scope.notesarray1 = $scope.articleData1.ordernote.split(',');
                            for (var i = 0; i < $scope.notesarray1.length; i++) {
                                $scope.notes1[$scope.notesarray1[i]] = true;
                            }
                        }
                        for (var i = 0; i < $scope.variantData1.variant.length; i++) {
                            if ($scope.variantList1.length) {
                                for (var j = 0; j < $scope.variantList1.length; j++) {
                                    if ($scope.variantData1.variant[i]._id == $scope.variantList1[j]._id) {
                                        $scope.variantList1[j].status = $scope.variantData1.variant[i].status;
                                    }
                                }
                            }
                        }
                    }
                    if ($scope.articleData1) {
                        $scope.changeTab(5);
                        $rootScope.Order.activeTab[0] = true;
                        $rootScope.Order.activeTab[1] = false;
                    }
                }).catch(function (error) {
                });
        }

        $scope.hideVarient1 = function () {
            $scope.changeTab(2);
            $scope.nonVariantData = false;
            $scope.variantData1 = {
                quantity: 0,
                variant: [],
                notes: ''
            };
            $scope.notes1 = [];
            $scope.notesarray1 = [];
            $scope.articleData1 = {};
        }

        $scope.addNote1 = function (note, i) {
            if ($scope.notes1[note]) {
                $scope.notesarray1.push(note);
            } else {
                $scope.notesarray1.splice($scope.notesarray1.indexOf(note), 1);
            }
            $scope.variantData1.notes = $scope.notesarray1.toString();
        }

        $scope.addRemoveVariant1 = function (variant, status) {
            if (status == 0) {
                variant.status = 0;
            } else {
                variant.status = 1;
            }
            for (var i = 0; i < $scope.variantData1.variant.length; i++) {
                if ($scope.variantData1.variant[i]._id == variant._id) {
                    $scope.variantData1.variant.splice(i, 1);
                }
            }
            $scope.variantData1.variant.push(variant);
        }

        $scope.decreaseQty1 = function () {
            var value = $scope.variantData1.quantity;
            value = isNaN(value) ? 0 : value;
            value < 1 ? value = 1 : '';
            value--;
            $scope.variantData1.quantity = value;
        }

        $scope.increaseQty1 = function () {
            var value = $scope.variantData1.quantity;
            value = isNaN(value) ? 0 : value;
            value++;
            $scope.variantData1.quantity = value;
        }

        $scope.saveVariantData1 = function () {
            if (!$scope.articleData1.variant) {
                if ($scope.variantData1.quantity == 0) {
                    $scope.variantError1 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                } else {
                    $scope.articleData1.quantity = $scope.variantData1.quantity;
                    for (var i = 0; i < $rootScope.Order.selectedItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.selectedItems[$scope.articleData1.step][i]._id == $scope.articleData1._id && !$rootScope.Order.selectedItems[$scope.articleData1.step][i].variant) {
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].quantity = $scope.articleData1.quantity;
                        }
                    }
                    for (var i = 0; i < $rootScope.Order.categoryItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.categoryItems[$scope.articleData1.step][i]._id == $scope.articleData1._id) {
                            $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal = $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal + $scope.articleData1.quantity;
                        }
                    }
                    var cp = 0;
                    var itemno = 0;
                    var varicost = 0;
                    var steps = [];
                    if (baRoomService.getStepData()) {
                        steps = baRoomService.getStepData();
                    } else {
                        steps = ['Uscita 1', 'Uscita 2'];
                    }
                    for (var a = 0; a < steps.length; a++) {
                        for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                            varicost = 0;
                            itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                            if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                                for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                                    if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                        varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                            $rootScope.Order.cartTotalPrice = cp;
                            $rootScope.Order.cartTotalItem = itemno;
                        }
                    }
                    $scope.hideVarient();
                }
            } else {
                if ($scope.variantData1.quantity == 0) {
                    $scope.variantError1 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                } else if ($scope.variantData1.quantity > 0 && !$scope.variantData1.variant.length && !$scope.variantData1.notes) {
                    $scope.variantError1 = 'Please select variants/notes';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                } else {
                    $scope.articleData1.quantity = $scope.variantData1.quantity;
                    $scope.articleData1.variant = $scope.variantData1.variant;
                    $scope.articleData1.ordernote = $scope.variantData1.notes;
                    for (var i = 0; i < $rootScope.Order.selectedItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.selectedItems[$scope.articleData1.step][i]._id == $scope.articleData1._id && $rootScope.Order.selectedItems[$scope.articleData1.step][i].variant && $rootScope.Order.selectedItems[$scope.articleData1.step][i].variantUniqueId == $scope.articleData1.variantUniqueId) {
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].quantity = $scope.articleData1.quantity;
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].variant = $scope.articleData1.variant;
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].ordernote = $scope.articleData1.ordernote;
                        }
                    }
                    for (var i = 0; i < $rootScope.Order.categoryItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.categoryItems[$scope.articleData1.step][i]._id == $scope.articleData1._id) {
                            $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal = $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal + $scope.articleData1.quantity;
                        }
                    }
                    var cp = 0;
                    var itemno = 0;
                    var varicost = 0;
                    var steps = [];
                    if (baRoomService.getStepData()) {
                        steps = baRoomService.getStepData();
                    } else {
                        steps = ['Uscita 1', 'Uscita 2'];
                    }
                    for (var a = 0; a < steps.length; a++) {
                        for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
                            varicost = 0;
                            itemno += $rootScope.Order.selectedItems[steps[a]][i].quantity;
                            if ($rootScope.Order.selectedItems[steps[a]][i].variant) {
                                for (var j = 0; j < $rootScope.Order.selectedItems[steps[a]][i].variant.length; j++) {
                                    if ($rootScope.Order.selectedItems[steps[a]][i].variant[j].status == 1) {
                                        varicost += $rootScope.Order.selectedItems[steps[a]][i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($rootScope.Order.selectedItems[steps[a]][i].price + varicost) * $rootScope.Order.selectedItems[steps[a]][i].quantity;
                            $rootScope.Order.cartTotalPrice = cp;
                            $rootScope.Order.cartTotalItem = itemno;
                        }
                    }
                    $scope.hideVarient();
                }
            }
        }
        $scope.showLeftSide = function () {
            $scope.showLedtSideBar = true;
        }
        $scope.hideLeftSide = function () {
            $scope.showLedtSideBar = false;
        }
        $scope.selectAllItems = function (items) {
            $scope.selectAllClicked = !$scope.selectAllClicked;
            if ($scope.selectAllClicked) {
                for (var i = 0; i < items.length; i++) {
                    if ($scope.selectedCheckoutItems.indexOf(items[i]._id) < 0) {
                        $scope.selectedCheckoutItems.push(items[i]._id);
                    }
                }
                if ($scope.selectedCheckoutItems.length) {
                    var cp = 0;
                    var varicost = 0;
                    for (var i = 0; i < items.length; i++) {
                        if (!items[i].checkout) {
                            if (items[i].variant) {
                                for (var j = 0; j < items[i].variant.length; j++) {
                                    if (items[i].variant[j].status == 1) {
                                        varicost += items[i].variant[j].price;
                                    }
                                }
                            }
                            cp += (items[i].price + varicost) * items[i].quantity;
                        }
                        $scope.checkoutTotalPrice = cp;
                        $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
                    }
                }
            } else {
                for (var i = 0; i < items.length; i++) {
                    if (!items[i].checkout && $scope.selectedCheckoutItems.indexOf(items[i]._id) > -1) {
                        $scope.selectedCheckoutItems.splice($scope.selectedCheckoutItems.indexOf(items[i]._id), 1);
                    }
                }
                $scope.checkoutTotalPrice = 0;
            }
        }
        $scope.selectItem = function (item, orderItemsLength) {
            var idx = $scope.selectedCheckoutItems.indexOf(item._id);
            if (idx > -1) {
                var varicost = 0;
                if (item.variant) {
                    for (var j = 0; j < item.variant.length; j++) {
                        if (item.variant[j].status == 1) {
                            varicost += item.variant[j].price;
                        }
                    }
                }
                $scope.checkoutTotalPrice = $scope.checkoutTotalPrice - ((item.price + varicost) * item.quantity);
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
                $scope.selectedCheckoutItems.splice(idx, 1);
            } else {
                var varicost = 0;
                if (item.variant) {
                    for (var j = 0; j < item.variant.length; j++) {
                        if (item.variant[j].status == 1) {
                            varicost += item.variant[j].price;
                        }
                    }
                }
                $scope.checkoutTotalPrice = $scope.checkoutTotalPrice + ((item.price + varicost) * item.quantity);
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
                $scope.selectedCheckoutItems.push(item._id);
            }
            if ($scope.selectedCheckoutItems.length == orderItemsLength) {
                $scope.selectAllClicked = true;
            } else {
                $scope.selectAllClicked = false;
            }
        }

        $scope.decreasePeople = function () {
            if ($rootScope.Order.noOfPeople > 0) {
                $rootScope.Order.noOfPeople = $rootScope.Order.noOfPeople - 1;
                $scope.orderItemsTotalPrice = $scope.orderItemsTotalPrice - 1.5;
                $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                var opts = {
                    noOfPeople: $rootScope.Order.noOfPeople
                }
                RoomService.updateNoOfPeople($scope.orderId, opts).then(function (data) {
                    RoomService.getRooms().then(function (data) {
                        $scope.rooms = RoomService.listRoom();
                    }).catch(function (error) {
                    });
                }).catch(function (error) {
                });
            }
        }
        $scope.increasePeople = function () {
            $rootScope.Order.noOfPeople = $rootScope.Order.noOfPeople + 1;
            $scope.orderItemsTotalPrice = $scope.orderItemsTotalPrice + 1.5;
            $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
            var opts = {
                noOfPeople: $rootScope.Order.noOfPeople
            }
            RoomService.updateNoOfPeople($scope.orderId, opts).then(function (data) {
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        $scope.decreaseCheckoutPeople = function () {
            if ($scope.checkoutPeople < $rootScope.Order.noOfPeople) {
                $scope.checkoutPeople = $scope.checkoutPeople + 1;
                $scope.checkoutPeoplePrice = $scope.checkoutPeople + (0.5 * $scope.checkoutPeople);
                $scope.checkoutPeoplePrice = Number(Math.round($scope.checkoutPeoplePrice + 'e2') + 'e-2');
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2') + 1.5;
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
            }
        }
        $scope.increaseCheckoutPeople = function () {
            if ($scope.checkoutPeople >= 1) {
                $scope.checkoutPeople = $scope.checkoutPeople - 1;
                $scope.checkoutPeoplePrice = $scope.checkoutPeople + (0.5 * $scope.checkoutPeople);
                $scope.checkoutPeoplePrice = Number(Math.round($scope.checkoutPeoplePrice + 'e2') + 'e-2');
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2') - 1.5;
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
            }
        }

        $scope.checkoutOrder = function () {
            var opts = {
                noOfPeople: $scope.checkoutPeople,
                orderItemId: $scope.selectedCheckoutItems ? $scope.selectedCheckoutItems : []
            }
            RoomService.checkoutOrder($scope.roomData["_id"], $scope.tableData["_id"], $scope.orderId, opts).then(function (data) {
                $scope.selectAllClicked = false;
                $scope.selectedCheckoutItems = [];
                $scope.checkoutPeople = 0;
                $scope.checkoutPeoplePrice = 0;
                $scope.checkoutTotalPrice = 0;
                $scope.showLedtSideBar = false;
                $scope.showOrder = false;
                baRoomService.setCreateModalCollapsed(false);
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        $scope.checkoutOrderItems = function () {
            var itemsArray = [];
            for (var i = 0; i < $scope.orderItemsNew.length; i++) {
                itemsArray.push({
                    _id: $scope.orderItemsNew[i]._id,
                    quantity: $scope.orderItemsNew[i].quantity,
                });
            }
            var opts = {
                noOfPeople: $scope.checkoutPeople,
                orderItemId: itemsArray ? itemsArray : []
            }
            RoomService.checkoutOrder($scope.roomData["_id"], $scope.tableData["_id"], $scope.orderId, opts).then(function (data) {
                $scope.checkoutPeople = 0;
                $scope.checkoutPeoplePrice = 0;
                $scope.showLedtSideBar = false;
                $scope.showOrder = false;
                $scope.showCheckoutCart = false;
                $scope.checkoutTotalPrice = 0;
                baRoomService.setCreateModalCollapsed(false);
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        $scope.checkout = function () {
            OrderService.checkoutTable($scope.roomData["_id"], $scope.tableData["_id"]).then(function (data) {
                $scope.showLedtSideBar = false;
                $scope.showOrder = false;
                $scope.showCheckoutCart = false;
                $scope.checkoutPeople = 0;
                $scope.checkoutPeoplePrice = 0;
                $scope.checkoutTotalPrice = 0;
                baRoomService.setCreateModalCollapsed(false);
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        $scope.showTotalItem = function (orderItems) {
            $scope.orderItemsNew = [];
            for (var i = 0; i < orderItems.length; i++) {
                $scope.orderItemsNew.push({
                    _id: orderItems[i]._id,
                    name: orderItems[i].id.name,
                    quantity: 0,
                    amount: 0
                });
            }
            $scope.showCheckoutCart = true;
        }

        $scope.decreaseItemQty = function (item) {
            for (var i = 0; i < $scope.orderItemsNew.length; i++) {
                if ($scope.orderItemsNew[i]._id == item._id && $scope.orderItemsNew[i].quantity < item.quantity) {
                    $scope.orderItemsNew[i].quantity = $scope.orderItemsNew[i].quantity + 1;
                    var varicost = 0;
                    if (item.variant) {
                        for (var j = 0; j < item.variant.length; j++) {
                            if (item.variant[j].status == 1) {
                                varicost += item.variant[j].price;
                            }
                        }
                    }
                    $scope.orderItemsNew[i].amount = (item.price + varicost) * $scope.orderItemsNew[i].quantity;
                    $scope.orderItemsNew[i].amount = Number(Math.round($scope.orderItemsNew[i].amount + 'e2') + 'e-2');
                }
            }
            var out = 0;
            for (var n in $scope.orderItemsNew) {
                out += $scope.orderItemsNew[n].amount;
            }
            $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + $scope.checkoutPeople + (0.5 * $scope.checkoutPeople);
            $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
        }
        $scope.increaseItemQty = function (item) {
            for (var i = 0; i < $scope.orderItemsNew.length; i++) {
                if ($scope.orderItemsNew[i]._id == item._id && $scope.orderItemsNew[i].quantity >= 1) {
                    $scope.orderItemsNew[i].quantity = $scope.orderItemsNew[i].quantity - 1;
                    var varicost = 0;
                    if (item.variant) {
                        for (var j = 0; j < item.variant.length; j++) {
                            if (item.variant[j].status == 1) {
                                varicost += item.variant[j].price;
                            }
                        }
                    }
                    $scope.orderItemsNew[i].amount = (item.price + varicost) * $scope.orderItemsNew[i].quantity;
                    $scope.orderItemsNew[i].amount = Number(Math.round($scope.orderItemsNew[i].amount + 'e2') + 'e-2');
                }
            }
            var out = 0;
            for (var n in $scope.orderItemsNew) {
                out += $scope.orderItemsNew[n].amount;
            }
            $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + $scope.checkoutPeople + (0.5 * $scope.checkoutPeople);
            $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
        }

        $scope.closeShowCheckoutCart = function () {
            $scope.showCheckoutCart = false;
            $scope.checkoutTotalPrice = 0;
            $scope.checkoutPeople = 0;
            $scope.checkoutPeoplePrice = 0;
        }

        $scope.openPopup = function (order, page, size) {
            $scope.activeOrder = order;
            $scope.editTableInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size
            });
        };

        $scope.deleteOrderItem = function (item, index) {
            RoomService.deleteOrderItem($scope.orderId, item).then(function (data) {
                $scope.orderItems = data.data.item;
                if ($scope.showCheckoutCart) {
                    for (var j = 0; j < $scope.orderItemsNew.length; j++) {
                        if ($scope.orderItemsNew[j]._id == item) {
                            $scope.orderItemsNew.splice(j, 1);
                        }
                    }
                    for (var i = 0; i < $scope.orderItemsNew.length; i++) {
                        if ($scope.orderItemsNew[i]._id == item._id && $scope.orderItemsNew[i].quantity < item.quantity) {
                            $scope.orderItemsNew[i].quantity = $scope.orderItemsNew[i].quantity + 1;
                            var varicost = 0;
                            if (item.variant) {
                                for (var j = 0; j < item.variant.length; j++) {
                                    if (item.variant[j].status == 1) {
                                        varicost += item.variant[j].price;
                                    }
                                }
                            }
                            $scope.orderItemsNew[i].amount = (item.price + varicost) * $scope.orderItemsNew[i].quantity;
                            $scope.orderItemsNew[i].amount = Number(Math.round($scope.orderItemsNew[i].amount + 'e2') + 'e-2');
                        }
                    }
                    var out = 0;
                    for (var n in $scope.orderItemsNew) {
                        out += $scope.orderItemsNew[n].amount;
                    }
                    $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + $scope.checkoutPeople + (0.5 * $scope.checkoutPeople);
                    $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
                }
                var cp = 0;
                var itemno = 0;
                var varicost = 0;
                $scope.orderItemsTotalPrice = 0;
                $scope.orderItemsTotalItem = 0;
                if ($scope.orderItems.length) {
                    for (var i = 0; i < $scope.orderItems.length; i++) {
                        varicost = 0;
                        itemno += $scope.orderItems[i].quantity;
                        if ($scope.orderItems[i].variant) {
                            for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                if ($scope.orderItems[i].variant[j].status == 1) {
                                    varicost += $scope.orderItems[i].variant[j].price;
                                }
                            }
                        }
                        cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                        $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                        $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                        $scope.orderItemsTotalItem = itemno;
                    }
                }
                baRoomService.setOrderItems(data.data.item);
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        //edit Order Item code
        $scope.editOrderItem = function (article) {
            $scope.showLedtSideBar1 = true;
            $scope.showCheckoutCart = false;
            $scope.editNonVariantData = false;
            RoomService.getVariantsAndNotes()
                .then(function (data) {
                    $scope.variantList2 = data.data.variants;
                    $scope.noteList2 = data.data.notes;
                    $scope.articleData2 = angular.copy(article);
                    if ($scope.articleData2.variant.length == 0) {
                        $scope.editNonVariantData = true;
                        $scope.variantData2.quantity = $scope.articleData2.quantity;
                    } else {
                        $scope.editNonVariantData = false;
                        $scope.variantData2.quantity = $scope.articleData2.quantity;
                        $scope.variantData2.variant = $scope.articleData2.variant;
                        $scope.variantData2.notes = $scope.articleData2.notes;
                        if ($scope.articleData2.notes) {
                            $scope.notesarray2 = $scope.articleData2.notes.split(',');
                            for (var i = 0; i < $scope.notesarray2.length; i++) {
                                $scope.notes2[$scope.notesarray2[i]] = true;
                            }
                        }
                        for (var i = 0; i < $scope.variantData2.variant.length; i++) {
                            if ($scope.variantList2.length) {
                                for (var j = 0; j < $scope.variantList2.length; j++) {
                                    if ($scope.variantData2.variant[i].id == $scope.variantList2[j]._id) {
                                        $scope.variantList2[j].status = $scope.variantData2.variant[i].status;
                                    }
                                }
                            }
                        }
                    }
                    if ($scope.articleData2) {
                        $scope.changeTab(6);
                        $rootScope.Order.activeTab[0] = true;
                        $rootScope.Order.activeTab[1] = false;
                    }
                }).catch(function (error) {
                });
        }

        $scope.hideEditOrderItem = function () {
            $scope.editNonVariantData = false;
            $scope.showLedtSideBar1 = false;
            $scope.variantData2 = {
                quantity: 0,
                variant: [],
                notes: ''
            };
            $scope.notes2 = [];
            $scope.notesarray2 = [];
            $scope.articleData2 = {};
        }

        $scope.addNote2 = function (note, i) {
            if ($scope.notes2[note]) {
                $scope.notesarray2.push(note);
            } else {
                $scope.notesarray2.splice($scope.notesarray2.indexOf(note), 1);
            }
            $scope.variantData2.notes = $scope.notesarray2.toString();
        }

        $scope.addRemoveVariant2 = function (variant, status) {
            if (status == 0) {
                variant.status = 0;
            } else {
                variant.status = 1;
            }
            for (var i = 0; i < $scope.variantData2.variant.length; i++) {
                if ($scope.variantData2.variant[i].id == variant._id) {
                    $scope.variantData2.variant.splice(i, 1);
                }
            }
            variant.id = variant._id;
            $scope.variantData2.variant.push(variant);
        }

        $scope.decreaseQty2 = function () {
            var value = $scope.variantData2.quantity;
            value = isNaN(value) ? 0 : value;
            value < 1 ? value = 1 : '';
            value--;
            $scope.variantData2.quantity = value;
        }

        $scope.increaseQty2 = function () {
            var value = $scope.variantData2.quantity;
            value = isNaN(value) ? 0 : value;
            value++;
            $scope.variantData2.quantity = value;
        }

        $scope.saveEditOrderItem = function () {
            if ($scope.articleData2.variant.length == 0) {
                if ($scope.variantData2.quantity == 0) {
                    $scope.variantError2 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                } else {
                    $scope.articleData2.quantity = $scope.variantData2.quantity;
                    RoomService.editOrderItem($scope.orderId, $scope.articleData2._id, $scope.variantData2).then(function (data) {
                        $scope.orderItems = data.data.item;
                        var cp = 0;
                        var itemno = 0;
                        var varicost = 0;
                        $scope.orderItemsTotalPrice = 0;
                        $scope.orderItemsTotalItem = 0;
                        if ($scope.orderItems.length) {
                            for (var i = 0; i < $scope.orderItems.length; i++) {
                                varicost = 0;
                                itemno += $scope.orderItems[i].quantity;
                                if ($scope.orderItems[i].variant && $scope.orderItems[i].variant.length > 0) {
                                    for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                        if ($scope.orderItems[i].variant[j].status == 1) {
                                            varicost += $scope.orderItems[i].variant[j].price;
                                        }
                                    }
                                }
                                cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                                $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                                $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                $scope.orderItemsTotalItem = itemno;
                            }
                        }
                        baRoomService.setOrderItems(data.data.item);
                        $scope.hideEditOrderItem();
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                        }).catch(function (error) {
                        });
                    }).catch(function (error) {
                    });
                }
            } else {
                if ($scope.variantData2.quantity == 0) {
                    $scope.variantError2 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                } else if ($scope.variantData2.quantity > 0 && !$scope.variantData2.variant.length && !$scope.variantData2.notes) {
                    $scope.variantError2 = 'Please select variants/notes';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                } else {
                    $scope.articleData2.quantity = $scope.variantData2.quantity;
                    $scope.articleData2.variant = $scope.variantData2.variant;
                    for (var a = 0; a < $scope.variantData2.variant.length; a++) {
                        delete $scope.variantData2.variant[a]._id;
                        delete $scope.variantData2.variant[a].created_at;
                        delete $scope.variantData2.variant[a].updated_at;
                        delete $scope.variantData2.variant[a].__v;
                        delete $scope.variantData2.variant[a].restro;
                        delete $scope.variantData2.variant[a].isDeleted;
                    }
                    $scope.articleData2.ordernote = $scope.variantData2.notes;
                    RoomService.editOrderItem($scope.orderId, $scope.articleData2._id, $scope.variantData2).then(function (data) {
                        $scope.orderItems = data.data.item;
                        var cp = 0;
                        var itemno = 0;
                        var varicost = 0;
                        $scope.orderItemsTotalPrice = 0;
                        $scope.orderItemsTotalItem = 0;
                        if ($scope.orderItems.length) {
                            for (var i = 0; i < $scope.orderItems.length; i++) {
                                varicost = 0;
                                itemno += $scope.orderItems[i].quantity;
                                if ($scope.orderItems[i].variant && $scope.orderItems[i].variant.length > 0) {
                                    for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                        if ($scope.orderItems[i].variant[j].status == 1) {
                                            varicost += $scope.orderItems[i].variant[j].price;
                                        }
                                    }
                                }
                                cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                                $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                                $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                $scope.orderItemsTotalItem = itemno;
                            }
                        }
                        baRoomService.setOrderItems(data.data.item);
                        $scope.hideEditOrderItem();
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                        }).catch(function (error) {
                        });
                    }).catch(function (error) {
                    });
                }
            }
        }
        
        $rootScope.$on('newItem', function (){
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
                for (var i = 0; i < $scope.rooms.length; i++) {
                    if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                        for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                            if ($scope.rooms[i].tables[j]._id == $scope.tableData["_id"]) {
                                $scope.roomData = angular.copy($scope.rooms[i]);
                                $scope.tableData = angular.copy($scope.rooms[i].tables[j]);
                            }
                        }
                    }
                }
                $rootScope.Order = {
                    errorMsg: '',
                    error: false,
                    selectedItems: {},
                    cartTotalPrice: 0,
                    cartTotalItem: 0,
                    selectedSubcategory: [false],
                    activeTab: [true, false],
                    showMenu: false
                };
                $scope.selectAllClicked = false;
                $scope.selectedCheckoutItems = [];
                $scope.checkoutPeople = 0;
                $scope.checkoutPeoplePrice = 0;
                $scope.checkoutTotalPrice = 0;
                $scope.stepArray = [];
                $scope.roomData = angular.copy($scope.roomData);
                $scope.tableData = angular.copy($scope.tableData);
                baRoomService.setCreateModalCollapsed(true);
                if ($scope.tableData.orderId != null && $scope.tableData.orderId._id) {
                    $scope.orderId = $scope.tableData.orderId._id;
                    $scope.orderItems = $scope.tableData.orderId.item;
                    $rootScope.Order.noOfPeople = $scope.tableData.orderId.noOfPeople;
                    var cp = 0;
                    var itemno = 0;
                    var varicost = 0;
                    $scope.orderItemsTotalPrice = 0;
                    $scope.orderItemsTotalItem = 0;
                    if ($scope.orderItems.length) {
                        for (var i = 0; i < $scope.orderItems.length; i++) {
                            if ($scope.orderItems[i].checkout && ($scope.selectedCheckoutItems.indexOf($scope.orderItems[i]._id) < 0)) {
                                $scope.selectedCheckoutItems.push($scope.orderItems[i]._id);
                            }
                            varicost = 0;
                            itemno += $scope.orderItems[i].quantity;
                            if ($scope.orderItems[i].variant) {
                                for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                    if ($scope.orderItems[i].variant[j].status == 1) {
                                        varicost += $scope.orderItems[i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                            $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                            $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                            $scope.orderItemsTotalItem = itemno;
                        }
                    }
                    baRoomService.setOrderId($scope.tableData.orderId._id);
                    baRoomService.setOrderItems($scope.tableData.orderId.item);
                    for (var i = 0; i < $scope.tableData.orderId.step.length; i++) {
                        $scope.stepArray.push($scope.tableData.orderId.step[i].step);
                    }
                    if ($scope.stepArray.length) {
                        baRoomService.setStepData($scope.stepArray);
                    }
                    var steps = [];
                    var selectedItems = {};
                    if (baRoomService.getStepData()) {
                        steps = baRoomService.getStepData();
                    } else {
                        steps = ['Uscita 1', 'Uscita 2'];
                    }
                    for (var j = 0; j < steps.length; j++) {
                        selectedItems[steps[j]] = [];
                    }
                    $rootScope.Order.selectedItems = selectedItems;
                    $rootScope.Order.cartTotalPrice = 0;
                    $rootScope.Order.cartTotalItem = 0;
                    $rootScope.Order.showMenu = true;
                } else {
                    $scope.orderId = '';
                    $scope.orderItems = [];
                    localStorage.removeItem('orderId');
                    localStorage.removeItem('orderItems');
                }
                if ($scope.tableData.status == 1) {
                    $scope.activeTab = [false, false, false, false, true, false, false];
                } else {
                    $scope.activeTab = [true, false, false, false, false, false, false];
                }
                $scope.showOrder = true;

            }).catch(function (error) {
            });
        });


        $rootScope.$on('neworder', function (){
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
            }).catch(function (error) {
            });
        });

        $rootScope.$on('orderstatus', function (){
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
                for (var i = 0; i < $scope.rooms.length; i++) {
                    if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                        for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                            if ($scope.rooms[i].tables[j]._id == $scope.tableData["_id"]) {
                                $scope.roomData = angular.copy($scope.rooms[i]);
                                $scope.tableData = angular.copy($scope.rooms[i].tables[j]);
                            }
                        }
                    }
                }
                $rootScope.Order = {
                    errorMsg: '',
                    error: false,
                    selectedItems: {},
                    cartTotalPrice: 0,
                    cartTotalItem: 0,
                    selectedSubcategory: [false],
                    activeTab: [true, false],
                    showMenu: false
                };
                $scope.selectAllClicked = false;
                $scope.selectedCheckoutItems = [];
                $scope.checkoutPeople = 0;
                $scope.checkoutPeoplePrice = 0;
                $scope.checkoutTotalPrice = 0;
                $scope.stepArray = [];
                $scope.roomData = angular.copy($scope.roomData);
                $scope.tableData = angular.copy($scope.tableData);
                baRoomService.setCreateModalCollapsed(true);
                if ($scope.tableData.orderId != null && $scope.tableData.orderId._id) {
                    $scope.orderId = $scope.tableData.orderId._id;
                    $scope.orderItems = $scope.tableData.orderId.item;
                    $rootScope.Order.noOfPeople = $scope.tableData.orderId.noOfPeople;
                    var cp = 0;
                    var itemno = 0;
                    var varicost = 0;
                    $scope.orderItemsTotalPrice = 0;
                    $scope.orderItemsTotalItem = 0;
                    if ($scope.orderItems.length) {
                        for (var i = 0; i < $scope.orderItems.length; i++) {
                            if ($scope.orderItems[i].checkout && ($scope.selectedCheckoutItems.indexOf($scope.orderItems[i]._id) < 0)) {
                                $scope.selectedCheckoutItems.push($scope.orderItems[i]._id);
                            }
                            varicost = 0;
                            itemno += $scope.orderItems[i].quantity;
                            if ($scope.orderItems[i].variant) {
                                for (var j = 0; j < $scope.orderItems[i].variant.length; j++) {
                                    if ($scope.orderItems[i].variant[j].status == 1) {
                                        varicost += $scope.orderItems[i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($scope.orderItems[i].price + varicost) * $scope.orderItems[i].quantity;
                            $scope.orderItemsTotalPrice = cp + $rootScope.Order.noOfPeople + (0.5 * $rootScope.Order.noOfPeople);
                            $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                            $scope.orderItemsTotalItem = itemno;
                        }
                    }
                    baRoomService.setOrderId($scope.tableData.orderId._id);
                    baRoomService.setOrderItems($scope.tableData.orderId.item);
                    for (var i = 0; i < $scope.tableData.orderId.step.length; i++) {
                        $scope.stepArray.push($scope.tableData.orderId.step[i].step);
                    }
                    if ($scope.stepArray.length) {
                        baRoomService.setStepData($scope.stepArray);
                    }
                    var steps = [];
                    var selectedItems = {};
                    if (baRoomService.getStepData()) {
                        steps = baRoomService.getStepData();
                    } else {
                        steps = ['Uscita 1', 'Uscita 2'];
                    }
                    for (var j = 0; j < steps.length; j++) {
                        selectedItems[steps[j]] = [];
                    }
                    $rootScope.Order.selectedItems = selectedItems;
                    $rootScope.Order.cartTotalPrice = 0;
                    $rootScope.Order.cartTotalItem = 0;
                    $rootScope.Order.showMenu = true;
                } else {
                    $scope.orderId = '';
                    $scope.orderItems = [];
                    localStorage.removeItem('orderId');
                    localStorage.removeItem('orderItems');
                }
                if ($scope.tableData.status == 1) {
                    $scope.activeTab = [false, false, false, false, true, false, false];
                } else {
                    $scope.activeTab = [true, false, false, false, false, false, false];
                }
                $scope.showOrder = true;

            }).catch(function (error) {
            });
        });
    }

    function StepsController($scope, $rootScope, RoomService, AlertService, baRoomService) {
        $scope.stepArray = ['Uscita 1', 'Uscita 2'];
        $scope.activeStepTab = [];
        if (baRoomService.getOrderId()) {
            if (baRoomService.getTabData()) {
                $scope.activeStepTab[baRoomService.getTabData().tab] = true;
            } else {
                $scope.activeStepTab[0] = true;
            }
            var orderItems = JSON.parse(localStorage.getItem('orderItems'));
            if (baRoomService.getStepData()) {
                $scope.stepArray = baRoomService.getStepData();
            } else {
                $scope.stepArray = ['Uscita 1', 'Uscita 2'];
            }
            for (var i = 0; i < orderItems.length; i++) {
                if ($scope.stepArray.indexOf(orderItems[i].step) < 0) {
                    $scope.stepArray.push(orderItems[i].step);
                }
            }
            if (baRoomService.getTabData()) {
                var tabdata = {
                    tab: baRoomService.getTabData().tab,
                    step: baRoomService.getTabData().step
                }
                baRoomService.setTabData(tabdata);
            } else {
                var tabadata = {
                    tab: 0,
                    step: $scope.stepArray[0]
                }
                baRoomService.setTabData(tabadata);
            }
            baRoomService.setStepData($scope.stepArray);
        }

        var step = baRoomService.getStepData();
        var data = baRoomService.getTabData();
        if (step && step.length) {
            $scope.stepArray = step;
        }
        if (data && data.tab) {
            $scope.activeStepTab[data.tab] = true;
            var stepdata = {
                tab: data.tab,
                step: data.step
            }
            baRoomService.setTabData(stepdata);
        } else {
            $scope.activeStepTab[0] = true;
            var stepdata = {
                tab: 0,
                step: $scope.stepArray[0]
            }
            baRoomService.setTabData(stepdata);
        }

        $scope.addStep = function () {
            var count = this.stepArray.length + 1;
            $scope.stepArray.push('Uscita ' + count);
            var step = 'Uscita ' + count;
            baRoomService.setStepData($scope.stepArray);
            RoomService.getCategoryWithItems().then(function (data) {
                    if (data.data.length) {
                        for (var i = 0; i < data.data.length; i++) {
                            $rootScope.Order.selectedItems[step] = [];
                            if ($rootScope.Order.selectedCategory && data.data[i].category._id == $rootScope.Order.selectedCategory._id) {
                                $rootScope.Order.categoryItems[step] = angular.copy(data.data[i].items);
                                for (var j = 0; j < $rootScope.Order.categoryItems[step].length; j++) {
                                    $rootScope.Order.categoryItems[step][j].quantity = 0;
                                    $rootScope.Order.categoryItems[step][j].itemTotal = 0;
                                }
                            }
                        }
                    }
                })
                .catch(function (error) {
                });
        }

        $scope.selectedTab = function (step, tab) {
            $scope.activeStepTab[tab] = true;
            for (var i = 0; i < $scope.activeStepTab.length; i++) {
                if (i != tab) {
                    $scope.activeStepTab[i] = false;
                }
            }
            var data = {
                tab: tab,
                step: step
            }
            baRoomService.setTabData(data);
        }
    }

    function ViewRoomsController($scope, $stateParams, $state, RoomService, AlertService) {
        var id = $stateParams.id;
        $scope.roomDetail = RoomService.getRoomDetails();
        if (!$scope.roomDetail)
            $state.go('rooms');
    }
})();