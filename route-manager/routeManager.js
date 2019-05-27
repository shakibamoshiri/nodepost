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

module.exports = { makeRoute };
