var express = require( 'express' );
var http = require( 'http' );
var app = express();

app.use( express.static( __dirname + '/content' ) );

app.get( '/products', function ( req, res ) {
    console.log( req.params );
    var distance = req.query.distance;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var language = req.query.language;
    if ( !language ) {
        language = "no";
    }
    var limit = req.query.limit;
    if ( !limit ) {
        limit = 100;
    }
    var url = "http://product.test.visitnorway.com/api/products?sort=distance&latitude=" + latitude + "&longitude=" + longitude + "&withinDistance=" + distance.toString() + "&limit=" + limit.toString();
    console.log( "Getting " + url );
    http.get( url, function ( response ) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "",
            data,
            route;

        response.on( "data", function ( chunk ) {
            console.log( "Got data..." );
            buffer += chunk;
        });

        response.on( "end", function ( err ) {
            console.log( "Data done." );
            res.send( buffer );
        });
    });
});

var server = app.listen( 3000, function () {
    console.log( 'Listening on port %d', server.address().port );
});


