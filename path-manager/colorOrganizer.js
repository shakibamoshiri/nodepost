const log = console.log;

const ANSI = {
    black:  "\x1B[1;30m",
    red:    "\x1B[1;31m",
    green:  "\x1B[1;32m",
    yellow: "\x1B[1;33m",
    blue:   "\x1B[1;34m",
    purple: "\x1B[1;35m",
    cyan:   "\x1B[1;36m",
    white:  "\x1B[1;37m",

    reset:  "\x1B[0m"
};

function colorizeLine( color ){
    return function( line ){
        return ANSI[ color ] + line + ANSI.reset;
    }
}

function colorizeLines( color ){
    return function( lines ){
        return lines.map(function( line ){
            return colorizeLine( color )( line )
        });
    }
}

function colorize( lines, color ){
    try {
        return colorizeLines( color )( lines );
    } catch( exception ){
        try {
            return colorizeLine( color )( lines );
        } catch( exception ){
            log( exception.message );
        }
    }
}

module.exports = { colorize, colorizeLine, colorizeLines };
