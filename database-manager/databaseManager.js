const fs = require( "fs" );
const log = console.log;

// raw json file
const route_json = require( "../database/route.json" );

const stat = (function(){
    try {
        return JSON.parse( fs.readFileSync( "./database/stat.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( "Creating stat.json file" );
        try {
            fs.writeFileSync( "./database/stat.json", "{}" );
            return JSON.parse( fs.readFileSync( "./database/stat.json" , "utf8" ) );
        } catch( exception ){
            log( exception.message );
            process.exit( 0 );
        }
     }
}());

// read route.dirs if not found create it
const routeDirs = (function(){
    try {
        return fs.readFileSync( "./database/route.dirs", "utf8" );
    } catch( exception ){
        log( exception.message );
        log( "Creating route.dirs" );
        try {
            fs.writeFileSync( "./database/route.dirs", "" );
            return undefined;
        } catch( exception ){
            log( exception.message );
            process.exit( 0 );
        }
    }
}());

const user = (function(){
    try {
        return JSON.parse( fs.readFileSync( "./database/user.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( "./database/user.json is required!" );
        process.exit( 0 );
     }
}());

const statPath = (function(){
    try {
        return JSON.parse( fs.readFileSync( "./database/user.json" , "utf8" ) ).statPath;
    } catch( exception ){
        log( exception.message );
        log( "statPath fallback will be /stat" );
        return "/stat";
    }
}());

module.exports = { stat, statPath, routeDirs, route_json, user };
