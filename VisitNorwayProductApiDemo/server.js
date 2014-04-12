var express = require( 'express' );
var http = require( 'http' );
var app = express();

app.get( '/products', function ( req, res ) {
    var distance = req.params.dist;
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;
    var limit = req.params.limit;
    if ( !limit ) {
        limit = 100;
    }
    var url = "http://product.test.visitnorway.com/api/products?sort=distance&latitude=" + latitude; //+ "&longitude=" + longitude + "&withinDistance=" + distance + "&limit=" & limit;
    console.log( "Getting " + url );
    http.get( url, function ( response ) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "",
            data,
            route;

        response.on( "data", function ( chunk ) {
            buffer += chunk;
        });

        response.on( "end", function ( err ) {
            res.send( buffer );
        });
    });
});

var server = app.listen( 3000, function () {
    console.log( 'Listening on port %d', server.address().port );
});


