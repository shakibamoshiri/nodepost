const fs = require( "fs" );
const path = require( "path" );
const log = console.log;

const rootPost = (function(){
    try {
        return JSON.parse( fs.readFileSync( __dirname + "/database/posts.json" , "utf8" ) );
    } catch( exception ){
        log( exception.message );
        log( "./database/posts.json is required!" );
        process.exit( 0 );
     }
}());

const HOME_DIR = Object.keys( rootPost )[ 0 ];
const ENTRY_PATH = __dirname + "/" + HOME_DIR;

const OUTPUT_DIR = "/build/react/";
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
const mainJsFiles = readDirRec( ENTRY_PATH ).filter(function( file ){
    return path.basename( file ) === "main.js";
});

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

/*
    when the returned object by readDirRec() had no
    property or all the file already have been bundled
    do nothing.
*/
if( Object.keys( jsNotBundled ).length === 0 ){
    log( "webpack exited in either case of:" );
    log( `1. no main.js files found in ${ ENTRY_PATH  }` );
    log( `2. you already have bundled files in ${ OUTPUT_PATH  }` );
    process.exit( 0 );
}

module.exports = {
    mode: 'production',
    entry: jsNotBundled,
    output: {
        path: OUTPUT_PATH,
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
};
