const fs = require( "fs" );

// recursively delete file and directories
function rmdirSyncRec( path ){
    // check if it is a valid path
    if( fs.existsSync( path ) ){
        
        // read the path to an array
        fs.readdirSync( path ).forEach( function( file ){

            // files in the path
            // and new path
            const newFile = path + "/" + file;;

            // check if the new file is a directory or not
            if( fs.statSync( newFile ).isDirectory() ){

                // if it is repeat this process
                rmdirSyncRec( newFile );
            } else {

                // if not so it is file
                // delete it
                fs.unlinkSync( newFile );
            }
        });
        // stack is unwinded
        fs.rmdirSync( path );
    }
}

module.exports = rmdirSyncRec;
