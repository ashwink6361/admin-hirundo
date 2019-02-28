/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('DashboardPieChartCtrl', DashboardPieChartCtrl)
    .controller('datepickerpopupCtrl1', datepickerpopupCtrl1);

  /** @ngInject */
  function DashboardPieChartCtrl($scope, $timeout,$state, baConfig, baUtil, DashboardPieChartService, colorHelper) {
    $scope.pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    $scope.pieData = {};
    $scope.searchitem = {
      text: ''
    };
    $scope.searchcategory = {
      text: ''
    };
    $scope.categoryData = [];
    $scope.categoryDetails = [];
    $scope.labels = [];
    $scope.data = [];
    $scope.percentage = [];
    $scope.backgroundColor = [];
    $scope.backgroundColor2 = [];
    $scope.labels2 = [];
    $scope.data2 = [];
    $scope.percentage2 = [];
    $scope.backgroundColor2 = [];
    var dates = JSON.parse(localStorage.getItem('pieDate'));
    if (dates) {
      if(dates.reload){
        $scope.pieDate = {
          startDate: dates.startDate ? new Date(dates.startDate) : null,
          endDate: dates.endDate ? new Date(dates.endDate) : null,
          reload: false
        };
      }
      else{
        $scope.pieDate = {
          startDate: null,
          endDate: null,
          reload: false
        };
      } 
    } else {
      $scope.pieDate = {
        startDate: null,
        endDate: null,
        reload: false
      };
    }
    $scope.Form = {};
    $scope.dateError = "";
    $scope.selectedCategory = {};
    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    function isBelowThreshold(currentValue) {
      return parseFloat(currentValue) == 0;
    };
    $scope.userDetails = JSON.parse(localStorage.getItem('adminUser'));
    $scope.getPieData = function () {
      var opts = {};
      if ($scope.pieDate.startDate == null && $scope.pieDate.endDate == null) {
        var dateNow1 = new Date();
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() - 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date();
        dateNow2.setUTCHours(23, 59, 0, 0);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getPieChartData(opts).then(function (data) {
          $scope.pieData = data.data;
        }).catch(function (error) {
          $scope.pieData = {};
        });
      } else if ($scope.pieDate.startDate != null && $scope.pieDate.endDate != null) {
        var dateNow1 = new Date($scope.pieDate.startDate);
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() + 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date($scope.pieDate.endDate);
        dateNow2.setUTCHours(23, 59, 0, 0);
        dateNow2.setDate(dateNow2.getDate() + 1);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getPieChartData(opts).then(function (data) {
          $scope.pieData = data.data;
        }).catch(function (error) {
          $scope.pieData = {};
        });
      }
    }
    $scope.getCategoryData = function () {
      $scope.pieDate.reload = false;
      localStorage.setItem('pieDate', JSON.stringify($scope.pieDate));
      $scope.categoryData = [];
      $scope.categoryDetails = [];
      var opts = {};
      if ($scope.pieDate.startDate == null && $scope.pieDate.endDate == null) {
        var dateNow1 = new Date();
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() - 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date();
        dateNow2.setUTCHours(23, 59, 0, 0);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getCategoryData(opts).then(function (data) {
          $scope.labels = [];
          $scope.data = [];
          $scope.percentage = [];
          $scope.backgroundColor = [];
          $scope.categoryData = data.data;
          $scope.selectedCategory = $scope.categoryData[0];
          for (var i in $scope.categoryData) {
            $scope.labels.push($scope.categoryData[i].category);
            $scope.data.push($scope.categoryData[i].count);
            $scope.percentage.push($scope.categoryData[i].percentage);
            var color = getRandomColor();
            $scope.backgroundColor.push(color);
            $scope.categoryData[i].bgcolor = color;
          }
          if ($scope.labels.length) {
            if ($scope.percentage.every(isBelowThreshold)) {
              $scope.doughnutData = {
                labels: ['data'],
                datasets: [{
                  data: [100],
                  backgroundColor: [dashboardColors.surfieGreen],
                  hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                  percentage: [100]
                }]
              };
            } else {
              $scope.doughnutData = {
                labels: $scope.labels,
                datasets: [{
                  data: $scope.data,
                  backgroundColor: $scope.backgroundColor,
                  hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                  percentage: $scope.percentage
                }]
              };
            }
            DashboardPieChartService.getCategoryDetails($scope.selectedCategory._id, opts).then(function (data) {
              $scope.labels2 = [];
              $scope.data2 = [];
              $scope.percentage2 = [];
              $scope.backgroundColor2 = [];
              $scope.categoryDetails = data.data;
              for (var j in $scope.categoryDetails) {
                $scope.labels2.push($scope.categoryDetails[j].item);
                $scope.data2.push($scope.categoryDetails[j].count);
                $scope.percentage2.push($scope.categoryDetails[j].percentage);
                // $scope.backgroundColor2.push(getRandomColor());
                var color = getRandomColor();
                $scope.backgroundColor2.push(color);
                $scope.categoryDetails[j].bgcolor = color;
              }
              if ($scope.labels2.length) {
                if ($scope.percentage2.every(isBelowThreshold)) {
                  $scope.doughnutData2 = {
                    labels: ['data'],
                    datasets: [{
                      data: [100],
                      backgroundColor: [dashboardColors.surfieGreen],
                      hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                      percentage: [100]
                    }]
                  };
                } else {
                  $scope.doughnutData2 = {
                    labels: $scope.labels2,
                    datasets: [{
                      data: $scope.data2,
                      backgroundColor: $scope.backgroundColor2,
                      hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                      percentage: $scope.percentage2
                    }]
                  };
                }
                $(document).ready(function () {
                  if ($scope.doughnutData2) {
                    var ctx2 = document.getElementById('chart-area2').getContext('2d');
                    window.myDoughnut2 = new Chart(ctx2, {
                      type: 'doughnut',
                      data: $scope.doughnutData2,
                      options: {
                        cutoutPercentage: 64,
                        responsive: true,
                        elements: {
                          arc: {
                            borderWidth: 0
                          }
                        }
                      }
                    });
                  }
                });
              }
            }).catch(function (error) {
              if (error) {
                $scope.categoryDetails = [];
              }
            });
          }
        }).catch(function (error) {
          if (error) {
            $scope.categoryData = [];
          }
        });
      } else if ($scope.pieDate.startDate != null && $scope.pieDate.endDate != null) {
        var dateNow1 = new Date($scope.pieDate.startDate);
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() + 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date($scope.pieDate.endDate);
        dateNow2.setUTCHours(23, 59, 0, 0);
        dateNow2.setDate(dateNow2.getDate() + 1);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getCategoryData(opts).then(function (data) {
          $scope.labels = [];
          $scope.data = [];
          $scope.percentage = [];
          $scope.backgroundColor = [];
          $scope.categoryData = data.data;
          $scope.selectedCategory = $scope.categoryData[0];
          for (var i in $scope.categoryData) {
            $scope.labels.push($scope.categoryData[i].category);
            $scope.data.push($scope.categoryData[i].count);
            $scope.percentage.push($scope.categoryData[i].percentage);
            // $scope.backgroundColor.push(getRandomColor());
            var color = getRandomColor();
            $scope.backgroundColor.push(color);
            $scope.categoryData[i].bgcolor = color;
          }
          if ($scope.labels.length) {
            if ($scope.percentage.every(isBelowThreshold)) {
              $scope.doughnutData = {
                labels: ['data'],
                datasets: [{
                  data: [100],
                  backgroundColor: [dashboardColors.surfieGreen],
                  hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                  percentage: [100]
                }]
              };
            } else {
              $scope.doughnutData = {
                labels: $scope.labels,
                datasets: [{
                  data: $scope.data,
                  backgroundColor: $scope.backgroundColor,
                  hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                  percentage: $scope.percentage
                }]
              };
            }
            DashboardPieChartService.getCategoryDetails($scope.selectedCategory._id, opts).then(function (data) {
              $scope.labels2 = [];
              $scope.data2 = [];
              $scope.backgroundColor2 = [];
              $scope.percentage2 = [];
              $scope.categoryDetails = data.data;
              for (var j in $scope.categoryDetails) {
                $scope.labels2.push($scope.categoryDetails[j].item);
                $scope.data2.push($scope.categoryDetails[j].count);
                $scope.percentage2.push($scope.categoryDetails[j].percentage);
                // $scope.backgroundColor2.push(getRandomColor());
                var color = getRandomColor();
                $scope.backgroundColor2.push(color);
                $scope.categoryDetails[j].bgcolor = color;
              }
              if ($scope.labels2.length) {
                if ($scope.percentage2.every(isBelowThreshold)) {
                  $scope.doughnutData2 = {
                    labels: ['data'],
                    datasets: [{
                      data: [100],
                      backgroundColor: [dashboardColors.surfieGreen],
                      hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                      percentage: [100]
                    }]
                  };
                } else {
                  $scope.doughnutData2 = {
                    labels: $scope.labels2,
                    datasets: [{
                      data: $scope.data2,
                      backgroundColor: $scope.backgroundColor2,
                      hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                      percentage: $scope.percentage2
                    }]
                  };
                }
                $(document).ready(function () {
                  if ($scope.doughnutData2) {
                    var ctx2 = document.getElementById('chart-area2').getContext('2d');
                    window.myDoughnut2 = new Chart(ctx2, {
                      type: 'doughnut',
                      data: $scope.doughnutData2,
                      options: {
                        cutoutPercentage: 64,
                        responsive: true,
                        elements: {
                          arc: {
                            borderWidth: 0
                          }
                        }
                      }
                    });
                  }
                });
              }
            }).catch(function (error) {
              if (error) {
                $scope.categoryData = [];
              }
            });
          }
        }).catch(function (error) {
          if (error) {
            $scope.categoryData = [];
          }
        });
      }
    }
    $scope.getPieData();
    $scope.getCategoryData();
    $(document).ready(function () {
      if ($scope.doughnutData) {
        console.log("$scope.doughnutData",$scope.doughnutData);
        var ctx1 = document.getElementById('chart-area1').getContext('2d');
        window.myDoughnut1 = new Chart(ctx1, {
          type: 'doughnut',
          data: $scope.doughnutData,
          options: {
            cutoutPercentage: 64,
            responsive: true,
            elements: {
              arc: {
                borderWidth: 0
              }
            }
          }
        });
      }
    });

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function (index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function () {
      loadPieCharts();
      updatePieCharts();
    }, 1000);

    $scope.filterData = function (startDate, endDate) {
      $scope.searchitem.text = '';
      $scope.searchcategory.text = '';
      $scope.pieDate.startDate = startDate;
      $scope.pieDate.endDate = endDate;
      $scope.pieDate.reload = true;      
      localStorage.setItem('pieDate', JSON.stringify($scope.pieDate));
      $state.reload();
      // $scope.getCategoryData();
      // $scope.getPieData();
    }

    $scope.clearStartDate = function () {
      $scope.searchitem.text = '';
      $scope.searchcategory.text = '';
      $scope.pieDate.startDate = null;
      localStorage.setItem('pieDate', JSON.stringify($scope.pieDate));
      $scope.dateError = "";
      if($scope.pieDate.startDate == null && $scope.pieDate.endDate == null){
        $scope.pieDate.reload = true;      
        $state.reload();
      }
      // $scope.getCategoryData();
      // $scope.getPieData();
    }

    $scope.clearEndDate = function () {
      $scope.searchitem.text = '';
      $scope.searchcategory.text = '';
      $scope.pieDate.endDate = null;
      localStorage.setItem('pieDate', JSON.stringify($scope.pieDate));
      $scope.dateError = "";
      if($scope.pieDate.startDate == null && $scope.pieDate.endDate == null){
        $scope.pieDate.reload = true;      
        $state.reload();
      }
      // $scope.getCategoryData();
      // $scope.getPieData();
    }

    $scope.checkErr = function (startDate, endDate) {
      $scope.dateError = "";
      if (startDate != null && endDate != null && new Date(startDate) > new Date(endDate)) {
        $scope.dateError = $scope.currentlan == 'en' ? "End Date should be greater than start date" : "La data di fine dovrebbe essere maggiore della data di inizio";
        return false;
      }
    };

    $scope.selectCategory = function (category) {
      $scope.searchitem.text = '';
      $scope.selectedCategory = angular.copy(category);
      var opts = {};
      if ($scope.pieDate.startDate == null && $scope.pieDate.endDate == null) {
        var dateNow1 = new Date();
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() - 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date();
        dateNow2.setUTCHours(23, 59, 0, 0);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getCategoryDetails($scope.selectedCategory._id, opts).then(function (data) {
          $scope.categoryDetails = data.data;
          $scope.labels2 = [];
          $scope.data2 = [];
          $scope.backgroundColor2 = [];
          $scope.percentage2 = [];
          for (var j in $scope.categoryDetails) {
            $scope.labels2.push($scope.categoryDetails[j].item);
            $scope.data2.push($scope.categoryDetails[j].count);
            $scope.percentage2.push($scope.categoryDetails[j].percentage);
            // $scope.backgroundColor2.push(getRandomColor());
            var color = getRandomColor();
            $scope.backgroundColor2.push(color);
            $scope.categoryDetails[j].bgcolor = color;
          }
          if ($scope.labels2.length) {
            if ($scope.percentage2.every(isBelowThreshold)) {
              $scope.doughnutData2 = {
                labels: ['data'],
                datasets: [{
                  data: [100],
                  backgroundColor: [dashboardColors.surfieGreen],
                  hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                  percentage: [100]
                }]
              };
            } else {
              $scope.doughnutData2 = {
                labels: $scope.labels2,
                datasets: [{
                  data: $scope.data2,
                  backgroundColor: $scope.backgroundColor2,
                  hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                  percentage: $scope.percentage2
                }]
              };
            }
            $(document).ready(function () {
              if ($scope.doughnutData2) {
                var ctx2 = document.getElementById('chart-area2').getContext('2d');
                window.myDoughnut2 = new Chart(ctx2, {
                  type: 'doughnut',
                  data: $scope.doughnutData2,
                  options: {
                    cutoutPercentage: 64,
                    responsive: true,
                    elements: {
                      arc: {
                        borderWidth: 0
                      }
                    }
                  }
                });
              }
            });
          }
        }).catch(function (error) {
          if (error) {
            $scope.categoryDetails = [];
          }
        });

      } else if ($scope.pieDate.startDate != null && $scope.pieDate.endDate != null) {
        var dateNow1 = new Date($scope.pieDate.startDate);
        dateNow1.setUTCHours(0, 0, 0, 0);
        dateNow1.setDate(dateNow1.getDate() + 1);
        opts.startDate = dateNow1.toISOString();
        var dateNow2 = new Date($scope.pieDate.endDate);
        dateNow2.setUTCHours(23, 59, 0, 0);
        dateNow2.setDate(dateNow2.getDate() + 1);
        opts.endDate = dateNow2.toISOString();
        DashboardPieChartService.getCategoryDetails($scope.selectedCategory._id, opts).then(function (data) {
          $scope.labels2 = [];
          $scope.data2 = [];
          $scope.backgroundColor2 = [];
          $scope.percentage2 = [];
          $scope.categoryDetails = data.data;
          for (var j in $scope.categoryDetails) {
            $scope.labels2.push($scope.categoryDetails[j].item);
            $scope.data2.push($scope.categoryDetails[j].count);
            $scope.percentage2.push($scope.categoryDetails[j].percentage);
            // $scope.backgroundColor2.push(getRandomColor());
            var color = getRandomColor();
            $scope.backgroundColor2.push(color);
            $scope.categoryDetails[j].bgcolor = color;
          }
          if ($scope.labels2.length) {
            if ($scope.percentage2.every(isBelowThreshold)) {
              $scope.doughnutData2 = {
                labels: ['data'],
                datasets: [{
                  data: [100],
                  backgroundColor: [dashboardColors.surfieGreen],
                  hoverBackgroundColor: [colorHelper.shade(dashboardColors.surfieGreen, 15)],
                  percentage: [100]
                }]
              };
            } else {
              $scope.doughnutData2 = {
                labels: $scope.labels2,
                datasets: [{
                  data: $scope.data2,
                  backgroundColor: $scope.backgroundColor2,
                  hoverBackgroundColor: colorHelper.shade(dashboardColors.surfieGreen, 15),
                  percentage: $scope.percentage2
                }]
              };
            }
            $(document).ready(function () {
              if ($scope.doughnutData2) {
                var ctx2 = document.getElementById('chart-area2').getContext('2d');
                window.myDoughnut2 = new Chart(ctx2, {
                  type: 'doughnut',
                  data: $scope.doughnutData2,
                  options: {
                    cutoutPercentage: 64,
                    responsive: true,
                    elements: {
                      arc: {
                        borderWidth: 0
                      }
                    }
                  }
                });
              }
            });
          }
        }).catch(function (error) {
          if (error) {
            $scope.categoryDetails = [];
          }
        });
      }
    }
  }

  function datepickerpopupCtrl1($scope) {
    $scope.open = open;
    $scope.popup1 = {
      opened: false
    };
    $scope.popup2 = {
      opened: false
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.options = {
      showWeeks: false
    };

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };
  }
})();