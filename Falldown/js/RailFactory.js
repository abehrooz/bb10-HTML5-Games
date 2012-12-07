function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
        data = data.toString();
        for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
};

function Alea() {
    return (function(args) {
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;

        if (args.length == 0) {
            args = [+new Date];
        }
        var mash = Mash();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');

        for (var i = 0; i < args.length; i++) {
            s0 -= mash(args[i]);
            if (s0 < 0) {
                s0 += 1;
            }
            s1 -= mash(args[i]);
            if (s1 < 0) {
                s1 += 1;
            }
            s2 -= mash(args[i]);
            if (s2 < 0) {
                s2 += 1;
            }
        }
        mash = null;

        var random = function() {
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
        };
        random.uint32 = function() {
            return random() * 0x100000000; // 2^32
        };
        random.fract53 = function() {
            return random() +
                (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        };
        random.version = 'Alea 0.9';
        random.args = args;
        return random;

    } (Array.prototype.slice.call(arguments)));
};


function RandomRail() {
    return (function(args) {
        if (args.length ==  0) {
            args = [+new Date, 500, 120, 32, 768];
        }
        var seed = args[0]? args[0] : +new Date;
        var width = args[1] ? args[1] : 500;
        var wholeSize = args[2] ? args[2]: 120;
        var height = args[3]? args[3]: 32;
        var minWith = args[4]? args[4]: 200;
        var frameWidth = args[5]? args[5]: 768;
        var random =  new Alea(seed);
        function createobstacle(x, y, width) {
            var result = {}
            result["height"] = height;
            result["width"] = width;
            result["x"] = x;
            result["y"] = y;
            return result;
        }
        var rail = function (y) {
            var nextRail = [];
            var i;
            for (i = -2; i< 2 ; i++){
                var x1 = i*width;
                var width1 = Math.floor(random() * (width- wholeSize - minWith) + minWith );
                if (x1>0 && x1< wholeSize){
                    x1 = 0;
                }
                if (x1> 0 && frameWidth - (x1 + width1)< wholeSize){
                    width1 += frameWidth - (x1 + width1)
                }
                nextRail.push(createobstacle(x1, y, width1));
                var x2 = x1 + width1 + wholeSize;
                if (x2>0 && x2< wholeSize){
                    x2 = 0;
                }
                var width2 = (width-width1-wholeSize)+ 1;
                if (x2> 0 && frameWidth - (x2 + width2)< wholeSize){
                    width2 += frameWidth - (x2 + width2)
                }
                nextRail.push(createobstacle(x2, y, width2 ))
            }
            return nextRail;
        };
        return rail;
    }(Array.prototype.slice.call(arguments)));
};



