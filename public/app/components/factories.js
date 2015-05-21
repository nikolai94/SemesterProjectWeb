'use strict';

/* Factories */

var app = angular.module('myAppRename.factories', []);
  app.factory('InfoFactory', function () {
    var info = "Hello World from a Factory";
    var getInfo = function getInfo(){
      return info;
    }
    return {
      getInfo: getInfo
    }
  })
  app.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          // handle the case where the user is not authenticated
        }
        return $q.reject(rejection);
      }
    };
  });

app.factory('orderDato', function(){
  var dataFactory = {};
  var res;
  dataFactory.getData = function(date){
    console.log(date);
    var date = new Date(date);
    console.log(date);
    var str = date.toString().split(" ");
    if(str[2] === undefined)
    {

    }
    else
    {
      if(str[2].length == 1)
      {
        str[2] = "0"+str[0];
      }

      if(str[1] == "Jan")
      {
        res = str[2]+"-01-"+str[3];
      }
      else if (str[2] == "Feb")
      {
        res = str[2]+"-02-"+str[3];
      }

      else if (str[2] == "Mar")
      {
        res = str[2]+"-03-"+str[3];
      }
      else if (str[2] == "Apr")
      {
        res = str[2]+"-04-"+str[3];
      }
      else if (str[2] == "May")
      {
        res = str[2]+"-05-"+str[3];
      }
      else if (str[2] == "Jun")
      {
        res = str[2]+"-06-"+str[3];
      }
      else if (str[2] == "Jul")
      {
        res = str[2]+"-07-"+str[3];
      }
      else if (str[2] == "Aug")
      {
        res = str[2]+"-08-"+str[3];
      }
      else if (str[2] == "Sep")
      {
        res = str[2]+"-09-"+str[3];
      }
      else if (str[2] == "Oct")
      {
        res = str[2]+"-10-"+str[3];
      }
      else if (str[2] == "Nov")
      {
        res = str[2]+"-11-"+str[3];
      }
      else if (str[2] == "Dec")
      {
        res = str[2]+"-12-"+str[3];
      }
      return res;
    }
  }
  return dataFactory;

});


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