'use strict';

angular.module('myApp.services', [])
    .factory('MapService', ['$q', function($q){
        console.log('hello');
        var service = {};

        service.init = function() {
            var options = {
                center: new google.maps.LatLng(37.78534059999999, -122.39537710000002),
                zoom: 13,
                disableDefaultUI: true
            };
            service.map = new google.maps.Map(
                document.getElementById("map"), options
            );
            service.places = new google.maps.places.PlacesService(service.map);
        };

        service.search = function(str) {
            var d = $q.defer();
            service.places.textSearch({query: str}, function(results, status) {
                console.log(results, status);
                if (status == 'OK') {
                    d.resolve(results[0]);
                }
                else d.reject(status);
            });
            return d.promise;
        };

        service.addMarker = function(res) {
            if(service.marker) service.marker.setMap(null);
            service.marker = new google.maps.Marker({
                map: service.map,
                position: res.geometry.location,
                animation: google.maps.Animation.DROP
            });
            service.map.setCenter(res.geometry.location);
        };

        return service;
    }]);