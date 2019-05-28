// postsJson is a JSON
// route will be filled for each path
// parent will be the parent of nested posts
// at first there is no parent
function makeRoute( postsJson, route = [], parent = "" ){
    for( post in postsJson ){
        // children if there is any
        const subPosts = postsJson[ post ];

        // parent directory if it has children
        // also remove extra white-spaces in the postsJson.json file
        const parentDir = parent + "/" + post.replace( / +/g, "-" );

        // store it
        route.push( parentDir );

        // when we have nested posts then
        // recursively parse the sub-posts
        if( typeof subPosts !== "string" ){
            // subPosts will be new postsJson
            // route wil be continually filled
            // parentDir will be the new parent
            makeRoute( subPosts, route, parentDir )
         }
    }
    return route;
}

module.exports = { makeRoute };
