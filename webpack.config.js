const fs = require( "fs" );

const ENTRY_PATH = __dirname + "/react-js/";
const OUTPUT_PATH = ENTRY_PATH + "/build/"

const mainJsFiles = fs.readdirSync( ENTRY_PATH )
    .filter( name => fs.statSync( ENTRY_PATH + "/" + name ).isDirectory() === false )
    .reduce( ( result, name ) => {
        const key = name.slice( 0, name.length - 3 );
        result[ key ] = ENTRY_PATH +  name;
        return result;
}, {});

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
