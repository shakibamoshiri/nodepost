const assert = require('assert');
const user = require( "../database/user.json" );

describe( "Validating user.json file", function(){
  it( "user.homeTitle should be empty", function(){
    assert.notEqual( user.homeTitle, "" );
  });

  if( user.baseURL !== "" ){
    it( "user.baseURL should start with '/'", function(){
      assert.equal( user.baseURL.startsWith( "/" ), true );
    });
    
    it( "user.baseURL should NOT contain space", function(){
      assert.equal( user.baseURL.search( " " ), -1 );
    });

    it( "user.baseURL should NOT end with '/'", function(){
      assert.equal( user.baseURL.endsWith( "/" ), false );
    });
  }

  it( "user.statAddress should start with '/'", function(){
    assert.equal( user.statAddress.startsWith( "/" ), true );
  });


})
