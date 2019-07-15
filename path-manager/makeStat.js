const fs = require( "fs" );

const co = require( "./colorOrganizer" );
const UPDATE   = co.colorizeLine( "yellow" )( "Update:" );

function makeStat( stat, request, rootPath ){ 
    const requestPath = request.path;
    const xForwardedFor = request.headers[ "x-forwarded-for" ];
    const lastIP = xForwardedFor || request.ip;
    if( !stat[ requestPath ] ){
        stat[ requestPath ] = { lastIP: "", request: 0, visitor: {} };
    }
    stat[ requestPath ].lastIP = lastIP;
    stat[ requestPath ].request += 1;
    stat[ requestPath ].visitor[ lastIP ] = ( stat[ requestPath ].visitor[ lastIP ] + 1 || 1 );
    fs.writeFile( rootPath + "/database/stat.json", JSON.stringify( stat ), function( error ){
        if( error ){
            console.log( error );
        }
    });
    console.log( UPDATE, "stat ...");
}

module.exports = makeStat;
