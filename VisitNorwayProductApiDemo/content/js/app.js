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
        var spinner = new Spinner({lined: 13, color: ['#f00', '#fff', '#00f']}).spin(target);
        $.getJSON( url, function ( data ) {
            $.each( data, function ( key, val ) {
                 var contentString = '<div id="content">'+
                      '<a href="http://test.visitnorway.com/product/?pid=' + val.id.toString() + '"><h1 id="firstHeading" class="firstHeading">' + val.name + '</h1></a>'+
                      '<div id="bodyContent">'+
                      getImageFrom(val) +
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

    function setMarkersForDefaultLocation(){
        console.log('Unable to get position, using default.');
        addMarkersForNearbyPois(map.getCenter());
    }

    function addClientPositionMarker(position){
        console.log('Adding client position marker');
        myloc = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                            new google.maps.Size(22,22),
                                                            new google.maps.Point(0,18),
                                                            new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map,
            title: 'My position'
        });
        myloc.setPosition(position);
    }

    function setMarkersForClientsPosition(position){
        var clientPosition = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
        addClientPositionMarker(clientPosition);
        addMarkersForNearbyPois(clientPosition);
    }

    navigator.geolocation.getCurrentPosition(
        setMarkersForClientsPosition, 
        setMarkersForDefaultLocation);

});

function getImageFrom(product){
    if(product.image)
        return '<img src="' + product.image.url + '" style="width: 150px;"/>';
    return '';
}