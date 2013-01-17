/*global cc, Worker */

/* Global namespace for communicating with the Web Worker. */
var _g = {
    LayerStart:null,
    score:null
};

var GameLayer = cc.Layer.extend({
    physics:null, /* Our physics Web Worker. */
    background:null, /* A cc.Sprite with our background image. */
    ball:null, /* A cc.Sprite with our ball image and properties. */
    context:null,
//    ballSoundEfx:null,
    floors:null, /* An [] of floor objects retrieved from the TMX file. */
    /* An [] of floor objects retrieved from the TMX file. */

    ctor:function () {
        cc.associateWithNative(this, cc.Layer);
        this.init();
    },
    init:function () {
        var tmx, n, j;
        var nextRail = new RandomRail(5887);

//        this.ballSoundEfx = window.document.getElementById("soundEfx");

        /* Always call _super() first. */
        this._super();
        _g.LayerStart = this;
        _g.score = 0


        /* Load our TMX-as-XML world. */
        tmx = cc.TMXTiledMap.create('./tmx/0-0.xml');

        var initialFloors = [];
        for (var i = -1000; i <= 250; i += 200) {
            initialFloors.push(nextRail(i));
        }
        ;



//        var bufferLoader;
        this.context = new webkitAudioContext();

        this.bufferLoader = new BufferLoader(
            this.context,
            [
                'music/filter-noise-2.wav',
                'music/cardiod-true-stereo-15-8.wav'
            ],
            _g.LayerStart.finishedLoading
        );

        this.bufferLoader.load();

        this.convolver = this.context.createConvolver();
        this.convolver.connect(this.context.destination);
//        this.convolver.buffer = this.bufferLoader.bufferList[1];

        pingBuffer = 0;
//        _g.LayerStart.loadPing('music/filter-noise-2.wav');
//        _g.LayerStart.loadImpulseResponse('music/cardiod-true-stereo-15-8.wav');





        var winSize = cc.Director.getInstance().getWinSize();

        // score
        this.lbScore = cc.LabelTTF.create("Score: 0", "Arial Bold", 28, cc.SizeMake(400, 28), cc.TEXT_ALIGNMENT_LEFT);
        this.lbScore.setAnchorPoint(cc.p(1, 0));
        this.addChild(this.lbScore, 1000);
        this.lbScore.setPosition(cc.p(420, winSize.height - 30));


        /* Initialize our Web Worker. */
        this.physics = new Worker('./js/Box2dWebWorker.js');
        this.physics.postMessage({
            msg:'init',
            walls:tmx.getObjectGroup('walls').getObjects(),
            coins:tmx.getObjectGroup('coins').getObjects(),
            floors:initialFloors
//			portals: tmx.getObjectGroup('portals').getObjects()
        });

        /* Load the scenery. */
        this.background = cc.Sprite.create('./images/background.png');
//		this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.background.setPosition(new cc.Point(384.0, 640.0));
        this.addChild(this.background, 0);

        /* Load the ball. */
        this.ball = cc.Sprite.create('./images/ball_64.png');
//		this.ball.setAnchorPoint(new cc.Point(0.5, 0.5));
//		this.ball.setPosition(new cc.Point(384.0, 840.0));
        this.ball.j = [];
        /* Will hold the impulse force acting on the ball. */
        this.addChild(this.ball, 2);

        /* Load the coins. */
//		this.coins = tmx.getObjectGroup('coins').getObjects();
//		this.coins.sprites = [];
//		for (n = 0; n < this.coins.length; n = n + 1) {
//			this.coins.sprites.push(cc.Sprite.create('./images/tiles.png', new cc.Rect(32.0, 64.0, 32.0, 32.0)));
//			this.coins.sprites[n].setPosition(
//				new cc.Point(
//					this.coins[n].x + this.coins[n].width / 2.0,
//					this.coins[n].y + this.coins[n].height / 2.0
//				)
//			);
////			this.addChild(this.coins.sprites[n], 3);
//		}
//		this.coins.sprites.count = this.coins.sprites.length;

        /* Load the floors. */
        this.floors = initialFloors;
        this.floors.sprites = [];
        for (n = 0; n < this.floors.length; n = n + 1) {
            this.floors.sprites[n] = [];
            for (j = 0; j < this.floors[n].length; j++) {
                this.floors.sprites[n].push(cc.Sprite.create('./images/wood-background.png', new cc.Rect(0.0, 0.0, this.floors[n][j].width, this.floors[n][j].height)));
                this.floors.sprites[n][j].setPosition(
                    new cc.Point(
                        this.floors[n][j].x + this.floors[n][j].width / 2.0,
                        this.floors[n][j].y + this.floors[n][j].height / 2.0
                    )
                );
                this.addChild(this.floors.sprites[n][j], 3);
            }
        }
        ;

        _g.LayerStart.ball.j[0] = 0;
        _g.LayerStart.ball.j[1] = 0;


        window.addEventListener("devicemotion", function (event) {
            var ax = event.accelerationIncludingGravity.x;
            var ay = event.accelerationIncludingGravity.y;
            var az = event.accelerationIncludingGravity.z;
            _g.LayerStart.ball.j[0] = ax * 2
            _g.LayerStart.ball.j[1] = ay > 0 ? 0 : -ay * 2;
        }, true);

        /* Get our physics worker going. */

        this.physics.addEventListener('message', function (e) {
            if (e.data.ball) {
                if (e.data.ball.y > 1250) {
                    _g.LayerStart.onGameOver();
                }
                _g.LayerStart.ball.setPosition(new cc.Point(e.data.ball.x, e.data.ball.y));
                _g.LayerStart.ball.setRotation(e.data.ball.r / (Math.PI * 2.0) * 360.0);
            }
            if (e.data.floors) {
                for (n = 0; n < e.data.floors.length; n++) {
                    for (j = 0; j < e.data.floors[n].length; j++) {
                        _g.LayerStart.floors.sprites[n][j].setPosition(new cc.Point(e.data.floors[n][j].x, e.data.floors[n][j].y));
                    }
                }
                ;
            }
            if (e.data.score) {
                _g.LayerStart.lbScore.setString("Score: " + e.data.score);
                _g.score = e.data.score;
            }
            if (e.data.collision) {
                console.log(e.data.collision);
                // base volume on velocity
                var xx = e.data.collision.v / 80.0; //200.0;

                if (xx > 1.0) xx = 1.0;
                if (xx < 0.0) xx = 0.0;
                var s = Math.sin(0.5 * xx * Math.PI);
//                var s = xx;
//                s = s*s;
                var gain = s;
                _g.LayerStart.playCollisionSound(gain, xx, e.data.collision.x, e.data.collision.y);
            }

        });

//        cc.Director.getInstance().popToRootScene();

        /* Every frame, we will update the Web Worker with the current forces acting on our ball based on user input. */
        this.schedule(this.update);
        return true;
    },


    finishedLoading:function (bufferList) {
        // Create two sources and play them both together.
        var source1 = this.context.createBufferSource();
        var source2 = this.context.createBufferSource();
        source1.buffer = bufferList[0];
        source2.buffer = bufferList[1];

        source1.connect(this.context.destination);
        source2.connect(this.context.destination);
        source1.noteOn(0);
        source2.noteOn(0);
    },


//    loadPing:function (url) {
//        // Load asynchronously
//        var request = new XMLHttpRequest();
//        request.open("GET", url, true);
//        request.responseType = "arraybuffer";
//
//        request.onload = function () {
//            _g.LayerStart.pingBuffer = _g.LayerStart.context.createBuffer(request.response, true);
//        }
//
//        request.send();
//    },
//
//    loadImpulseResponse:function (url) {
//        // Load impulse response asynchronously
//        var request = new XMLHttpRequest();
//        request.open("GET", url, true);
//        request.responseType = "arraybuffer";
//
//        request.onload = function () {
//            _g.LayerStart.convolver.buffer = _g.LayerStart.context.createBuffer(request.response, false);
//        }
//
//        request.send();
//    },

    playCollisionSound:function(gain, xx, x, y) {
        console.log("CountContact is called.");
        var ping = this.context.createBufferSource();
        ping.buffer = this.bufferLoader.bufferList[0];
//        ping.connect(this.context.destination);
        if (ping) {
            console.log("gain = " + gain);
            var isQuiet = (gain < 0.01);
//            ping.buffer = pingBuffer; // isQuiet ? quietBuffer : pingBuffer;

            var filter = this.context.createBiquadFilter();
            var panner = this.context.createPanner();
            panner.panningModel = webkitAudioPannerNode.HRTF;

            // Create inputs to dry/wet mixers
            var dryGainNode = this.context.createGainNode();
            var wetGainNode = this.context.createGainNode();
            wetGainNode.gain.value = gain < 0.125 ? 0.15 : 0.1;
            wetGainNode.gain.value = 0.0;
            dryGainNode.gain.value = isQuiet? 0.0: gain;  //isQuiet ? 0.0 : gain;

            ping.connect(dryGainNode);
            filter.connect(panner);
            panner.connect(dryGainNode);
            dryGainNode.connect(this.context.destination);

            panner.connect(wetGainNode);
            wetGainNode.connect(this.convolver);

            // Randomize pitch
            var r = Math.random();
            var cents = 600.0 * (r - 0.5);
            var rate = Math.pow(2.0, cents / 1200.0);
            ping.playbackRate.value = rate;

            // Adjust filter
            filter.type = 0
            var value = 0.5 + 0.5 * xx;
            var noctaves = Math.log(22050.0 / 40.0) / Math.LN2;
            var v2 = Math.pow(2.0, noctaves * (value - 1.0));

            var sampleRate = 44100.0;
            var nyquist = sampleRate * 0.5;
            filter.frequency.value  = v2 * nyquist;
//            filter.resonance.value = 10.0 /*5.0*/;

            var azimuth = 0.5*Math.PI * (x - 200.0 /*250.0*/) / 150.0;
            if (azimuth < -0.5*Math.PI) azimuth = -0.5*Math.PI;
            if (azimuth > 0.5*Math.PI) azimuth = 0.5*Math.PI;

            var posX = 10.0 * Math.sin(azimuth);
            var posZ = 10.0 * Math.cos(azimuth);

            var elevation = -0.5*Math.PI * (y - 250.0) / 150.0;
            if (elevation < -0.5*Math.PI) elevation = -0.5*Math.PI;
            if (elevation > 0.5*Math.PI) elevation = 0.5*Math.PI;

            var scaleY = Math.sin(elevation);
            var scaleXZ = Math.cos(elevation);
            posX *= scaleXZ;
            posZ *= scaleXZ;
            var posY = scaleY * 10.0;

            panner.setPosition(posX, posY /*0*/, isQuiet ? +posZ : -posZ);

            ping.noteOn(0);
        }
    },

    onGameOver:function () {
        this.physics.terminate();
        var scene = cc.Scene.create();
        scene.addChild(new GameOverLayer());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    update:function () {
        this.physics.postMessage({
            msg:'ApplyImpulse',
            j:this.ball.j
        });
    }

});