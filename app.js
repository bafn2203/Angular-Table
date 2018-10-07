'use strict';
'use strict';
var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, $http){

    var vm = this;;

    //limit entries in table//
    $scope.page = 50;

    $scope.onSelectBoxChange = function(selectedValue){
        if (selectedValue=="ten"){
            $scope.page = 10;
        } else if (selectedValue=="twenty") {
            $scope.page = 20;
        } else if (selectedValue=="fifty"){
            $scope.page = 50;
        } else {
            $scope.page=undefined;
        }
    };
    
    //GET//
    vm.getapi = function(){
        $http({
            method: 'GET' ,
            url: 'api.json',
        })
            .then(function successCallback(data) {
                $scope.data = data.data;
                $scope.data.map(function(item){
                    item.day = item.modified.split('-')[2];
                    item.month = item.modified.split('-')[1];
                    item.year = item.modified.split('-')[0];
                    item.fulldate = new Date(item.year, item.month-1,  item.day);
                });
                console.log($scope.data);
               
            }, function errorCallback(response) {
                $scope.errorBackend = true;
                console.log(response);
            });
    };
    vm.getapi();

    //sort the table by property name//
    $scope.propertyName = '-id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
 
    //show or hide button//
    $scope.vip = false;
    $scope.togglevip = function() {
        $scope.vip = !$scope.vip;
    };
});

    //filter by date//
app.filter('dateFilter',function(){
    return function(data, from, to) {
        if (!from && !to) return data;
        var newData = [];
        angular.forEach(data, function(item){
            if(item.fulldate >= from && (item.fulldate <= to)) {
                newData.push(item);
            }
            else if(item.fulldate <= to && !from) {
                newData.push(item);
            }
            else if (item.fulldate >= from && !to) {
                newData.push(item);
            }
        });
        return newData;
    };
});
    //higlight searching data//
app.filter('highlight', function($sce) {
    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
            '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
});
    //filter by vips//
app.filter('vipFilter',function(){
    return function(data, vip) {
        if (!vip) return data;
        var vips = [];
        angular.forEach(data, function(item){
            if(item.vip === true) {
                vips.push(item);
            }
        });
        return vips;
    };
});