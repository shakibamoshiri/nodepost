const fs       = require( "fs" );
const path     = require( "path" );
const express  = require( "express" );
const pm       = require( "./path-manager/pathManager" );
const rm       = require( "./route-manager/routeManager" );
const dm       = require( "./database-manager/databaseManager" );

const log = console.log;
const nodepost = express();

const stat = dm.stat;
const routeDirs = dm.routeDirs;
const statPath = dm.statPath;
const route_json = dm.route_json;

// create an array of valid paths we have
const routeJson = rm.makeRoute( route_json );

// create or delete new directories
pm.manageDir( routeJson, routeDirs, __dirname  );

// always servse thise
nodepost.use( "/build",  express.static( __dirname + "/build" ) );
nodepost.use( "/vendor",  express.static( __dirname + "/vendor" ) );

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

    const absolutePath = __dirname + actualPath;

    // it will be either one of:
    // true thus the path was found
    // false thus the path was not found
    const validPath = routeJson.some( ( path ) => path === actualPath );

    // base on Valid Path
    switch( validPath ){
        case false:
        if( statPath !== "" && requestPath === statPath )
            response.send( stat );
         else
            response.send( pm.getContent( __dirname + "/error-page/404" ) );
        break;

        default:
        const mtime = fs.statSync( absolutePath ).mtime.toString();

        if( cache[ absolutePath ] ){
            if( cache[ absolutePath ].mtime === mtime ){
                log( "Serve from cache ..." );
                
                defer( pm.makeStat ).then( ms => ms( stat, request ) );

                response.send( cache[ absolutePath ].html );
            } else {
                log( "Update the cache ..." );
                
                cache[ absolutePath ].mtime = mtime
                cache[ absolutePath ].html = pm.getContent( absolutePath, mtime );
                
                defer( pm.makeStat ).then( ms => ms( stat, request ) );

                response.send( cache[ absolutePath ].html );
            }
        } else {
            log( "Serve from file system ..." );
            
            cache[ absolutePath ] = { mtime: "", html: "" };
            cache[ absolutePath ].mtime = mtime;
            cache[ absolutePath ].html = pm.getContent( absolutePath, mtime );

            defer( pm.makeStat ).then( ms => ms( stat, request ) );
            
            response.send( cache[ absolutePath ].html );
        }
    }
});

nodepost.listen( 1400, function(){
    log( "Server is running at http://localhost:1400/" );
});
