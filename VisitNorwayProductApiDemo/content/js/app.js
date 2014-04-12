$( document ).ready( function () {
    var products = [];
    var mapOptions = {
        center: new google.maps.LatLng( 59.911236, 10.739211 ),
        zoom: 8
    };

    var map = new google.maps.Map( document.getElementById( "google-map" ),
        mapOptions );

    google.maps.event.addListener( map, 'click', function ( event ) {

        for(var ii = 0; ii < products.length; ii = ii + 1) {
            var product = products.pop();
            product.map = null;
        }


        var lat = event.latLng.lat();
        var long = event.latLng.lng();
        var url = "/products?language=no&latitude=" + lat + "&longitude=" + long + "&distance=" + 30000;
        console.log( "Getting " + url );
        var latlngbounds = new google.maps.LatLngBounds();
        $.getJSON( url, function ( data ) {
            $.each( data, function ( key, val ) {

                var shape, image;
                if(val.image && val.image.url) {
                    image = {
                        url: val.image.url,
                        // This marker is 20 pixels wide by 32 pixels tall.
                        size: new google.maps.Size(20, 32),
                        // The origin for this image is 0,0.
                        origin: new google.maps.Point(0,0),
                        // The anchor for this image is the base of the flagpole at 0,32.
                        anchor: new google.maps.Point(0, 32)
                      };
                     shape = {
                          coord: [1, 1, 1, 20, 18, 20, 18 , 1],
                          type: 'poly'
                      };
                }

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
                    title: val.name,
                    shape: shape,
                    image: image
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                  });


                latlngbounds.extend(marker.position);
                products.push(marker);
            });
            map.fitBounds(latlngbounds);
        });
    });

    var myControl = document.getElementById( 'header' );
    map.controls[google.maps.ControlPosition.TOP_LEFT].push( myControl );

});

function getImageFrom(product){
    if(product.image)
        return '<img src="' + product.image.url + '" style="width: 150px;"/>';
    return '';
}