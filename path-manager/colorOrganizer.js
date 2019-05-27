const log = console.log;

const ANSI = {
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
