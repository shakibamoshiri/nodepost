const fs       = require( "fs" );
const path     = require( "path" );
const crypto   = require('crypto');
const express  = require( "express" );
const chp      = require( "child_process" );
const pm       = require( "./path-manager/pathManager" );
const co       = require( "./path-manager/colorOrganizer" );
const rm       = require( "./route-manager/routeManager" );
const dm       = require( "./database-manager/databaseManager" );

const nodepost = express();
const PORT     = 1400;

const log = console.log;
const rootPath = __dirname;
const UPDATE   = co.colorizeLine( "yellow" )( "Update:" );
const READ     = co.colorizeLine( "green" )( "Read:  " );

const stat = dm.stat;
const routeDirs = dm.routeDirs;
const statAddress = dm.statAddress;
const postsJson = dm.postsJson;

// create an array of valid paths we have
const routeJson = rm.makeRoute( postsJson );

// create or delete new directories
pm.manageDir( routeJson, routeDirs, rootPath );

// always servse thise
nodepost.use( "/build",  express.static( rootPath + "/build" ) );
nodepost.use( "/vendor",  express.static( rootPath + "/vendor" ) );
nodepost.use( "/react-js",  express.static( rootPath + "/react-js" ) );

// cache each post after last modification
const cache = {};

// for deferring some functions
async function defer( F ){
    return F;
}

// Any GET request will be handled here
nodepost.get( "/*", function( request, response ){

    const requestPath = request.path;

	const actualPath = requestPath === "/" ? routeJson[ 0 ] : routeJson[ 0 ] + requestPath;

    const absolutePath = rootPath + actualPath;

    // it will be either one of:
    // true thus the path was found
    // false thus the path was not found
    const validPath = routeJson.some( ( path ) => path === actualPath );

    // base on Valid Path
    switch( validPath ){
        case false:
        if( statAddress !== "" && requestPath === statAddress )
            response.send( stat );
         else
            response.send( pm.getContent( rootPath + "/error-page/404" ) );
        break;

        default:
        const mtime_path = fs.statSync( absolutePath ).mtime.toString();
        const mtime_main_html = fs.statSync( absolutePath + "/main.html"  ).mtime.toString();
        const mtime = crypto.createHmac( "md5", mtime_path + mtime_main_html ).digest( "hex" );

        if( cache[ absolutePath ] ){
            if( cache[ absolutePath ].mtime === mtime ){
                log( READ, "cache ..." );
                
                defer( pm.makeStat ).then( ms => ms( stat, request, rootPath ) );

                response.send( cache[ absolutePath ].html );
            } else {
                log( UPDATE, "cache ..." );
                
                cache[ absolutePath ].mtime = mtime;
                cache[ absolutePath ].html = pm.getContent( absolutePath, mtime_main_html );
                
                defer( pm.makeStat ).then( ms => ms( stat, request, rootPath ) );

                response.send( cache[ absolutePath ].html );
            }
        } else {
            log( READ, "file system ..." );
            
            cache[ absolutePath ] = { mtime: "", html: "" };
            cache[ absolutePath ].mtime = mtime;
            cache[ absolutePath ].html = pm.getContent( absolutePath, mtime_main_html );

            defer( pm.makeStat ).then( ms => ms( stat, request, rootPath ) );
            
            response.send( cache[ absolutePath ].html );
        }
    }
});

nodepost.post( "/gitpush", function( request, response ){
    response.status( 200 ).end();

    const gitPull  = chp.spawn( "git", [ "pull" ] );

    gitPull.stdout.on( "data", function( data ){
        log( "stdout: ", data.toString() );
    });

    gitPull.stderr.on( "data", function( data ){
        log( "stderr: ", data.toString() );
    });

    gitPull.on( "close", function( code ){
        log( "exit code:", code );
    });

    gitPull.on( "error", function( code ){
        log( "error code:", code );
    });
});

nodepost.listen( PORT, function(){
    log( `Server is running at http://localhost:${ PORT }/` );
});

process.on('uncaughtException', function ( exception ) {
    log( "uncaughtException happened ..." );
    log( "message:", exception.message );
    process.exit( 0 );
});
