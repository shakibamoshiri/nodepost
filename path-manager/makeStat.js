const fs = require( "fs" );

function makeStat( stat, request ){ 
    const rp = request.path;
    const lastIP = request.ip;
    if( !stat[ rp ] ){
        stat[ rp ] = { lastIP: "", request: 0, visitor: {} };
    }
    stat[ rp ].lastIP = lastIP;
    stat[ rp ].request += 1;
    stat[ rp ].visitor[ lastIP ] = ( stat[ rp ].visitor[ lastIP ] + 1 || 1 );
    fs.writeFile( "./database/stat.json", JSON.stringify( stat ), function( error ){
        if( error ){
            console.log( error );
        }
    });
    console.log( "Update state ...");
}

module.exports = makeStat;
