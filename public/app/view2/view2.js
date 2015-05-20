'use strict';
var persons = [];
var app = angular.module('myAppRename.view2', ['ngRoute']);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/view2', {
      templateUrl: 'app/view2/view2.html',
      controller: 'View2Ctrl'
    })
        .when('/booking/:airline/:fligthID', {
        templateUrl: 'app/view2/booking.html',
        controller: 'View2Ctrl'
    });
  }])
  app.controller('View2Ctrl', ['$scope', '$http','$location','getFlightsFactory', function ($scope, $http,$location,getFlightsFactory) {

      $scope.persons = persons;
      $scope.personsLength = $scope.persons.length;
      $scope.nextId = 1;
      $scope.noFligthFound = "";
      $scope.fligthObject = {};
      $scope.data = [];
      $scope.findFlights = function (){
          getFlightsFactory.getData($scope.findFlights.from,$scope.findFlights.to,$scope.findFlights.date).success(function(data){
              if(data.length == 0)
              {
                 $scope.noFligthFound = "No fligths found";
              }
              else
              {
                  $scope.noFligthFound = "";
                  $scope.data = data;
              }


          })
      }

      $scope.objectFligth = function(row)
      {
      //    $scope.fligthObject = {airline: row.airline};
          if(row != undefined) {
              $scope.fligthObject = row;
              $scope.hej = "hej";
          }
        //  $location.path("booking/"+row.airline+/row.flightId+"/her");

      }

      $scope.addPerson = function()
      {

          if($scope.person.id == null) {
              $scope.person.id = $scope.nextId++;
              persons.push({id: $scope.person.id,firstname:$scope.person.firstname,lastname:$scope.person.lastname,city:$scope.person.city,country:$scope.person.country,street:$scope.person.street});
          }
          else{
              for(var i in $scope.persons)
              {
                  if($scope.persons[i].id == $scope.person.id)
                  {
                      $scope.persons[i] = $scope.person;
                  }
              }
          }

          $scope.person = {};
          $scope.personsLength = persons.length;

      }


      $scope.removePerson = function(id)
      {
          for(var i in $scope.persons)
          {

              if($scope.persons[i].id == id)
              {
                  $scope.persons.splice(i,1);
                  $scope.person = {};
              }
          }
          $scope.personsLength = persons.length;
      }


      $scope.editPerson = function(id) {
          //search contact with given id and update it
          for(var i in $scope.persons) {
              if($scope.persons[i].id == id) {
                  //we use angular.copy() method to create
                  //copy of original object
                  $scope.person = angular.copy($scope.persons[i]);
              }
          }
      }

  }]);

app.factory('getFlightsFactory', ['$http', function($http){
   var url = "userApi/";
    var dataFactory = {};
    dataFactory.getData = function(from,to,date){
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