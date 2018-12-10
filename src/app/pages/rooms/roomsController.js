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
    function RoomsController($scope, $rootScope, baRoomService, baSidebarService, $uibModal, $state, $http, $translate, $timeout, RoomService, CategoryService, AlertService, ItemService, $q, OrderService) {
        console.log($translate.instant('Rooms'));
        $scope.tableModal = false;
        $scope.editTableModal = false;
        $scope.isMultiple = false;
        $scope.showAddArticle = false;
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
        $scope.activeTab = [true, false, false, false, false, false, false, false];
        $scope.showCategory = false;
        $scope.variantList = [];
        $scope.noteList = [];
        $scope.notes = [];
        $scope.notesarray = [];
        $scope.showLedtSideBar = false;
        $scope.showCheckoutCart = false;
        $scope.variantData = {
            quantity: 1,
            variant: [],
            notes: ''
        };
        $scope.variantError = '';
        $scope.loader = false;
        $scope.variantList1 = [];
        $scope.noteList1 = [];
        $scope.variantData1 = {
            quantity: 1,
            variant: [],
            notes: '',
            price: ''
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
            quantity: 1,
            variant: [],
            notes: '',
            price: ''
        }
        $scope.notes2 = [];
        $scope.notesarray2 = [];
        $scope.variantError2 = '';
        $scope.editNonVariantData = false;
        $scope.showLedtSideBar1 = false;
        $scope.orderid = '';

        $scope.variantList3 = [];
        $scope.noteList3 = [];
        $scope.notes3 = [];
        $scope.notesarray3 = [];
        $scope.variantError3 = '';
        $scope.subCategories = [];

        $q.all([
            RoomService.getCategories()
        ]).then(function (data) {
            $scope.categories = data[0].data;
        });
        //Fetch Room list
        $scope.loader = true;
        RoomService.getRooms().then(function (data) {  
            $scope.loader = false;         
            $scope.rooms = RoomService.listRoom();
        }).catch(function (error) {
            $scope.rooms = [];
            $scope.loader = false;
        });
        $scope.getRoomList = function () {
            $scope.loader = true;
            RoomService.getRooms().then(function (data) {
                $scope.loader = false;
                $scope.rooms = RoomService.listRoom();
            }).catch(function (error) {
                $scope.rooms = [];
                $scope.loader = false;
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
            $rootScope.tableData = angular.copy(table);
            baRoomService.setCreateModalCollapsed(true);
            if ($rootScope.tableData.orderId.length) {
                $rootScope.Order.noOfPeople = $rootScope.tableData.orderId[0].noOfPeople;
                $rootScope.Order.seatCost = $rootScope.tableData.orderId[$rootScope.tableData.orderId.length-1].seatCost;                
                var cp = 0;
                var itemno = 0;
                var varicost = 0;
                $scope.orderItemsTotalPrice = 0;
                $scope.orderItemsTotalItem = 0;
                for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                    for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                        varicost = 0;
                        itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                        if ($rootScope.tableData.orderId[k].item[i].variant) {
                            for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                    varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                }
                            }
                        }
                        cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                        $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                        $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                        $scope.orderItemsTotalItem = itemno;
                    }
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
            }
            if ($rootScope.tableData.orderId.length) {
                $scope.activeTab = [false, false, false, false, true, false, false, false];
            } else {
                $scope.activeTab = [true, false, false, false, false, false, false, false];
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
            $scope.activeTab = [true, false, false, false, false, false, false, false];
            $scope.showOrder = false;
            $scope.showCheckoutCart = false;
            $scope.showLedtSideBar = false;
            $scope.showLedtSideBar1 = false;
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
                        price: Number($rootScope.Order.selectedItems[steps[a]][i].price),
                        notes: $rootScope.Order.selectedItems[steps[a]][i].ordernote ? $rootScope.Order.selectedItems[steps[a]][i].ordernote : '',
                        variant: vararray,
                        step: $rootScope.Order.selectedItems[steps[a]][i].step,
                        department: $rootScope.Order.selectedItems[steps[a]][i].category.department,
                        preparationTime: $rootScope.Order.selectedItems[steps[a]][i].preparationTime
                    }
                    itemarray.push(item);
                }
            }
            var createorder = {
                room: $scope.roomData["_id"],
                table: $rootScope.tableData["_id"],
                noOfPeople: $rootScope.Order.noOfPeople,
                item: itemarray
            }
            RoomService.createOrder(createorder)
                .then(function (data) {
                    AlertService.success('createOrderMsg', data.message, 4000);
                    RoomService.getRooms().then(function (data) {
                        $scope.rooms = RoomService.listRoom();
                        for (var i = 0; i < $scope.rooms.length; i++) {
                            if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                                for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                                    if ($scope.rooms[i].tables[j]._id == $rootScope.tableData["_id"]) {
                                        $scope.roomData = angular.copy($scope.rooms[i]);
                                        $rootScope.tableData = angular.copy($scope.rooms[i].tables[j]);
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
                        $rootScope.tableData = angular.copy($rootScope.tableData);
                        baRoomService.setCreateModalCollapsed(true);
                        if ($rootScope.tableData.orderId.length) {
                            $rootScope.Order.noOfPeople = $rootScope.tableData.orderId[0].noOfPeople;
                            $rootScope.Order.seatCost = $rootScope.tableData.orderId[$rootScope.tableData.orderId.length-1].seatCost;                                            
                            var cp = 0;
                            var itemno = 0;
                            var varicost = 0;
                            $scope.orderItemsTotalPrice = 0;
                            $scope.orderItemsTotalItem = 0;
                            for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                                for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                                    varicost = 0;
                                    itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                                    if ($rootScope.tableData.orderId[k].item[i].variant) {
                                        for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                            if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                                varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                            }
                                        }
                                    }
                                    cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                                    $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                                    $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                    $scope.orderItemsTotalItem = itemno;
                                }
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
                        }
                        if ($rootScope.tableData.orderId.length) {
                            $scope.activeTab = [false, false, false, false, true, false, false, false];
                        } else {
                            $scope.activeTab = [true, false, false, false, false, false, false, false];
                        }
                        $scope.showOrder = true;
                    }).catch(function (error) {
                    });
                })
                .catch(function (error) {
                    AlertService.error('createOrderMsg', error.message, 4000);
                });
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
                quantity: 1,
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
            var varIds = [];
            if ($scope.variantData.variant.length) {
              for (var i = 0; i < $scope.variantData.variant.length; i++) {
                varIds.push($scope.variantData.variant[i]._id);
                if ($scope.variantData.variant[i]._id == variant._id) {
                  if ($scope.variantData.variant[i].status == status) {
                    delete variant.status;
                    $scope.variantData.variant.splice(i, 1);
                  }
                  else {
                    variant.status = status;
                    $scope.variantData.variant[i].status = status;
                  }
                }
              }
              if (varIds.length == $scope.variantData.variant.length) {
                if (varIds.indexOf(variant._id) < 0) {
                  variant.status = status;
                  $scope.variantData.variant.push(variant);
                }
              }
            }
            else {
              variant.status = status;
              $scope.variantData.variant.push(variant);
            }

            // var arr = [];
            // console.log('variant, status', variant, status, $scope.variantData);
            // if ($scope.variantData.variant.length == 0) {
            //     variant.status = angular.copy(status);
            //     $scope.variantData.variant.push(variant);
            //     arr.push(variant._id);
            // }
            // else {
            //     for (var i = 0; i < $scope.variantData.variant.length; i++) {
            //         if (arr.indexOf($scope.variantData.variant[i]._id) == -1) {
            //             arr.push($scope.variantData.variant[i]._id);
            //         }
            //     }
            //     console.log('arr', arr);
            //     if (arr.length == $scope.variantData.variant.length) {
            //         if (arr.indexOf(variant._id) > -1) {
            //             console.log("if")
            //             for (var i = 0; i < $scope.variantData.variant.length; i++) {
            //                 if ($scope.variantData.variant[i]._id == variant._id) {
            //                     if ($scope.variantData.variant[i].status == status) {
            //                         $scope.variantData.variant.splice(i, 1);
            //                         delete variant.status;
            //                     }
            //                     else {
            //                         variant.status = angular.copy(status);
            //                         $scope.variantData.variant[i].status = angular.copy(status);
            //                     }
            //                 }
            //                 console.log('if $scope.variantData', $scope.variantData);
            //             }
            //         }
            //         else {
            //             console.log("else")
            //             arr.push(variant._id);
            //             variant.status = angular.copy(status);
            //             $scope.variantData.variant.push(variant);
            //             console.log('else $scope.variantData', $scope.variantData);
            //         }
            //     }
            // }


        // if (status == 0) {
        //     variant.status = 0;
        // } else {
        //     variant.status = 1;
        // }
        // for (var i = 0; i < $scope.variantData.variant.length; i++) {
        //     if ($scope.variantData.variant[i]._id == variant._id) {
        //         $scope.variantData.variant.splice(i, 1);
        //     }
        // }
        // $scope.variantData.variant.push(variant);
    }

        $scope.decreaseQty = function () {
            var value = $scope.variantData.quantity;
            value = isNaN(value) ? 2 : value;
            value < 2 ? value = 2 : '';
            value--;
            $scope.variantData.quantity = value;
        }

        $scope.increaseQty = function () {
            var value = $scope.variantData.quantity;
            value = isNaN(value) ? 1 : value;
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
                    if (!$scope.articleData1.variant || $scope.articleData1.variant.length == 0) {
                        $scope.nonVariantData = true;
                        $scope.variantData1.quantity = $scope.articleData1.quantity;
                        $scope.variantData1.price = $scope.articleData1.price;                        
                    } else {
                        $scope.nonVariantData = false;
                        $scope.variantData1.quantity = $scope.articleData1.quantity;
                        $scope.variantData1.price = $scope.articleData1.price;                                                
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
            $scope.changeTab(1);
            $scope.nonVariantData = false;
            $scope.variantData1 = {
                quantity: 1,
                variant: [],
                notes: '',
                price: ''
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
            var varIds = [];
            if ($scope.variantData1.variant.length) {
              for (var i = 0; i < $scope.variantData1.variant.length; i++) {
                varIds.push($scope.variantData1.variant[i]._id);
                if ($scope.variantData1.variant[i]._id == variant._id) {
                  if ($scope.variantData1.variant[i].status == status) {
                    delete variant.status;
                    $scope.variantData1.variant.splice(i, 1);
                  }
                  else {
                    variant.status = status;
                    $scope.variantData1.variant[i].status = status;
                  }
                }
              }
              if (varIds.length == $scope.variantData1.variant.length) {
                if (varIds.indexOf(variant._id) < 0) {
                  variant.status = status;
                  $scope.variantData1.variant.push(variant);
                }
              }
            }
            else {
              variant.status = status;
              $scope.variantData1.variant.push(variant);
            }

            // var arr = [];
            // console.log('variant, status', variant, status);
            // if ($scope.variantData1.variant.length == 0) {
            //     variant.status = angular.copy(status);
            //     $scope.variantData1.variant.push(variant);
            //     arr.push(variant._id);
            // }
            // else {
            //     for (var i = 0; i < $scope.variantData1.variant.length; i++) {
            //         if (arr.indexOf($scope.variantData1.variant[i]._id) == -1) {
            //             arr.push($scope.variantData1.variant[i]._id);
            //         }
            //     }
            //     console.log('arr', arr);
            //     if (arr.length == $scope.variantData1.variant.length) {
            //         if (arr.indexOf(variant._id) > -1) {
            //             console.log("if")
            //             for (var i = 0; i < $scope.variantData1.variant.length; i++) {
            //                 if ($scope.variantData1.variant[i]._id == variant._id) {
            //                     if ($scope.variantData1.variant[i].status == status) {
            //                         $scope.variantData1.variant.splice(i, 1);
            //                         delete variant.status;
            //                     }
            //                     else {
            //                         variant.status = angular.copy(status);
            //                         $scope.variantData1.variant[i].status = angular.copy(status);
            //                     }
            //                 }
            //                 console.log('if $scope.variantData1', $scope.variantData1);
            //             }
            //         }
            //         else {
            //             console.log("else")
            //             arr.push(variant._id);
            //             variant.status = angular.copy(status);
            //             $scope.variantData1.variant.push(variant);
            //             console.log('else $scope.variantData1', $scope.variantData1);
            //         }
            //     }
            // }

            // if (status == 0) {
            //     variant.status = 0;
            // } else {
            //     variant.status = 1;
            // }
            // for (var i = 0; i < $scope.variantData1.variant.length; i++) {
            //     if ($scope.variantData1.variant[i]._id == variant._id) {
            //         $scope.variantData1.variant.splice(i, 1);
            //     }
            // }
            // $scope.variantData1.variant.push(variant);
        }

        $scope.decreaseQty1 = function () {
            var value = $scope.variantData1.quantity;
            value = isNaN(value) ? 2 : value;
            value < 2 ? value = 2 : '';
            value--;
            $scope.variantData1.quantity = value;
        }

        $scope.increaseQty1 = function () {
            var value = $scope.variantData1.quantity;
            value = isNaN(value) ? 1 : value;
            value++;
            $scope.variantData1.quantity = value;
        }

        $scope.saveVariantData1 = function () {
            if (!$scope.articleData1.variant || $scope.articleData1.variant.length == 0) {
                if ($scope.variantData1.quantity == 0) {
                    $scope.variantError1 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                }
                else if ($scope.variantData1.price == 0 || $scope.variantData1.price == '') {
                    $scope.variantError1 = 'Please enter price';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                }
                else {
                    $scope.articleData1.quantity = $scope.variantData1.quantity;
                    if($scope.articleData1.isDeleted){
                        $scope.articleData1.price = $scope.variantData1.price;                    
                    }
                    for (var i = 0; i < $rootScope.Order.selectedItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.selectedItems[$scope.articleData1.step][i]._id == $scope.articleData1._id && (!$rootScope.Order.selectedItems[$scope.articleData1.step][i].variant || $rootScope.Order.selectedItems[$scope.articleData1.step][i].variant.length == 0)) {
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].quantity = $scope.articleData1.quantity;
                            if($scope.articleData1.isDeleted){
                                $rootScope.Order.selectedItems[$scope.articleData1.step][i].price = $scope.articleData1.price;                    
                            }
                        }
                    }
                    // for (var i = 0; i < $rootScope.Order.categoryItems[$scope.articleData1.step].length; i++) {
                    //     if ($rootScope.Order.categoryItems[$scope.articleData1.step][i]._id == $scope.articleData1._id) {
                    //         $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal = $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal + $scope.articleData1.quantity;
                    //     }
                    // }
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
                    $scope.hideVarient1();
                }
            } else {
                if ($scope.variantData1.quantity == 0) {
                    $scope.variantError1 = 'Please enter quantity';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                }
                else if ($scope.variantData1.price == 0 || $scope.variantData1.price == '') {
                    $scope.variantError1 = 'Please enter price';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                }
                else if ($scope.variantData1.quantity > 0 && !$scope.variantData1.variant.length && !$scope.variantData1.notes) {
                    $scope.variantError1 = 'Please select variants/notes';
                    $timeout(function () {
                        $scope.variantError1 = '';
                    }, 4000);
                } else {
                    $scope.articleData1.quantity = $scope.variantData1.quantity;
                    if($scope.articleData1.isDeleted){
                        $scope.articleData1.price = $scope.variantData1.price;                    
                    }
                    $scope.articleData1.variant = $scope.variantData1.variant;
                    $scope.articleData1.ordernote = $scope.variantData1.notes;
                    for (var i = 0; i < $rootScope.Order.selectedItems[$scope.articleData1.step].length; i++) {
                        if ($rootScope.Order.selectedItems[$scope.articleData1.step][i]._id == $scope.articleData1._id && $rootScope.Order.selectedItems[$scope.articleData1.step][i].variant && $rootScope.Order.selectedItems[$scope.articleData1.step][i].variantUniqueId == $scope.articleData1.variantUniqueId) {
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].quantity = $scope.articleData1.quantity;
                            if($scope.articleData1.isDeleted){
                                $rootScope.Order.selectedItems[$scope.articleData1.step][i].price = $scope.articleData1.price;                    
                            }
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].variant = $scope.articleData1.variant;
                            $rootScope.Order.selectedItems[$scope.articleData1.step][i].ordernote = $scope.articleData1.ordernote;
                        }
                    }
                    // for (var i = 0; i < $rootScope.Order.categoryItems[$scope.articleData1.step].length; i++) {
                    //     if ($rootScope.Order.categoryItems[$scope.articleData1.step][i]._id == $scope.articleData1._id) {
                    //         $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal = $rootScope.Order.categoryItems[$scope.articleData1.step][i].itemTotal + $scope.articleData1.quantity;
                    //     }
                    // }
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
                    $scope.hideVarient1();
                }
            }
        }
        $scope.showLeftSide = function () {
            $scope.showLedtSideBar = true;
        }
        $scope.hideLeftSide = function () {
            $scope.showLedtSideBar = false;
        }
        
        $scope.decreasePeople = function () {
            if ($rootScope.Order.noOfPeople > 0) {
                $rootScope.Order.noOfPeople = $rootScope.Order.noOfPeople - 1;
                var opts = {
                    noOfPeople: $rootScope.Order.noOfPeople
                }
                RoomService.updateNoOfPeople($scope.roomData["_id"], $rootScope.tableData["_id"], opts).then(function (data) {
                    $scope.orderItemsTotalPrice = $scope.orderItemsTotalPrice - Number(data.data.seatCost);
                    $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
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
            var opts = {
                noOfPeople: $rootScope.Order.noOfPeople
            }
            RoomService.updateNoOfPeople($scope.roomData["_id"], $rootScope.tableData["_id"], opts).then(function (data) {
                $scope.orderItemsTotalPrice = $scope.orderItemsTotalPrice + Number(data.data.seatCost);
                $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
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
                $scope.checkoutPeoplePrice = (Number($rootScope.Order.seatCost) * $scope.checkoutPeople);
                $scope.checkoutPeoplePrice = Number(Math.round($scope.checkoutPeoplePrice + 'e2') + 'e-2');
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2') + Number($rootScope.Order.seatCost);
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
            }
        }
        $scope.increaseCheckoutPeople = function () {
            if ($scope.checkoutPeople >= 1) {
                $scope.checkoutPeople = $scope.checkoutPeople - 1;
                $scope.checkoutPeoplePrice = (Number($rootScope.Order.seatCost) * $scope.checkoutPeople);
                $scope.checkoutPeoplePrice = Number(Math.round($scope.checkoutPeoplePrice + 'e2') + 'e-2');
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2') - Number($rootScope.Order.seatCost);
                $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
            }
        }

        $scope.checkout = function () {
            OrderService.checkoutTable($scope.roomData["_id"], $rootScope.tableData["_id"]).then(function (data) {
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
            for (var i = 0; i < $rootScope.tableData.orderId.length; i++) {
                for(var j = 0; j < $rootScope.tableData.orderId[i].item.length; j++)
                $scope.orderItemsNew.push({
                    _id: $rootScope.tableData.orderId[i].item[j]._id,
                    name: $rootScope.tableData.orderId[i].item[j].id.name,
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
            $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + (Number($rootScope.Order.seatCost) * $scope.checkoutPeople);
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
            $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + (Number($rootScope.Order.seatCost) * $scope.checkoutPeople);
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

        $scope.deleteOrderItem = function (orderId, item, index) {
            RoomService.deleteOrderItem(orderId, item).then(function (data) {
                if ($rootScope.tableData.orderId.length) {
                    for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                        if($rootScope.tableData.orderId[k]._id == data.data._id){
                            $rootScope.tableData.orderId[k] = angular.copy(data.data);
                        }
                    }
                }
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
                    $scope.checkoutTotalPrice = Number(Math.round(out + 'e2') + 'e-2') + (Number($rootScope.Order.seatCost) * $scope.checkoutPeople);
                    $scope.checkoutTotalPrice = Number(Math.round($scope.checkoutTotalPrice + 'e2') + 'e-2');
                }
                var cp = 0;
                var itemno = 0;
                var varicost = 0;
                $scope.orderItemsTotalPrice = 0;
                $scope.orderItemsTotalItem = 0;
                if ($rootScope.tableData.orderId.length) {
                    for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                        for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                            varicost = 0;
                            itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                            if ($rootScope.tableData.orderId[k].item[i].variant) {
                                for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                    if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                        varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                            $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                            $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                            $scope.orderItemsTotalItem = itemno;
                        }
                    }
                }
                RoomService.getRooms().then(function (data) {
                    $scope.rooms = RoomService.listRoom();
                }).catch(function (error) {
                });
            }).catch(function (error) {
            });
        }

        //edit Order Item code
        $scope.editOrderItem = function (orderId, article) {
            $scope.orderid = orderId;
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
                        $scope.variantData2.price = $scope.articleData2.price;
                    } else {
                        $scope.editNonVariantData = false;
                        $scope.variantData2.quantity = $scope.articleData2.quantity;
                        $scope.variantData2.price = $scope.articleData2.price;                        
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
            $scope.changeTab(1);
            $scope.editNonVariantData = false;
            $scope.showLedtSideBar1 = false;
            $scope.variantData2 = {
                quantity: 1,
                variant: [],
                notes: '',
                price: ''
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
            var varIds = [];
            if ($scope.variantData2.variant.length) {
              for (var i = 0; i < $scope.variantData2.variant.length; i++) {
                varIds.push($scope.variantData2.variant[i].id);
                if ($scope.variantData2.variant[i].id == variant._id) {
                  if ($scope.variantData2.variant[i].status == status) {
                    delete variant.status;
                    $scope.variantData2.variant.splice(i, 1);
                  }
                  else {
                    variant.status = status;
                    $scope.variantData2.variant[i].status = status;
                  }
                }
              }
              if (varIds.length == $scope.variantData2.variant.length) {
                if (varIds.indexOf(variant._id) < 0) {
                  variant.status = status;
                  $scope.variantData2.variant.push(variant);
                }
              }
            }
            else {
              variant.status = status;
              $scope.variantData2.variant.push(variant);
            }
            variant.id = variant._id;

            // var arr = [];
            // console.log('variant, status', variant, status);
            // if ($scope.variantData2.variant.length == 0) {
            //     variant.status = angular.copy(status);
            //     $scope.variantData2.variant.push(variant);
            //     arr.push(variant._id);
            // }
            // else {
            //     for (var i = 0; i < $scope.variantData2.variant.length; i++) {
            //         if (arr.indexOf($scope.variantData2.variant[i].id) == -1) {
            //             arr.push($scope.variantData2.variant[i].id);
            //         }
            //     }
            //     console.log('arr', arr);
            //     if (arr.length == $scope.variantData2.variant.length) {
            //         if (arr.indexOf(variant._id) > -1) {
            //             console.log("if")
            //             for (var i = 0; i < $scope.variantData2.variant.length; i++) {
            //                 if ($scope.variantData2.variant[i].id == variant._id) {
            //                     if ($scope.variantData2.variant[i].status == status) {
            //                         $scope.variantData2.variant.splice(i, 1);
            //                         delete variant.status;
            //                     }
            //                     else {
            //                         variant.status = angular.copy(status);
            //                         $scope.variantData2.variant[i].status = angular.copy(status);
            //                     }
            //                 }
            //                 console.log('if $scope.variantData2', $scope.variantData2);
            //             }
            //         }
            //         else {
            //             console.log("else")
            //             arr.push(variant._id);
            //             variant.status = angular.copy(status);
            //             $scope.variantData2.variant.push(variant);
            //             console.log('else $scope.variantData2', $scope.variantData2);
            //         }
            //     }
            // }
            // variant.id = variant._id;

            // if (status == 0) {
            //     variant.status = 0;
            // } else {
            //     variant.status = 1;
            // }
            // for (var i = 0; i < $scope.variantData2.variant.length; i++) {
            //     if ($scope.variantData2.variant[i].id == variant._id) {
            //         $scope.variantData2.variant.splice(i, 1);
            //     }
            // }
            // variant.id = variant._id;
            // $scope.variantData2.variant.push(variant);
        }

        $scope.decreaseQty2 = function () {
            var value = $scope.variantData2.quantity;
            value = isNaN(value) ? 2 : value;
            value < 2 ? value = 2 : '';
            value--;
            $scope.variantData2.quantity = value;
        }

        $scope.increaseQty2 = function () {
            var value = $scope.variantData2.quantity;
            value = isNaN(value) ? 1 : value;
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
                }
                else if ($scope.variantData2.price == 0 || $scope.variantData2.price == '') {
                    $scope.variantError2 = 'Please enter price';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                }
                else {
                    $scope.articleData2.quantity = $scope.variantData2.quantity;
                    if($scope.articleData2.id.isDeleted){
                        $scope.articleData2.price = $scope.variantData2.price;  
                        $scope.variantData2.price = Number($scope.variantData2.price); 
                    }
                    else{
                        delete $scope.variantData2.price;
                    }                                     
                    RoomService.editOrderItem($scope.orderid, $scope.articleData2._id, $scope.variantData2).then(function (data) {
                        if ($rootScope.tableData.orderId.length) {
                            for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                                if($rootScope.tableData.orderId[k]._id == data.data._id){
                                    $rootScope.tableData.orderId[k] = angular.copy(data.data);
                                }
                            }
                        }
                        $scope.orderid = '';
                        var cp = 0;
                        var itemno = 0;
                        var varicost = 0;
                        $scope.orderItemsTotalPrice = 0;
                        $scope.orderItemsTotalItem = 0;
                        if ($rootScope.tableData.orderId.length) {
                            for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                                for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                                    varicost = 0;
                                    itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                                    if ($rootScope.tableData.orderId[k].item[i].variant) {
                                        for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                            if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                                varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                            }
                                        }
                                    }
                                    cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                                    $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                                    $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                    $scope.orderItemsTotalItem = itemno;
                                }
                            }
                        }
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
                }
                else if ($scope.variantData2.price == 0 || $scope.variantData2.price == '') {
                    $scope.variantError2 = 'Please enter price';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                }
                else if ($scope.variantData2.quantity > 0 && !$scope.variantData2.variant.length && !$scope.variantData2.notes) {
                    $scope.variantError2 = 'Please select variants/notes';
                    $timeout(function () {
                        $scope.variantError2 = '';
                    }, 4000);
                } else {
                    $scope.articleData2.quantity = $scope.variantData2.quantity;
                    if($scope.articleData2.id.isDeleted){
                        $scope.articleData2.price = $scope.variantData2.price;  
                        $scope.variantData2.price = Number($scope.variantData2.price); 
                    }
                    else{
                        delete $scope.variantData2.price;
                    }  
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
                    RoomService.editOrderItem($scope.orderid, $scope.articleData2._id, $scope.variantData2).then(function (data) {
                        if ($rootScope.tableData.orderId.length) {
                            for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                                if($rootScope.tableData.orderId[k]._id == data.data._id){
                                    $rootScope.tableData.orderId[k] = angular.copy(data.data);
                                }
                            }
                        }
                        $scope.orderid = '';
                        var cp = 0;
                        var itemno = 0;
                        var varicost = 0;
                        $scope.orderItemsTotalPrice = 0;
                        $scope.orderItemsTotalItem = 0;
                        if ($rootScope.tableData.orderId.length) {
                            for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                                for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                                    varicost = 0;
                                    itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                                    if ($rootScope.tableData.orderId[k].item[i].variant) {
                                        for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                            if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                                varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                            }
                                        }
                                    }
                                    cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                                    $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                                    $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                    $scope.orderItemsTotalItem = itemno;
                                }
                            }
                        }
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

        $rootScope.$on('tablestatus', function (){
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
                if($scope.rooms && $scope.rooms.length && $scope.roomData && $scope.roomData["_id"]){
                    for (var i = 0; i < $scope.rooms.length; i++) {
                        if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                            for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                                if ($scope.rooms[i].tables[j]._id == $rootScope.tableData["_id"]) {
                                    $scope.roomData = angular.copy($scope.rooms[i]);
                                    $rootScope.tableData = angular.copy($scope.rooms[i].tables[j]);
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
                    $rootScope.tableData = angular.copy($rootScope.tableData);
                    baRoomService.setCreateModalCollapsed(true);
                    if ($rootScope.tableData.orderId.length) {
                        $rootScope.Order.noOfPeople = $rootScope.tableData.orderId[0].noOfPeople;
                        $rootScope.Order.seatCost = $rootScope.tableData.orderId[$rootScope.tableData.orderId.length-1].seatCost;                                        
                        var cp = 0;
                        var itemno = 0;
                        var varicost = 0;
                        $scope.orderItemsTotalPrice = 0;
                        $scope.orderItemsTotalItem = 0;
                        for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                            for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                                varicost = 0;
                                itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                                if ($rootScope.tableData.orderId[k].item[i].variant) {
                                    for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                        if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                            varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                        }
                                    }
                                }
                                cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                                $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                                $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                                $scope.orderItemsTotalItem = itemno;
                            }
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
                    }
                    if ($rootScope.tableData.orderId.length) {
                        $scope.activeTab = [false, false, false, false, true, false, false, false];
                    } else {
                        $scope.activeTab = [true, false, false, false, false, false, false, false];
                    }
                    $scope.showOrder = true; 
                }
                
            }).catch(function (error) {
            });
        });

        $rootScope.$on('orderstatus', function (){
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
                for (var i = 0; i < $scope.rooms.length; i++) {
                    if ($scope.rooms[i]._id == $scope.roomData["_id"]) {
                        for (var j = 0; j < $scope.rooms[i].tables.length; j++) {
                            if ($scope.rooms[i].tables[j]._id == $rootScope.tableData["_id"]) {
                                $scope.roomData = angular.copy($scope.rooms[i]);
                                $rootScope.tableData = angular.copy($scope.rooms[i].tables[j]);
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
                $rootScope.tableData = angular.copy($rootScope.tableData);
                baRoomService.setCreateModalCollapsed(true);
                if ($rootScope.tableData.orderId.length) {
                    $rootScope.Order.noOfPeople = $rootScope.tableData.orderId[0].noOfPeople;
                    $rootScope.Order.seatCost = $rootScope.tableData.orderId[$rootScope.tableData.orderId.length-1].seatCost;                                    
                    var cp = 0;
                    var itemno = 0;
                    var varicost = 0;
                    $scope.orderItemsTotalPrice = 0;
                    $scope.orderItemsTotalItem = 0;
                    for (var k = 0; k < $rootScope.tableData.orderId.length; k++) {
                        for (var i = 0; i < $rootScope.tableData.orderId[k].item.length; i++) {
                            varicost = 0;
                            itemno += $rootScope.tableData.orderId[k].item[i].quantity;
                            if ($rootScope.tableData.orderId[k].item[i].variant) {
                                for (var j = 0; j < $rootScope.tableData.orderId[k].item[i].variant.length; j++) {
                                    if ($rootScope.tableData.orderId[k].item[i].variant[j].status == 1) {
                                        varicost += $rootScope.tableData.orderId[k].item[i].variant[j].price;
                                    }
                                }
                            }
                            cp += ($rootScope.tableData.orderId[k].item[i].price + varicost) * $rootScope.tableData.orderId[k].item[i].quantity;
                            $scope.orderItemsTotalPrice = cp + (Number($rootScope.Order.seatCost) * $rootScope.Order.noOfPeople);
                            $scope.orderItemsTotalPrice = Number(Math.round($scope.orderItemsTotalPrice + 'e2') + 'e-2');
                            $scope.orderItemsTotalItem = itemno;
                        }
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
                }
                if ($rootScope.tableData.orderId.length) {
                    $scope.activeTab = [false, false, false, false, true, false, false, false];
                } else {
                    $scope.activeTab = [true, false, false, false, false, false, false, false];
                }
                $scope.showOrder = true;
            }).catch(function (error) {
            });
        });
        $scope.addArticle = function (type) {
            $scope.addArticleType = type;
            if(type == 2){
                $scope.showLedtSideBar = true;   
                $scope.showAddArticle = false;              
            }
            RoomService.getVariantsAndNotes()
                .then(function (data) {
                    $scope.variantList3 = data.data.variants;
                    $scope.noteList3 = data.data.notes;
                }).catch(function (error) {
                });
            $scope.changeTab(7);
            $scope.AddDataArticle = {
                name: '',
                price: '',
                category: '',
                subCategory: '',
                quantity: 1,
                variant: [],
                notes: '',
                isDeleted: true
            }
            $scope.notes3 = [];
            $scope.notesarray3 = [];
            $rootScope.Order.activeTab[0] = true;
            $rootScope.Order.activeTab[1] = false;
        }

        $scope.hideArticle = function () {
            $scope.changeTab(1);
            $scope.AddDataArticle = {
                name: '',
                price: '',
                category: '',
                subCategory: '',
                quantity: 1,
                variant: [],
                notes: '',
                isDeleted: true
            }
            $scope.notes3 = [];
            $scope.notesarray3 = [];
        }

        $scope.addArticleNote = function (note, i) {
            if ($scope.notes3[note]) {
                $scope.notesarray3.push(note);
            } else {
                $scope.notesarray3.splice($scope.notesarray3.indexOf(note), 1);
            }
            $scope.AddDataArticle.notes = $scope.notesarray3.toString();
        }

        $scope.addRemoveArticleVariant = function (variant, status) {
            var varIds = [];
            if ($scope.AddDataArticle.variant.length) {
                for (var i = 0; i < $scope.AddDataArticle.variant.length; i++) {
                    varIds.push($scope.AddDataArticle.variant[i]._id);
                    if ($scope.AddDataArticle.variant[i]._id == variant._id) {
                        if ($scope.AddDataArticle.variant[i].status == status) {
                            delete variant.status;
                            $scope.AddDataArticle.variant.splice(i, 1);
                        }
                        else {
                            variant.status = status;
                            $scope.AddDataArticle.variant[i].status = status;
                        }
                    }
                }
                if (varIds.length == $scope.AddDataArticle.variant.length) {
                    if (varIds.indexOf(variant._id) < 0) {
                        variant.status = status;
                        $scope.AddDataArticle.variant.push(variant);
                    }
                }
            }
            else {
                variant.status = status;
                $scope.AddDataArticle.variant.push(variant);
            }


            // var arr = [];
            // console.log('variant, status', variant, status);
            // if ($scope.AddDataArticle.variant.length == 0) {
            //     variant.status = angular.copy(status);
            //     $scope.AddDataArticle.variant.push(variant);
            //     arr.push(variant._id);
            // }
            // else {
            //     for (var i = 0; i < $scope.AddDataArticle.variant.length; i++) {
            //         if (arr.indexOf($scope.AddDataArticle.variant[i]._id) == -1) {
            //             arr.push($scope.AddDataArticle.variant[i]._id);
            //         }
            //     }
            //     console.log('arr', arr);
            //     if (arr.length == $scope.AddDataArticle.variant.length) {
            //         if (arr.indexOf(variant._id) > -1) {
            //             console.log("if")
            //             for (var i = 0; i < $scope.AddDataArticle.variant.length; i++) {
            //                 if ($scope.AddDataArticle.variant[i]._id == variant._id) {
            //                     if ($scope.AddDataArticle.variant[i].status == status) {
            //                         $scope.AddDataArticle.variant.splice(i, 1);
            //                         delete variant.status;
            //                     }
            //                     else {
            //                         variant.status = angular.copy(status);
            //                         $scope.AddDataArticle.variant[i].status = angular.copy(status);
            //                     }
            //                 }
            //                 console.log('if $scope.AddDataArticle', $scope.AddDataArticle);
            //             }
            //         }
            //         else {
            //             console.log("else")
            //             arr.push(variant._id);
            //             variant.status = angular.copy(status);
            //             $scope.AddDataArticle.variant.push(variant);
            //             console.log('else $scope.AddDataArticle', $scope.AddDataArticle);
            //         }
            //     }
            // }

            // if (status == 0) {
            //     variant.status = 0;
            // } else {
            //     variant.status = 1;
            // }
            // for (var i = 0; i < $scope.AddDataArticle.variant.length; i++) {
            //     if ($scope.AddDataArticle.variant[i]._id == variant._id) {
            //         $scope.AddDataArticle.variant.splice(i, 1);
            //     }
            // }
            // $scope.AddDataArticle.variant.push(variant);
        }

        $scope.decreaseArticleQty = function () {
            var value = $scope.AddDataArticle.quantity;
            value = isNaN(value) ? 2 : value;
            value < 2 ? value = 2 : '';
            value--;
            $scope.AddDataArticle.quantity = value;
        }

        $scope.increaseArticleQty = function () {
            var value = $scope.AddDataArticle.quantity;
            value = isNaN(value) ? 1 : value;
            value++;
            $scope.AddDataArticle.quantity = value;
        }

        $scope.saveArticleData = function () {
            var currentStep = baRoomService.getTabData().step;
            if ($scope.AddDataArticle.name === '') {
                $scope.variantError3 = 'Please enter name';
                $timeout(function () {
                    $scope.variantError3 = '';
                }, 4000);
            }
            else if ($scope.AddDataArticle.quantity == 0) {
                $scope.variantError3 = 'Please enter quantity';
                $timeout(function () {
                    $scope.variantError3 = '';
                }, 4000);
            }
            else if ($scope.AddDataArticle.price === '') {
                $scope.variantError3 = 'Please enter price';
                $timeout(function () {
                    $scope.variantError3 = '';
                }, 4000);
            }
            else {
                if($scope.addArticleType == 1){
                    $scope.AddDataArticle.category = $rootScope.Order.selectedCategory._id;
                    if ($rootScope.Order.selectedSubcategory[-1]) {
                        $scope.AddDataArticle.subCategory = '';
                    }
                    if (!$rootScope.Order.selectedSubcategory[-1]) {
                        if ($rootScope.Order.selectedCategory.subCategory.length) {
                            for (var i = 0; i < $rootScope.Order.selectedCategory.subCategory.length; i++) {
                                if ($rootScope.Order.selectedSubcategory[i]) {
                                    $scope.AddDataArticle.subCategory = $rootScope.Order.selectedCategory.subCategory[i];
                                }
                            }
                        }
                        else {
                            $scope.AddDataArticle.subCategory = '';
                        }
                    }
                    var opts = {
                        name: $scope.AddDataArticle.name,
                        price: Number($scope.AddDataArticle.price),
                        category: $scope.AddDataArticle.category,
                        subCategory: $scope.AddDataArticle.subCategory,
                        isDeleted: $scope.AddDataArticle.isDeleted
                    }
                    $scope.loader = true;
                    RoomService.addArticle(opts).then(function (data) {
                        $scope.loader = false;
                        var itemTemp = angular.copy(data.data);
                        itemTemp.step = currentStep;
                        itemTemp.quantity = $scope.AddDataArticle.quantity;
                        itemTemp.variant = $scope.AddDataArticle.variant;
                        itemTemp.ordernote = $scope.AddDataArticle.notes;
                        var itemData = angular.copy(itemTemp);
                        $rootScope.Order.selectedItems[currentStep].push(itemData);
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
                        $scope.hideArticle();
                    }).catch(function (error) {
                        $scope.loader = false;
                        AlertService.error('variantError3', error.message, 4000);
                    });
                }
                else if($scope.addArticleType == 2){
                    if ($scope.AddDataArticle.category === '') {
                        $scope.variantError3 = 'Please select category';
                        $timeout(function () {
                            $scope.variantError3 = '';
                        }, 4000);
                    }
                    else{
                        var opts = {
                            name: $scope.AddDataArticle.name,
                            price: Number($scope.AddDataArticle.price),
                            category: $scope.AddDataArticle.category._id,
                            subCategory: $scope.AddDataArticle.subCategory ? $scope.AddDataArticle.subCategory : '',
                            isDeleted: $scope.AddDataArticle.isDeleted
                        }
                        $scope.loader = true;
                        RoomService.addArticle(opts).then(function (data) {
                            $scope.loader = false;
                            var itemTemp = angular.copy(data.data);
                            itemTemp.step = currentStep;
                            itemTemp.quantity = $scope.AddDataArticle.quantity;
                            itemTemp.variant = $scope.AddDataArticle.variant;
                            itemTemp.ordernote = $scope.AddDataArticle.notes;
                            var itemData = angular.copy(itemTemp);
                            $rootScope.Order.selectedItems[currentStep].push(itemData);
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
                            $scope.hideArticle();
                            if($scope.addArticleType == 2){
                                $scope.showAddArticle = false;     
                                $scope.subCategories = []; 
                                $scope.changeTab(1);          
                            }
                        }).catch(function (error) {
                            $scope.loader = false;
                            AlertService.error('variantError3', error.message, 4000);
                        });
                    }
                }
                
            }
        }

        $scope.categoryChanged = function (category) {
            $scope.AddDataArticle.subCategory = '';            
            if(category){
                $scope.subCategories = category.subCategory;
            }
            else{
                $scope.subCategories = [];
                $scope.AddDataArticle.category = '';
            }
        };

       
        $scope.printInvoice = function () {
            $scope.pdf = '';
            RoomService.printInvoice($scope.roomData._id,$rootScope.tableData._id,$scope.orderItemsTotalPrice).then(function (data) {
                $scope.pdf = data.data;
                if($scope.pdf){
                    $('pdfDoc').click(function (event) {
                        event.printAll();
                    });
                }
                // var WinPrint = window.open(data.data, '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                // if(WinPrint){
                //     WinPrint.focus();            
                //     WinPrint.print();
                // }
            })
            .catch(function (error) {
            });
        };

        $scope.invoicePrint = function(){
            var prtContent = document.getElementById("Invoice");
            var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();            
            document.getElementById('invoicePrint').style.visibility = "hidden";
            WinPrint.print();
            WinPrint.close();
            document.getElementById('invoicePrint').style.visibility = "visible";
        }
    }

    function StepsController($scope, $rootScope, RoomService, AlertService, baRoomService) {
        $scope.stepArray = ['Uscita 1', 'Uscita 2'];
        $scope.activeStepTab = [];
        if ($rootScope.tableData.orderId.length) {
            if (baRoomService.getTabData()) {
                $scope.activeStepTab[baRoomService.getTabData().tab] = true;
            } else {
                $scope.activeStepTab[0] = true;
            }
            if (baRoomService.getStepData()) {
                $scope.stepArray = baRoomService.getStepData();
            } else {
                $scope.stepArray = ['Uscita 1', 'Uscita 2'];
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
            var count = $scope.stepArray.length + 1;
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