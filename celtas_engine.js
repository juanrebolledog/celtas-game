var Celta = {

    init: function ( config ) {
        if ( config.gameType ) {
            this.gameType = config.gameType;
        }
        if ( config.empty ) {
            this.empty = config.empty;
        }
        if ( config.special ) {
            this.special = config.special;
        }
        this.width = 7;
        this.height = 7;
        this.board = [];
        this.radius = 3;
        this.rlen = 0;
        this.piece = {
            type: 'null',
            position: { x: 0, y: 0 }
        };
        this.gameTemplates = {
            'celtas': {
                label: 'Regular Celtas Game',
                type: 'auto'
            },
            'celtas01': {
                label: 'Immortal Chip Celtas Game',
                type: 'user',
                empty: 'user',
                special: 'user'
            }
        };
        this.createBoard(this.width, this.length);
        return this;
    },

    createBoard: function (width, height) {
        this.center = { x: 4, y: 4 };
        this.rlen = this.calculateLength(this.radius + this.center.x, this.center.y);
        this.board = [width];
        for (var h = 0; h < this.height; h++) {
            this.board[h] = [this.height];
            for (var w = 0; w < this.width; w++) {
                var pieceClone = this.clone(this.piece);
                pieceClone.position = { x: w+1, y: h+1 };
                var pieceRLen = this.calculateLength(pieceClone.position.x, pieceClone.position.y);
                if ( pieceRLen <= this.rlen ) {
                    pieceClone.type = 'full';
                }
                this.board[h][w] = pieceClone;
            }
        }
        if ( this.gameTemplates[this.gameType] ) {
            var tmpl = this.gameTemplates[this.gameType];
            switch ( tmpl.type ) {
                case 'auto':
                    this.board[this.center.x - 1][this.center.y - 1].type = 'empty';
                    break;
                case 'user':
                    this.board[this.empty.x - 1][this.empty.y - 1].type = 'empty';
                    this.board[this.special.x - 1][this.special.y - 1].type = 'special';
                    break;
            }
        }
    },

    calculateLength: function (i, j) {
        x = i - this.center.x;
        y = j - this.center.y;
        return Math.round( Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) ) );
    },
    
    getBoard: function () {
        return this.board;
    },

    getPiece: function (x, y) {
        // the pieces are warped
        return this.board[ y - 1 ][ x - 1 ];
    },

    move: function (from, to) {
        var success = {
            valid: false
        },
        from = {
            x: parseInt(from.split('-')[0]),
            y: parseInt(from.split('-')[1]),
            inBoard: {}
        },
        to = {
            x: parseInt(to.split('-')[0]),
            y: parseInt(to.split('-')[1]),
            inBoard: {}
        },
        diff = {
            x: to.x - from.x,
            y: to.y - from.y,
            inBoard: {}
        },
        middle = {
            x: 0,
            y: 0,
            inBoard: {}
        };
        if ( diff.x == 0 ) {
            middle.x = to.x;
            if ( diff.y < 0 ) {
                middle.y = from.y - 1;
            } else {
                middle.y = to.y - 1;
            }
        } else {
            if ( diff.x < 0 ) {
                middle.x = from.x - 1;
            } else {
                middle.x = to.x - 1;
            }
            middle.y = to.y;
        }
        middle.inBoard = this.getPiece( middle.x, middle.y );
        from.inBoard = this.getPiece( from.x, from.y );
        to.inBoard = this.getPiece( to.x, to.y );

        if ( middle.inBoard.type == 'full' && to.inBoard.type == 'empty' && from.inBoard.type == 'full' ) {
            if ( 
                ( Math.abs( diff.x ) == 2 || diff.x == 0 ) &&
                ( Math.abs( diff.y ) == 2 || diff.y == 0 )
            ) {
                middle.inBoard.type = from.inBoard.type = 'empty';
                to.inBoard.type = 'full';
                return {
                    valid: true,
                    pieces: [
                        middle.inBoard,
                        from.inBoard,
                        to.inBoard
                    ]
                };
            }
        }
        return success;
    },

    valid: function (from, to) {

    },

    clone: function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    
    getGameTypes: function () {
        return this.gameTemplates;
    }

}