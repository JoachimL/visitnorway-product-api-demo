$( document ).ready( function () {
    var products = [];
    var mapOptions = {
        center: new google.maps.LatLng( 59.911236, 10.739211 ),
        zoom: 8
    };

    var map = new google.maps.Map( document.getElementById( "google-map" ),
        mapOptions );

    function removeCurrentMarkers() {
        for(var ii = 0; ii < products.length; ii = ii + 1) {
            var productMarker = products.pop();
            productMarker.setMap(null);
        }
    }

    function addMarkersForNearbyPois(position){
        var url = "/products?language=no&latitude=" + position.lat() + "&longitude=" + position.lng() + "&distance=" + 30000 + "&limit=50";
        var latlngbounds = new google.maps.LatLngBounds();

        removeCurrentMarkers();

        var target = document.getElementById('google-map');
        var spinner = new Spinner({lined: 13}).spin(target);
        $.getJSON( url, function ( data ) {
            console.log('Got ' + data.length.toString() + ' products.');
            $.each( data, function ( key, val ) {
                 var contentString = '<div id="content">'+
                      '<div id="siteNotice">'+
                      '</div>'+
                      '<h1 id="firstHeading" class="firstHeading">' + val.name + '</h1>'+
                      '<div id="bodyContent">'+
                      getImageFrom(val)
                      '</div>'+
                      '</div>';

                var infowindow = new google.maps.InfoWindow({
                      content: contentString
                  });

                var marker = new google.maps.Marker( {
                    position: new google.maps.LatLng(val.geoLocation.latitude, val.geoLocation.longitude),
                    map: map,
                    title: val.name
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                  });


                latlngbounds.extend(marker.position);
                products.push(marker);
            });
            map.fitBounds(latlngbounds);
        })
        .done(function(){
            spinner.stop();
        });
    }

    google.maps.event.addListener( map, 'click', function ( event ) {        
        addMarkersForNearbyPois(event.latLng);
    });

    var myControl = document.getElementById( 'header' );
    map.controls[google.maps.ControlPosition.TOP_LEFT].push( myControl );


    navigator.geolocation.getCurrentPosition(
        function(position){
            var mapLocation = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
            addMarkersForNearbyPois(mapLocation);
        }, function(){
            addMarkersForNearbyPois(map.getCenter());
        });

});

function getImageFrom(product){
    if(product.image)
        return '<img src="' + product.image.url + '" style="width: 150px;"/>';
    return '';
}