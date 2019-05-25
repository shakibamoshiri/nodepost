const fs = require( "fs" );
const updateTime = require( "./updateTime" );


function getContent( path, mtime ){
	// const stat = fs.statSync( path );
    const temp = fs.readFileSync( path + "/main.html", "utf8" );
	
    const header = fs.readFileSync( path + "/header.html", "utf8" );
	const main = updateTime( temp, mtime );
	const footer = fs.readFileSync( path + "/footer.html", "utf8" );

	return header + main + footer;
}

module.exports = getContent;
