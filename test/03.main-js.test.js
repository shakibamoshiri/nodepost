const fs = require( "fs" );
const path = require( "path" );
const assert = require('assert');
const log = console.log;

const rootPost = (function(){
    try {
        return JSON.parse( fs.readFileSync( __dirname + "/../database/posts.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( "./database/posts.json is required!" );
        process.exit( 0 );
     }
}());

const HOME_DIR = Object.keys( rootPost )[ 0 ];
const ENTRY_PATH = __dirname + "/../" + HOME_DIR;

const OUTPUT_DIR = "/../build/react/";
const OUTPUT_PATH = __dirname + OUTPUT_DIR;

/*
    Reading the contents of OUTPUT_PATH to see if we
    already have some bundled files, if so do not add
    those to the list which webpack uses them for its entry
*/
function checkBundleFile( path ){
    if( fs.existsSync( path ) ){
        const list = [];
        fs.readdirSync( path ).forEach(function( file ){
            list.push( file );
        });
        return list;
    }
    return [];
}

const bundledFiles = checkBundleFile( OUTPUT_PATH );

// log( "bundledFiles\n", bundledFiles );
/*
    Finding all main.js files inside ENTRY_PATH
    recursively and return an array of them
*/
function readDirRec( path, list = [] ){
   if( fs.existsSync( path ) ){
       fs.readdirSync( path ).forEach(function( dir ){
           const newPath = path + "/" + dir;
           if( fs.statSync( newPath ).isDirectory() ){
               readDirRec( newPath, list );
           } else {
               list.push( newPath );
           }
       });
       list.push( path );
   }

   return list;
}


/*
    just return main.js files
    then if skip those that already in OUTPUT_PATH
    and store the rest on an object and return it
*/
const mainJsFiles =
readDirRec( ENTRY_PATH ).filter(function( file ){
    return path.basename( file ) === "main.js";
});
// log( "mainJsFiles\n", mainJsFiles );

const jsNotBundled = mainJsFiles.reduce(function( result, name ){
    const temp = name.split( "/" );
    const key = temp.slice( temp.length - 2, -1 ).pop();
    if( bundledFiles.length ){
        const foundAny = bundledFiles.every(function( bundleName ){
            return !bundleName.startsWith( key )
        });
        if( foundAny ){
            result[ key ] = name;
        }
    } else {
        result[ key ] = name;
    }
    return result;
}, {});

// log( "jsNotBundled\n", jsNotBundled );

describe( "main.js files", function(){
    const rest = mainJsFiles.length - bundledFiles.length;

    it( `mainJsFiles (${ mainJsFiles.length }) minus bundledFiles (${ bundledFiles.length }) should be equal to ${ rest }`, function(){
        assert.equal( rest, Object.keys( jsNotBundled ).length );
    });

    it(`for (${ mainJsFiles.length  }) mainJsFiles we should have (${ mainJsFiles.length  }) bundled js file in build/react/`, function(){
        assert.equal( mainJsFiles.length, bundledFiles.length );
    });
})
