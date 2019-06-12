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
const OUTPUT_PATH = __dirname + "/build/react/"

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

const mainJsFiles =
readDirRec( ENTRY_PATH ).filter(function( file ){
    return path.basename( file ) === "main.js";
}).reduce(function( result, name ){
    const temp = name.split( "/" );
    const key = temp.slice( temp.length - 2, -1 );
    result[ key ] = name;
    return result;
}, {});

if( Object.keys( mainJsFiles ).length === 0 ){
    log( "No main.js file found!" );
    log( "in:", ENTRY_PATH );
    process.exit( 0 );
}

module.exports = {
    mode: 'production',
    entry: mainJsFiles,
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
