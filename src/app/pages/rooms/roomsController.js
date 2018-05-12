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
        $rootScope.Order = {};
        $scope.showOrder = false;
        $scope.rooms = [];
        $scope.activeTab = [true, false, false, false, false];
        $scope.showCategory = false;
        $scope.variantList = [];
        $scope.noteList = [];
        $scope.notes = [];
        $scope.notesarray = [];
        $scope.showLedtSideBar = false;
        $scope.variantData = {
            quantity: 0,
            variant: [],
            notes: ''
        };
        $scope.variantError = '';
        $scope.orderId = '';
        $scope.orderItems = [];
        $q.all([
            RoomService.getCategories()
        ]).then(function (data) {
            $scope.categories = data[0].data;
        });


        //Fetch Room list
        RoomService.getRooms().then(function (data) {
            // localStorage.removeItem('orderData');
            $scope.rooms = RoomService.listRoom();
        }).catch(function (error) {
            console.log("Error ", error);
        });
        $scope.getRoomList = function () {
            RoomService.getRooms().then(function (data) {
                $scope.rooms = RoomService.listRoom();
            }).catch(function (error) {
                console.log("Error ", error);
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
            $scope.roomData = angular.copy(room);
            $scope.tableData = angular.copy(table);
            baRoomService.setCreateModalCollapsed(true);
            if (table.orderId != null && table.orderId._id) {
                $scope.orderId = table.orderId._id;
                $scope.orderItems = table.orderId.item;
                baRoomService.setOrderId(table.orderId._id);
                baRoomService.setOrderItems(table.orderId.item);
                var steps = [];
                var selectedItems = {};      
                if (baRoomService.getStepData()) {
                  steps = baRoomService.getStepData();
                }
                else {
                  steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var j = 0; j < steps.length; j++) {
                  selectedItems[steps[j]] = [];
                }
                // var data = {
                //     roomId: table.orderId.room,
                //     tableId: table.orderId.table,
                //     noOfPeople: table.orderId.noOfPeople,
                //     // selectedItems: [],
                //     selectedItems: selectedItems,        
                //     cartTotalPrice : 0,
                //     cartTotalItem: 0
                //   }
                //   RoomServiceTest.setOrderData(data);
                $rootScope.Order.noOfPeople = table.orderId.noOfPeople;
                $rootScope.Order.selectedItems = selectedItems;
                $rootScope.Order.cartTotalPrice = 0;
                $rootScope.Order.cartTotalItem = 0;
            } else {
                $scope.orderId = '';
                $scope.orderItems = [];
                localStorage.removeItem('orderId');
                localStorage.removeItem('orderItems');
            }
            if (table.status == 1) {
                $scope.activeTab = [false, false, false, false, true];
            } else {
                $scope.activeTab = [true, false, false, false, false];
            }
            $scope.showOrder = true;
            // localStorage.removeItem('stepData');
            // localStorage.removeItem('tabData');
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
                activeTab: [true, false]
            };
            $scope.activeTab = [true, false, false, false, false];
            $scope.showOrder = false;
            $scope.showLedtSideBar = false;
            baRoomService.setCreateModalCollapsed(false);
            localStorage.removeItem('stepData');
            localStorage.removeItem('tabData');
            // localStorage.removeItem('orderData');
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
            activeTab: [true, false]
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
                }
                else {
                  steps = ['Uscita 1', 'Uscita 2'];
                }
                for (var j = 0; j < steps.length; j++) {
                  selectedItems[steps[j]] = [];
                }
                $rootScope.Order.selectedItems = selectedItems;
                console.log('$rootScope.Order$rootScope.Order',$rootScope.Order);
                // var data = {
                //   roomId: $scope.roomData["_id"],
                //   tableId: $scope.tableData["_id"],
                //   noOfPeople: $scope.Order.noOfPeople,
                //   selectedItems: selectedItems,
                //   cartTotalPrice : 0,
                //   cartTotalItem: 0
                // }
                // RoomServiceTest.setOrderData(data);
                $scope.changeTab(1);
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
            // var orderdata = RoomServiceTest.getOrderData();
            // orderdata.selectedCategory = category;
            // orderdata.categoryItems = {};
            $rootScope.Order.selectedCategory = category;
            $rootScope.Order.categoryItems = {};
            RoomService.getCategoryWithItems().then(function (data) {
                    if (data.data.length) {
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].category._id == category._id) {
                                var steps = [];
                                if (baRoomService.getStepData()) {
                                    steps = baRoomService.getStepData();
                                }
                                else {
                                    steps = ['Uscita 1', 'Uscita 2'];
                            }
                                for (var j = 0; j < steps.length; j++) {
                                    $rootScope.Order.categoryItems[steps[j]] = angular.copy(data.data[i].items);
                    console.log('$rootScope.Order.categoryItems',$rootScope.Order.categoryItems);                                                        
                                    for (var k = 0; k < $rootScope.Order.categoryItems[steps[j]].length; k++) {
                                        $rootScope.Order.categoryItems[steps[j]][k].quantity = 0;
                                        $rootScope.Order.categoryItems[steps[j]][k].itemTotal = 0;
                        }
                    }
                                // $scope.Order.categoryItems = data.data[i].items;
                                // for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
                                //     $scope.Order.categoryItems[j].quantity = 0;
                                //     $scope.Order.categoryItems[j].itemTotal = 0;
                                // }
                            }
                        }
                    }
                    // RoomServiceTest.setOrderData(orderdata);
                    console.log('$rootScope.Order$rootScope.Order showitems',$rootScope.Order);                    
                    $scope.changeTab(2);
                    $scope.goToItems();
                })
                .catch(function (error) {
                    console.log('error', error);
                });
        }

        $scope.goToItems = function () {
            // var data = RoomServiceTest.getOrderData();
            if ($rootScope.Order.categoryItems) {
                var steps = [];
                if (baRoomService.getStepData()) {
                    steps = baRoomService.getStepData();
                            }
                else {
                    steps = ['Uscita 1', 'Uscita 2'];
                        }
                // for (var i = 0; i < data.categoryItems.length; i++) {
                //     data.categoryItems[i].itemTotal = 0;
                //     if (data.selectedItems.length) {
                //         for (var j = 0; j < data.selectedItems.length; j++) {
                //             if (data.selectedItems[j]._id == data.categoryItems[i]._id) {
                //                 data.categoryItems[i].quantity = data.selectedItems[j].quantity;
                //                 data.categoryItems[i].itemTotal = data.categoryItems[i].itemTotal + data.selectedItems[j].quantity;
                //             }
                //         }
                //     }
                // }
                for (var k = 0; k < steps.length; k++) {
                    for (var i = 0; i < $rootScope.Order.categoryItems[steps[k]].length; i++) {
                      if ($rootScope.Order.selectedItems[steps[k]].length) {
                        for (var j = 0; j < $rootScope.Order.selectedItems[steps[k]].length; j++) {
                          if ($rootScope.Order.selectedItems[steps[k]][j]._id == $rootScope.Order.categoryItems[steps[k]][i]._id ) {
                            $rootScope.Order.categoryItems[steps[k]][i].itemTotal = $rootScope.Order.selectedItems[steps[k]][j].quantity;
                    }
                }
                      }
                    }
                  }
                //   RoomServiceTest.setOrderData(data);
                $rootScope.Order.selectedSubcategory[-1] = true;
            }
        }

        // $scope.increaseValue = function (article) {
        //     article.step = baRoomService.getTabData().step;
        //     if ($scope.Order.selectedItems.length) {
        //         var isExist = true;
        //         var isarr = [];
        //         for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //             if ($scope.Order.selectedItems[i]._id == article._id) {
        //                 if (!$scope.Order.selectedItems[i].variant) {
        //                     $scope.Order.selectedItems[i].quantity += 1;
        //                     isarr.push($scope.Order.selectedItems[i]._id);
        //                     for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //                         if ($scope.Order.categoryItems[j]._id == $scope.Order.selectedItems[i]._id) {
        //                             $scope.Order.categoryItems[j].itemTotal = $scope.Order.selectedItems[i].quantity;
        //                         }
        //                     }
        //                 } else {
        //                     for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //                         if ($scope.Order.categoryItems[j]._id == $scope.Order.selectedItems[i]._id) {
        //                             $scope.Order.categoryItems[j].itemTotal = $scope.Order.categoryItems[j].itemTotal + $scope.Order.selectedItems[i].quantity;
        //                         }
        //                     }
        //                 }
        //             }
        //             if ($scope.Order.selectedItems[i]._id != article._id) {
        //                 isExist = false;
        //             }
        //         }
        //         if (!isExist && isarr.indexOf(article._id) < 0) {
        //             article.quantity = article.quantity + 1;
        //             for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //                 if ($scope.Order.categoryItems[j]._id == article._id) {
        //                     $scope.Order.categoryItems[j].itemTotal = article.quantity;
        //                 }
        //             }
        //             $scope.Order.selectedItems.push(article);
        //         }
        //     } else {
        //         article.quantity = article.quantity + 1;
        //         for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //             if ($scope.Order.categoryItems[j]._id == article._id) {
        //                 $scope.Order.categoryItems[j].itemTotal = article.quantity;
        //             }
        //         }
        //         $scope.Order.selectedItems.push(article);
        //     }
        //     var cp = 0;
        //     var itemno = 0;
        //     var varicost = 0;
        //     for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //         itemno += $scope.Order.selectedItems[i].quantity;
        //         if ($scope.Order.selectedItems[i].variant) {
        //             for (var j = 0; j < $scope.Order.selectedItems[i].variant.length; j++) {
        //                 if ($scope.Order.selectedItems[i].variant[j].status == 1) {
        //                     varicost += $scope.Order.selectedItems[i].variant[j].price;
        //                 }
        //             }
        //         }
        //         cp += ($scope.Order.selectedItems[i].price + varicost) * $scope.Order.selectedItems[i].quantity;
        //         $scope.Order.cartTotalPrice = cp;
        //         $scope.Order.cartTotalItem = itemno;
        //     }
        // }

        // $scope.decreaseValue = function (article) {
        //     article.step = baRoomService.getTabData().step;
        //     for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //         if ($scope.Order.selectedItems[i]._id == article._id && !$scope.Order.selectedItems[i].variant) {
        //             if ($scope.Order.selectedItems[i].quantity > 1) {
        //                 $scope.Order.selectedItems[i].quantity = $scope.Order.selectedItems[i].quantity - 1;
        //                 for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //                     if ($scope.Order.categoryItems[j]._id == $scope.Order.selectedItems[i]._id) {
        //                         $scope.Order.categoryItems[j].itemTotal = $scope.Order.categoryItems[j].itemTotal - 1;
        //                     }
        //                 }
        //             } else {
        //                 article.quantity = 0;
        //                 for (var j = 0; j < $scope.Order.categoryItems.length; j++) {
        //                     if ($scope.Order.categoryItems[j]._id == $scope.Order.selectedItems[i]._id) {
        //                         $scope.Order.categoryItems[j].itemTotal = $scope.Order.categoryItems[j].itemTotal - 1;
        //                     }
        //                 }
        //                 $scope.Order.selectedItems.splice(i, 1);
        //             }
        //         }
        //     }
        //     var cp = 0;
        //     var itemno = 0;
        //     var varicost = 0;
        //     if ($scope.Order.selectedItems.length) {
        //         for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //             itemno += $scope.Order.selectedItems[i].quantity;
        //             if ($scope.Order.selectedItems[i].variant) {
        //                 for (var j = 0; j < $scope.Order.selectedItems[i].variant.length; j++) {
        //                     if ($scope.Order.selectedItems[i].variant[j].status == 1) {
        //                         varicost += $scope.Order.selectedItems[i].variant[j].price;
        //                     }
        //                 }
        //             }
        //             cp += ($scope.Order.selectedItems[i].price + varicost) * $scope.Order.selectedItems[i].quantity;
        //             $scope.Order.cartTotalPrice = cp;
        //             $scope.Order.cartTotalItem = itemno;
        //         }
        //     } else {
        //         $scope.Order.cartTotalPrice = 0;
        //         $scope.Order.cartTotalItem = 0;
        //     }
        // }




