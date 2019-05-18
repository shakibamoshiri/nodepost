
// this is for non-hex code
// and hex code are created dynamically
// for that see function parse_hex_color
const color =
[   
    // 3 color-mode
    "normal",
    "light",
    "dark", 

    // 4 text-mode
    "italic",
    "underline",
    "blink",
    "cross",

    // 8 foreground and background
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "purple",
    "cyan",
    "white"
];

const  ANSI =
[

    // 3 color-mode
    "0;",
    "1;",
    "2;",

    // 4 text-mode
    "3;",
    "4;",
    "5;",
    "9;",
    
    // 8 foreground and background
    "30;",
    "31;",
    "32;",
    "33;",
    "34;",
    "35;",
    "36;",
    "37;",
];

const log = console.log;

function clog( code, string ){
    const template = "\033[1;23mXXX\033[0m";
    // color.reduce(function( result, item, index ){});
    const userLine = string.split( ":" );

}

clog( "okay" );
