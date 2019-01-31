/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.dashboard').service('DashboardPieChartService', DashboardPieChartService);
function DashboardPieChartService($q, $http) {
    return {
        getPieChartData: function(opts) {
            var def = $q.defer();
            var url = '/api/dashboard?startDate=' + opts.startDate + '&endDate=' + opts.endDate;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
