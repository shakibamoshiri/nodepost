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

module.exports = {  stat, routeDirs, route_json };
