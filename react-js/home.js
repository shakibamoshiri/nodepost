import React, { Fragment } from "react";
import { render } from "react-dom";

const sample_code = `import React, { Fragment } from "react";
import { render } from "react-dom";

const Prism = ( props ) => <pre><code className="language-javascript">
    { props.children }
</code></pre>;

const Title = ( props ) => <h1 className="title">
    { props.children }
</h1>;

const SubTitle = ( props ) => <h3 className="sub-title">
    { props.children }
</h3>;

const root = <Fragment>
    <SubTitle>Also using React is possible</SubTitle>
    <p>This content has been produced using React</p>
    <Prism>{ sample_code }</Prism>
    <p>Next: <a href="http://nodepost.ir">Going back  to nodepost.ir</a></p>
</Fragment>;

const div_id_root = document.getElementById( "root" );
render( root, div_id_root );`;

const Prism = ( props ) => <pre><code className="language-javascript">
    { props.children }
</code></pre>;

const Title = ( props ) => <h1 className="title">
    { props.children }
</h1>;

const SubTitle = ( props ) => <h3 className="sub-title">
    { props.children }
</h3>;

const root = <Fragment>
    <SubTitle>Also using React is possible</SubTitle>
    <p>This content has been produced using React
    </p>
    <Prism>{ sample_code }</Prism>
    <p>Next: <a href="http://nodepost.ir">Going back to nodepost.ir</a></p>
</Fragment>;

const div_id_root = document.getElementById( "root" );
render( root, div_id_root );
