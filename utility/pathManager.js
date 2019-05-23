const fs = require( "fs" );
const crypto = require('crypto');
const user = require('../database/user.json');

const log = console.log;

const color = {
    black:  "\033[1;30m",
    red:    "\033[1;31m",
    green:  "\033[1;32m",
    yellow: "\033[1;33m",
    blue:   "\033[1;34m",
    purple: "\033[1;35m",
    cyan:   "\033[1;36m",
    white:  "\033[1;37m",

    reset:  "\033[0m"
};

const headerFile = (function(){
    try {
        return fs.readFileSync( __dirname + "/../build/html/header.html", "utf8" );
    } catch( exception ){
        log( exception.message );
        log( "header.html is required!" );
        process.exit( 0 );
    }
}());

const gitinfo = [];
gitinfo[ 0 ] = user.git.username;
gitinfo[ 1 ] = user.git.repository;;

const baseURL = user.baseURL;
const homepageTitle = user.homeTitle;


const mainHtmlDir = fs.existsSync( "main-html" );
if( !mainHtmlDir ){
    try {
        fs.mkdirSync( "main-html" );
        log( "\033[1;32mCreate\033[0m", "main-html directories" );
    } catch( exception ){
        log( exception.message );
        process.exit( 0 );
    }
}

// route is a JSON
// list will be filled for each path
// parent will be the parent of nested directories
// at first there is no parent
function makeRoute( route, list = [], parent = "" ){
	for( path in route ){
		// dir is the directory name
		// subdir is an Object contains other directories
		const subRoute = route[ path ];

		// parent directory if it has children
        // also remove extra white-spaces in the route.json file
		const parentDir = parent + "/" + path.replace( / +/g, "-" );

		// store it
		list.push( parentDir );

		// when we have nested directories then
		// recursively parse the new Object
		if( typeof subRoute !== "string" ){
			// subRoute will be new route
			// list wil be the first one
			// parentDir will be the new parent
			makeRoute( subRoute, list, parentDir )
		}
	}
	return list;
}

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

// update time based on last modification
function mTime( file, time ){
	const update =
	`<div class="update">
		<hr>
		<i>Update: DD_MM_YYYY</i>
	</div>`;

	return file.replace( "DD_MM_YYYY", update )
			   .replace( "DD_MM_YYYY", time );

}

