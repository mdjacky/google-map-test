'use strict';

angular.module('myApp.services', [])
    .factory('MapService', ['$q', function($q){
        var service = {marker: []};
        var userGeoLocation = {
            lat: 49.2765926,
            lng: -123.12160260000002
        }; //Zenefits Office Geolocation
        var userCenter = new google.maps.LatLng(userGeoLocation.lat, userGeoLocation.lng);

        service.init = function () {
            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(function(position) {
            //         center = {
            //             lat: position.coords.latitude,
            //             lng: position.coords.longitude
            //         };
            //     });
            // }

            var options = {
                center: userCenter,
                zoom: 13,
                disableDefaultUI: true
            };
            service.map = new google.maps.Map(document.getElementById("map"), options);
            service.bounds = new google.maps.LatLngBounds();
            service.places = new google.maps.places.PlacesService(service.map);
        };

        service.search = function (str) {
            var d = $q.defer();
            service.bounds = new google.maps.LatLngBounds();
            service.cleanAllMarkers();

            var opts = {
                location: service.map.getCenter(),
                radius: '1000',
                query: str
            };

            var finalResults = [];

            service.places.textSearch(opts, function(results, status, pagination) {
                console.log(results, status, pagination);
                finalResults = finalResults.concat(results);

                if (status !== 'OK' ) {
                    d.reject(status);
                } else {

                    if(pagination.hasNextPage && finalResults.length < 100) {
                        pagination.nextPage();
                    } else d.resolve(finalResults);
                }

            });
            return d.promise;
        };

        service.addMarker = function (res) {
            var infowindow = new google.maps.InfoWindow();
            for (var i=0; i<res.length; i++){
                var marker;
                var position = new google.maps.LatLng(res[i].geometry.location.lat(), res[i].geometry.location.lng());
                service.bounds.extend(position);
                marker = new google.maps.Marker({
                    map: service.map,
                    position: res[i].geometry.location,
                    animation: google.maps.Animation.DROP
                });
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(service.formatContents(res[i]));
                        infowindow.open(map, marker);
                    }
                })(marker, i));
                service.marker.push(marker);
                service.map.fitBounds(service.bounds);
            }
            if(res.length === 1){
                service.map.setCenter(res[0].geometry.location);
                service.map.fitBounds(res[0].geometry.viewport);
            }
        };

        service.cleanAllMarkers = function(){
            service.marker.forEach(function(marker){
                marker.setMap(null);
            });
        };

        service.formatContents = function (locationObj) {
            return '<div class="info_content">' +
                '<h3>' + locationObj.name + '</h3>' +
                '<p>(' + locationObj.geometry.location.lat() + ', ' + locationObj.geometry.location.lng() + ')</p>' +
                '<p>' + locationObj.formatted_address + '</p>' +
                '</div>';
        };

        return service;
    }]);