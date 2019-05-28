const fs = require( "fs" );
const co = require( "../path-manager/colorOrganizer" );

const log = console.log;
const globalRootPath = __dirname.split( "/" ).slice( 0, -1 ).join( "/" );
const toGreen = co.colorizeLine( "green" );

// raw json file
const route_json = require( "../database/route.json" );

const stat = (function(){
    try {
        return JSON.parse( fs.readFileSync( globalRootPath + "/database/stat.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( toGreen( "Create:" ), "stat.json" );
        try {
            fs.writeFileSync( globalRootPath + "/database/stat.json", "{}" );
            return JSON.parse( fs.readFileSync( globalRootPath + "/database/stat.json" , "utf8" ) );
        } catch( exception ){
            log( exception.message );
            process.exit( 0 );
        }
     }
}());

// read route.dirs if not found create it
const routeDirs = (function(){
    try {
        return fs.readFileSync( globalRootPath + "/database/route.dirs", "utf8" );
    } catch( exception ){
        log( exception.message );
        log( toGreen( "Create:" ),"route.dirs" );
        try {
            fs.writeFileSync( globalRootPath + "/database/route.dirs", "" );
            return undefined;
        } catch( exception ){
            log( exception.message );
            process.exit( 0 );
        }
    }
}());

const user = (function(){
    try {
        return JSON.parse( fs.readFileSync( globalRootPath + "/database/user.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( "./database/user.json is required!" );
        process.exit( 0 );
     }
}());

const statPath = (function(){
    try {
        return JSON.parse( fs.readFileSync( globalRootPath + "/database/user.json" , "utf8" ) ).statPath;
    } catch( exception ){
        log( exception.message );
        log( "statPath fallback will be /stat" );
        return "/stat";
    }
}());

module.exports = { stat, statPath, routeDirs, route_json, user };
