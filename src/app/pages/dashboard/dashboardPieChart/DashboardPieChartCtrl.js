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
  function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil, DashboardPieChartService) {
    $scope.pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    $scope.pieData = {};
    $scope.pieDate = {
      startDate: null,
      endDate: null
    };
    $scope.Form = {};
    $scope.dateError = "";   
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
      }
      else if ($scope.pieDate.startDate != null && $scope.pieDate.endDate != null) {
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
    
    $scope.getPieData();
  
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
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function () {
      loadPieCharts();
      updatePieCharts();
    }, 1000);

    $scope.filterData = function (startDate, endDate) {
      $scope.pieDate.startDate = startDate;
      $scope.pieDate.endDate = endDate;
      $scope.getPieData();
    }

    $scope.clearStartDate = function () {
      $scope.pieDate.startDate = null;
      $scope.dateError = ""; 
      $scope.getPieData();
    }

    $scope.clearEndDate = function () {
      $scope.pieDate.endDate = null;
      $scope.dateError = "";      
      $scope.getPieData();
    }

    $scope.checkErr = function(startDate, endDate) {
      $scope.dateError = "";
      if (startDate != null && endDate != null && new Date(startDate) > new Date(endDate)) {
        $scope.dateError = $scope.currentlan == 'en'? "End Date should be greater than start date" : "La data di fine dovrebbe essere maggiore della data di inizio";
        return false;
      }
    };
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

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };
  }
})();