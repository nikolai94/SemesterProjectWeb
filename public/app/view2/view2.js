'use strict';

var app = angular.module('myAppRename.view2', ['ngRoute']);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'app/view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])
  app.controller('View2Ctrl', ['$scope', '$http','getFlightsFactory', function ($scope, $http,getFlightsFactory) {

      $scope.findFlights = function (){
          getFlightsFactory.getData($scope.findFlights.from,$scope.findFlights.to,$scope.findFlights.date).success(function(data){
              $scope.data = data;
              console.log(""+data);
          })
      }


        /*$http({
      method: 'GET',
      url: 'userApi/test'
    })
      .success(function (data, status, headers, config) {
        $scope.info = data;
        $scope.error = null;
      }).
      error(function (data, status, headers, config) {
        if (status == 401) {
          $scope.error = "You are not authenticated to request these data";
          return;
        }
        $scope.error = data;
      });*/

  }]);

app.factory('getFlightsFactory', ['$http', function($http){
   var url = "userApi/";
    var dataFactory = {};
    dataFactory.getData = function(from,to,date){
       console.log(url+from+"/"+to+"/"+date);
        if(to.length == 0)
        {
            return $http.get(url+from+"/"+date);
        }
        else
        {
           return $http.get(url+from+"/"+to+"/"+date);
        }
    }

    return dataFactory;

}]);