// create and delete directories
function manageDir( routeJson, routeDirs, rootPath ){
    
    /// sort
    routeJson = routeJson.sort();

    if( routeDirs === undefined ){
        routeDirs = [];
    } else {
        routeDirs = routeDirs.split( "\n" );
        routeDirs.sort();
    }

    const hashJson = crypto.createHmac( "md5", routeJson.join( "" ) ).digest( "hex" );
    const hashDirs = crypto.createHmac( "md5", routeDirs.join( "" ) ).digest( "hex" );

    // if there is a change in route.json file
    // try appropriate action
    if( hashJson !== hashDirs ){
    log( "route.json md5:\033[1;33m", hashJson, "\033[0m" );
    log( "route.dirs md5:", hashDirs );

        const homePath = new RegExp( routeJson[ 0 ]  + "/?" );
        const validRequest = routeJson.map( function( item ){ return item.replace( homePath, "/") } );
        
        // route.link file
        const routeLink = validRequest.map( function( request ){
           const text = request === "/" ? routeJson[ 0 ].slice( 1 ) : request.match( /[A-Za-z0-9_.-]+$/ );
           return `<a href="${ request  }">${ text }</a>`
        }).join( "\n" ) + "\n";

        const routePath = validRequest.join( "\n" ) + "\n";

        const notExistDirs = routeJson.filter(function( path ){
            return !fs.existsSync( "." + path );
        });

        // check for not existing directories
        // this is the first run all files in routeJson should be created
        notExistDirs.forEach (function( path, index ){
            // split each name
            const names = path.match( /\/?[A-Za-z0-9_.-]+/g );
            const tmp = path.replace( homePath, "/" );
            const currentPath = tmp === "/" ? baseURL + tmp : baseURL + tmp + "/";
            const gitPath = currentPath;

            // current title is the last on on the name with has "/" at the begging
            // so "/" should be replaced with ""
            const currentTitle = names.pop().replace( "/", "" );

            // parent title will be the last word in the list
            const parentTitle = names.join( "" ).match( /[A-Za-z0-9_.-]+$/ );

            // the pack link to the parent will be all names except the root name in the JSON file
            const parentLink = names.join( "" ).replace( homePath, "/" );

            const absolutePath = rootPath + path;
            const main =
`<main>
	<div class="content-r">
		<h1>${ currentTitle  }</h1>
        ${ parentTitle === null && validRequest.map( function( path ){ return `<span>path:</span> <a href="${ baseURL + path }">${ path }</a>`}).join( "<br>" ) || ""  }
		DD_MM_YYYY
        <div class="edit-on-github">
            ${ gitinfo[0] && gitinfo[1] && `<a target="_blank" href="https://github.com/${ gitinfo[0] }/${ gitinfo[1] }/blob/master${ gitPath }main.html">Edit on Github</a>`  || ""  }
        </div>
	</div>
</main>`;

            const header =
`${ headerFile.replace( '<base href="">', `<base href="${ currentPath }">` ) }
<div class="header">
        <div class="content-r">
          <h1>
            ${ tmp === "/" ?  homepageTitle : `<a href="${ baseURL }/" >${ homepageTitle }</a>` }
          </h1>
          <hr>
          <h1><a href="${ baseURL + parentLink }">${ parentTitle || "" }</a></h1>
        </div>
    </div>`;


            try {
			    fs.mkdirSync( absolutePath );
                fs.symlinkSync( ( parentTitle === null ? "../build/html/footer.html" : "../footer.html" ), absolutePath + "/footer.html" );
                fs.writeFileSync( absolutePath + "/header.html", header );
                fs.writeFileSync( absolutePath + "/main.html", main );
                routeDirs.push( path );
                log( "\033[1;32mCreate File:\033[0m", "." + path );
            } catch( exception ){
                log( exception.message );
            }

            try {
                fs.symlinkSync( absolutePath + "/main.html", "./main-html/" + currentTitle );
            } catch( exception ){
                if( exception.message.search( "EEXIST" ) === 0 ){
                    try {
                        const dirs =  absolutePath.split( "/" );
                        const fileName = dirs.pop();
                        const parentName = dirs.pop();
                        if( parentName !== undefined ){
                            fs.symlinkSync( absolutePath + "/main.html", "./main-html/" + fileName + "-in-" + parentName );
                        } else {
                            log( "Not able to create symbolic link for:", fileName );
                        }
                    } catch( exception ){
                        log( exception.message );
                    }
                }
            }
        }); // end of forEach of notExistDirs

        if( notExistDirs.length > 0 ){
            routeDirs.sort();
        }
            
        // When we have change and notExistDirs === 0 it means
        // something has changed but it is not adding to the route.json file
        // maybe it is a remote or rename operation
        const notExistKey = routeDirs.filter(function( key ){
            return routeJson.indexOf( key ) === -1;
        });

        notExistKey.forEach(function( path ){
            try {
                rmdirSyncRec( "." + path );
                fs.readdirSync( "./main-html" ).forEach(function( file ){
                    if( !fs.existsSync( "./main-html/" + file ) ){
                        fs.unlinkSync( "./main-html/" + file );
                    }
                });
                log( "\033[1;31mDelete File:\033[0m", "." + path );
            } catch( exception ){
                log( exception.message );
            }
        });

        routeDirs = routeJson.slice( 0 );
    
        fs.writeFile( "./database/route.dirs", routeDirs.join( "\n" ) , function( error ){
            if( error ){
                console.log( error.message );
            }
            log( "\033[1;32mUpdate route.dirs ...\033[0m" );
        });

        fs.writeFile( "./database/route.link", routeLink , function( error ){
            if( error ){
                console.log( error.message );
            }
            log( "\033[1;32mUpdate route.link ...\033[0m" );
        });

        fs.writeFile( "./database/route.path", routePath , function( error ){
            if( error ){
                console.log( error.message );
            }
            log( "\033[1;32mUpdate route.path ...\033[0m" );
        });

    } // end of hashes' comparison
}


function getContent( path, mtime ){
	// const stat = fs.statSync( path );
    const temp = fs.readFileSync( path + "/main.html", "utf8" );
	
    const header = fs.readFileSync( path + "/header.html", "utf8" );
	const main = mTime( temp, mtime );
	const footer = fs.readFileSync( path + "/footer.html", "utf8" );

	return header + main + footer;
}

function makeStat( stat, request ){ 
    const rp = request.path;
    const lastIP = request.ip;
    if( !stat[ rp ] ){
        stat[ rp ] = { lastIP: "", request: 0, visitor: {} };
    }
    stat[ rp ].lastIP = lastIP;
    stat[ rp ].request += 1;
    stat[ rp ].visitor[ lastIP ] = ( stat[ rp ].visitor[ lastIP ] + 1 || 1 );
    fs.writeFile( "./database/stat.json", JSON.stringify( stat ), function( error ){
        if( error ){
            console.log( error );
        }
    });
    console.log( "Update state ...");
}

module.exports = { makeRoute, manageDir, getContent, makeStat };
