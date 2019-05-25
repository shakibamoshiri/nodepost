const assert = require('assert');

const util = require('util');
const json = require( "../database/route.json" );
const makeRoute = require( "../path-manager/makeRoute.js" );

describe( 'Run function: makeRoute( route, list=[], parent="" )', function(){
    
    const route = makeRoute( json );
    it( "return type should be an array", function(){
        assert.equal( util.isArray( route ), true );
    });

    it( "path in route should NOT contain white-spaces", function(){
        route.forEach(function( path ){
            assert.equal( path.search( " " ), -1 );
        })
    });

})
