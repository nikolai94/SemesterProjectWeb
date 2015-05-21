'use strict';

angular.module('myAppRename.view4', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view4', {
            templateUrl: 'app/view4/opretbruger.html',
            controller: 'opretController'
        });
    }])


.controller('opretController', function($scope, $http){



        $scope.username = {};
        $scope.password = {};
        $scope.address = {};
        $scope.email = {};
        $scope.city = {};


    });