//new code
        $scope.increaseValue = function (article) {
            article.step = baRoomService.getTabData().step;
            var currentStep = baRoomService.getTabData().step;
            $rootScope.Order = angular.copy($rootScope.Order);
            if ($rootScope.Order.selectedItems[currentStep].length) {
                var isExist = true;
                var isarr = [];
                for (var i = 0; i < $rootScope.Order.selectedItems[currentStep].length; i++) {
                    if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id) {
                        if ($rootScope.Order.selectedItems[currentStep][i].step == article.step) {
                            if (!$rootScope.Order.selectedItems[currentStep][i].variant) {
                                $rootScope.Order.selectedItems[currentStep][i].quantity += 1;
                                isarr.push($rootScope.Order.selectedItems[currentStep][i]._id);
                                for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                                    if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                        $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.selectedItems[currentStep][i].quantity;
                                    }
                                }
                            }
                            if ($rootScope.Order.selectedItems[currentStep][i].variant) {
                                for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                                    if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                        $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal + $rootScope.Order.selectedItems[currentStep][i].quantity;
                                    }
                                }
                            }
                        }
                        if ($rootScope.Order.selectedItems[currentStep][i].step != article.step) {
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
                            $rootScope.Order.categoryItems[currentStep][j].itemTotal = article.quantity;
                        }
                    }
                    $rootScope.Order.selectedItems[currentStep].push(article);
                }
            }
            else {
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
            }
            else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            for (var a = 0; a < steps.length; a++) {
                for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
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
            // RoomServiceTest.setOrderData(data);
        }

        $scope.decreaseValue = function (article) {
            article.step = baRoomService.getTabData().step;
            var currentStep = baRoomService.getTabData().step;
            console.log('$rootScope.Order', $rootScope.Order);
            $rootScope.Order = angular.copy($rootScope.Order);
            // var data = RoomServiceTest.getOrderData();
            for (var i = 0; i < $rootScope.Order.selectedItems[currentStep].length; i++) {
                if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id && !$rootScope.Order.selectedItems[currentStep][i].variant && $rootScope.Order.selectedItems[currentStep][i].step == article.step) {
                    if ($rootScope.Order.selectedItems[currentStep][i].quantity > 1) {
                        $rootScope.Order.selectedItems[currentStep][i].quantity = $rootScope.Order.selectedItems[currentStep][i].quantity - 1;
                        for (var j = 0; j < $rootScope.Order.categoryItems[currentStep].length; j++) {
                            if ($rootScope.Order.categoryItems[currentStep][j]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                                $rootScope.Order.categoryItems[currentStep][j].itemTotal = $rootScope.Order.categoryItems[currentStep][j].itemTotal - 1;
                            }
                        }
                    }
                    else {
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
            }
            else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            var emptyArray = [];
            for (var a = 0; a < steps.length; a++) {
                if ($rootScope.Order.selectedItems[steps[a]].length) {
                    for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
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
            // RoomServiceTest.setOrderData(data);
        }

        $scope.deleteItemFromCart = function (article) {
            // var data = RoomServiceTest.getOrderData();
            var currentStep = baRoomService.getTabData().step;
            $rootScope.Order = angular.copy($rootScope.Order);
            console.log('$rootScope.Order', $rootScope.Order);
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
                }
                else if ($rootScope.Order.selectedItems[currentStep][i]._id == article._id && article.variant) {
                    //variant type data
                    for (var m = 0; m < $rootScope.Order.categoryItems[currentStep].length; m++) {
                        if ($rootScope.Order.categoryItems[currentStep][m]._id == $rootScope.Order.selectedItems[currentStep][i]._id) {
                            $rootScope.Order.categoryItems[currentStep][m].itemTotal = $rootScope.Order.categoryItems[currentStep][m].itemTotal - $rootScope.Order.selectedItems[currentStep][i].quantity;
                        }
                    }
                    if ($rootScope.Order.selectedItems[currentStep][i].variant && currentStep == $rootScope.Order.selectedItems[currentStep][i].step) {
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
            }
            else {
                steps = ['Uscita 1', 'Uscita 2'];
            }
            var emptyArray = [];
            for (var a = 0; a < steps.length; a++) {
                if ($rootScope.Order.selectedItems[steps[a]].length) {
                    for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
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
            //   RoomServiceTest.setOrderData(data);

            console.log('$rootScope.Order after delete', $rootScope.Order);
        }
        // $scope.deleteItemFromCart = function (article) {
            // for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
            //     if ($scope.Order.selectedItems[i]._id == article._id && !article.variant) {
            //         //non variant type data
            //         for (var m = 0; m < $scope.Order.categoryItems.length; m++) {
            //             if ($scope.Order.categoryItems[m]._id == $scope.Order.selectedItems[i]._id) {
            //                 $scope.Order.categoryItems[m].itemTotal = $scope.Order.categoryItems[m].itemTotal - $scope.Order.selectedItems[i].quantity;
            //             }
            //         }
            //         if (!$scope.Order.selectedItems[i].variant) {
            //             $scope.Order.selectedItems.splice(i, 1);
            //         }
            //     } else if ($scope.Order.selectedItems[i]._id == article._id && article.variant) {
            //         //variant type data
            //         for (var m = 0; m < $scope.Order.categoryItems.length; m++) {
            //             if ($scope.Order.categoryItems[m]._id == $scope.Order.selectedItems[i]._id) {
            //                 $scope.Order.categoryItems[m].itemTotal = $scope.Order.categoryItems[m].itemTotal - $scope.Order.selectedItems[i].quantity;
            //             }
            //         }
            //         if ($scope.Order.selectedItems[i].variant) {
            //             $scope.Order.selectedItems.splice(i, 1);
            //         }
            //     }
            // }
        //     var cp = 0;
        //     var itemno = 0;
        //     var varicost = 0;
        //     if ($scope.Order.selectedItems.length) {
        //         for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //             itemno += $scope.Order.selectedItems[i].quantity;
        //             if ($scope.Order.selectedItems[i].variant) {
        //                 for (var j = 0; j < $scope.Order.selectedItems[i].variant.length; j++) {
        //                     if ($scope.Order.selectedItems[i].variant[j].status == 1) {
        //                         varicost += $scope.Order.selectedItems[i].variant[j].price;
        //                     }
        //                 }
        //             }
        //             cp += ($scope.Order.selectedItems[i].price + varicost) * $scope.Order.selectedItems[i].quantity;
        //             $scope.Order.cartTotalPrice = cp;
        //             $scope.Order.cartTotalItem = itemno;
        //         }
        //     } else {
        //         $scope.Order.cartTotalPrice = 0;
        //         $scope.Order.cartTotalItem = 0;
        //     }
        // }


        $scope.createOrder = function () {
            // var data = RoomServiceTest.getOrderData();
            var itemarray = [];
            var steps = [];
              if (baRoomService.getStepData()) {
                steps = baRoomService.getStepData();
              }
              else {
                steps = ['Uscita 1', 'Uscita 2'];
              }     
               for(var a=0;a<steps.length;a++){
        
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
                    status: $rootScope.Order.selectedItems[steps[a]][i].variant[j].status
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
                        $scope.cancelCreateOrder();
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                        }).catch(function (error) {
                            console.log("Error ", error);
                        });
                    })
                    .catch(function (error) {
                        AlertService.error('createOrderMsg', error.message, 4000);
                    });
            } else {
                RoomService.createOrder(createorder)
                    .then(function (data) {
                        AlertService.success('createOrderMsg', data.message, 4000);
                        $scope.cancelCreateOrder();
                        RoomService.getRooms().then(function (data) {
                            $scope.rooms = RoomService.listRoom();
                        }).catch(function (error) {
                            console.log("Error ", error);
                        });
                    })
                    .catch(function (error) {
                        AlertService.error('createOrderMsg', error.message, 4000);
                    });
            }
            $scope.showLedtSideBar = false;
        }


        // $scope.createOrder = function () {
        //     console.log("fsdf");
        //     var itemarray = [];
        //     for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //         var vararray = [];
        //         if ($scope.Order.selectedItems[i].variant) {
        //             for (var j = 0; j < $scope.Order.selectedItems[i].variant.length; j++) {
        //                 var catarray = [];
        //                 for (var k = 0; k < $scope.Order.selectedItems[i].variant[j].category.length; k++) {
        //                     catarray.push($scope.Order.selectedItems[i].variant[j].category[k]._id);
        //                 }
        //                 var vari = {
        //                     name: $scope.Order.selectedItems[i].variant[j].name,
        //                     category: catarray,
        //                     price: $scope.Order.selectedItems[i].variant[j].price,
        //                     status: $scope.Order.selectedItems[i].variant[j].status
        //                 }
        //                 vararray.push(vari);
        //             }
        //         }
        //         var item = {
        //             id: $scope.Order.selectedItems[i]._id,
        //             category: $scope.Order.selectedItems[i].category._id,
        //             quantity: $scope.Order.selectedItems[i].quantity,
        //             price: $scope.Order.selectedItems[i].price,
        //             notes: $scope.Order.selectedItems[i].ordernote ? $scope.Order.selectedItems[i].ordernote : '',
        //             variant: vararray,
        //             step: $scope.Order.selectedItems[i].step,
        //             department: $scope.Order.selectedItems[i].category.department
        //         }
        //         itemarray.push(item);
        //     }
        //     var createorder = {
        //         room: $scope.roomData["_id"],
        //         table: $scope.tableData["_id"],
        //         noOfPeople: $scope.Order.noOfPeople,
        //         item: itemarray
        //     }
        //     if ($scope.orderId) {
        //         RoomService.updateOrder(itemarray, $scope.orderId)
        //             .then(function (data) {
        //                 AlertService.success('createOrderMsg', data.message, 4000);
        //                 $scope.cancelCreateOrder();
        //                 RoomService.getRooms().then(function (data) {
        //                     $scope.rooms = RoomService.listRoom();
        //                 }).catch(function (error) {
        //                     console.log("Error ", error);
        //                 });
        //             })
        //             .catch(function (error) {
        //                 AlertService.error('createOrderMsg', error.message, 4000);
        //             });
        //     } else {
        //         RoomService.createOrder(createorder)
        //             .then(function (data) {
        //                 AlertService.success('createOrderMsg', data.message, 4000);
        //                 $scope.cancelCreateOrder();
        //                 RoomService.getRooms().then(function (data) {
        //                     $scope.rooms = RoomService.listRoom();
        //                 }).catch(function (error) {
        //                     console.log("Error ", error);
        //                 });
        //             })
        //             .catch(function (error) {
        //                 AlertService.error('createOrderMsg', error.message, 4000);
        //             });
        //     }
        //     $scope.showLedtSideBar = false;
        // }

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
                    console.log("Error ", error);
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

        // $scope.saveVariantData = function () {
        //     if ($scope.variantData.quantity == 0) {
        //         $scope.variantError = 'Please enter quantity';
        //         $timeout(function () {
        //             $scope.variantError = '';
        //         }, 4000);
        //     } else if ($scope.variantData.quantity > 0 && !$scope.variantData.variant.length && !$scope.variantData.notes) {
        //         $scope.variantError = 'Please select variants/notes';
        //         $timeout(function () {
        //             $scope.variantError = '';
        //         }, 4000);
        //     } else {
        //         $scope.articleData.quantity = $scope.variantData.quantity;
        //         $scope.articleData.variant = $scope.variantData.variant;
        //         $scope.articleData.ordernote = $scope.variantData.notes;
        //         $scope.articleData.step = baRoomService.getTabData().step;
        //         $scope.Order.selectedItems.push($scope.articleData);
        //         for (var i = 0; i < $scope.Order.categoryItems.length; i++) {
        //             if ($scope.Order.categoryItems[i]._id == $scope.articleData._id) {
        //                 $scope.Order.categoryItems[i].itemTotal = $scope.Order.categoryItems[i].itemTotal + $scope.articleData.quantity;
        //             }
        //         }
        //         var cp = 0;
        //         var itemno = 0;
        //         var varicost = 0;
        //         for (var i = 0; i < $scope.Order.selectedItems.length; i++) {
        //             itemno += $scope.Order.selectedItems[i].quantity;
        //             if ($scope.Order.selectedItems[i].variant) {
        //                 for (var j = 0; j < $scope.Order.selectedItems[i].variant.length; j++) {
        //                     if ($scope.Order.selectedItems[i].variant[j].status == 1) {
        //                         varicost += $scope.Order.selectedItems[i].variant[j].price;
        //                     }
        //                 }
        //             }
        //             cp += ($scope.Order.selectedItems[i].price + varicost) * $scope.Order.selectedItems[i].quantity;
        //             $scope.Order.cartTotalPrice = cp;
        //             $scope.Order.cartTotalItem = itemno;
        //         }
        //         $scope.hideVarient();
        //     }
        // }

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
            }
            else {
                $scope.articleData.quantity = $scope.variantData.quantity;
                $scope.articleData.variant = $scope.variantData.variant;
                $scope.articleData.ordernote = $scope.variantData.notes;
              $scope.articleData.step = currentStep;
            //   var data = RoomServiceTest.getOrderData();
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
              }
              else {
                steps = ['Uscita 1', 'Uscita 2'];
              }
              for(var a=0;a<steps.length;a++){
                for (var i = 0; i < $rootScope.Order.selectedItems[steps[a]].length; i++) {
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
            //   RoomServiceTest.setOrderData(data);
                $scope.hideVarient();
            }
        }
        $scope.showLeftSide = function(){
            $scope.showLedtSideBar = true;
        }
        $scope.hideLeftSide = function(){
            $scope.showLedtSideBar = false;
        }
    }

    function StepsController($scope,$rootScope, RoomService, AlertService, baRoomService) {
        $scope.stepArray = ['Uscita 1', 'Uscita 2'];
        $scope.activeStepTab = [];
        // if (baRoomService.getOrderId()) {
        //     $scope.activeStepTab[0] = [true];
        //     var orderItems = JSON.parse(localStorage.getItem('orderItems'));
        //     for (var i = 0; i < orderItems.length; i++) {
        //         if ($scope.stepArray.indexOf(orderItems[i].step) < 0) {
        //             $scope.stepArray.push(orderItems[i].step);
        //         }
        //     }
        //     var tabdata = {
        //         tab: 0,
        //         step: $scope.stepArray[0]
        //     }
        //     baRoomService.setTabData(tabdata);
        //     baRoomService.setStepData($scope.stepArray);
        // }


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

        // $scope.addStep = function () {
        //     var count = $scope.stepArray.length + 1;
        //     $scope.stepArray.push('Uscita ' + count);
        //     baRoomService.setStepData($scope.stepArray);
        // }

        $scope.addStep = function () {
            var count = this.stepArray.length + 1;
            $scope.stepArray.push('Uscita ' + count);
            var step = 'Uscita ' + count;
            baRoomService.setStepData($scope.stepArray);
            // var orderdata = RoomServiceTest.getOrderData();
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
                // RoomServiceTest.setOrderData(orderdata);
            })
                .catch(function (error) {
                    console.log('error', error);
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