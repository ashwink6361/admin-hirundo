/**
 * @author p.baboo@huulke.com
 * created on 09.09.2017
 */
(function () {
    'use strict';
    
    angular.module('BlurAdmin.theme').service('AlertService', AlertService);
    
    function AlertService($timeout, $compile) {
        return {
            success: function(target, message, tmout) {
                tmout = tmout || 4000;
                window.scrollTo(0,0);    
                var element = angular.element( document.querySelector('#'+target) );
                element.append('<div class="alert bg-success">'+message+'</div>');
                $timeout(function() {
                    element.empty();
                }, tmout);
            },
            error: function(target, message, tmout) {
                tmout = tmout || 4000;
                window.scrollTo(0,0);        
                var element = angular.element( document.querySelector('#'+target) );
                element.append('<div class="alert bg-danger">'+message+'</div>');
                $timeout(function() {
                    element.empty();
                }, tmout);
            }
        };
    }
    })();