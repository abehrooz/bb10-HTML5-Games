/*global cc, Worker */

/* Global namespace for communicating with the Web Worker. */
var _g = {
	LayerStart: null
};
		
var LayerStart = cc.Layer.extend({
	physics:	null,	/* Our physics Web Worker. */
	background:	null,	/* A cc.Sprite with our background image. */
	ball:		null,	/* A cc.Sprite with our ball image and properties. */
	floors:		null,   /* An [] of floor objects retrieved from the TMX file. */
	/* An [] of floor objects retrieved from the TMX file. */

	ctor: function () {
		var tmx, n, j;
        var nextRail = new RandomRail(5887);

		/* Always call _super() first. */
		this._super();
		_g.LayerStart = this;



        /* Load our TMX-as-XML world. */
		tmx = cc.TMXTiledMap.create('./tmx/0-0.xml');

        var initialFloors = [];
        for (var i = -1000; i <= 250; i += 200) {
            initialFloors.push(nextRail(i));
        };


		/* Initialize our Web Worker. */
        this.physics = new Worker('./js/Box2dWebWorker.js');
		this.physics.postMessage({
			msg: 'init',
			walls: tmx.getObjectGroup('walls').getObjects(),
			coins: tmx.getObjectGroup('coins').getObjects(),
			floors: initialFloors,
			portals: tmx.getObjectGroup('portals').getObjects()
		});

		/* Load the scenery. */
		this.background = cc.Sprite.create('./images/background.png');
		this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
		this.background.setPosition(new cc.Point(384.0, 640.0));
		this.addChild(this.background, 0);

		/* Load the ball. */
		this.ball = cc.Sprite.create('./images/ball_64.png');
//		this.ball.setAnchorPoint(new cc.Point(0.5, 0.5));
		this.ball.setPosition(new cc.Point(0.0, 0.0));
		this.ball.j = []; /* Will hold the impulse force acting on the ball. */
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
            for (j = 0 ; j<this.floors[n].length; j++ ){
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

		_g.LayerStart.ball.j[0] = 0;
		_g.LayerStart.ball.j[1] = 0;


        window.addEventListener("devicemotion", function(event) {
        var ax = event.accelerationIncludingGravity.x;
		var ay = event.accelerationIncludingGravity.y;
		var az = event.accelerationIncludingGravity.z;
		_g.LayerStart.ball.j[0] = ax;
		_g.LayerStart.ball.j[1] = ay>0 ? 0: -ay/2;
		}, true);

        /* Get our physics worker going. */

        this.physics.addEventListener('message', function (e) {
            if (e.data.ball) {
                _g.LayerStart.ball.setPosition(new cc.Point(e.data.ball.x,e.data.ball.y));
                _g.LayerStart.ball.setRotation(e.data.ball.r / (Math.PI * 2.0) * 360.0);
            };
            if (e.data.floors){
                for (n=0; n<e.data.floors.length; n++){
                    for (j = 0 ; j< e.data.floors[n].length; j++ ){
                        _g.LayerStart.floors.sprites[n][j].setPosition(new cc.Point(e.data.floors[n][j].x,e.data.floors[n][j].y));
                    }
                };
            };
        });

		/* Every frame, we will update the Web Worker with the current forces acting on our ball based on user input. */
		this.schedule(this.update);
		return true;
	},

	update: function () {
		this.physics.postMessage({
			msg: 'ApplyImpulse',
			j: this.ball.j
		});
	}

});

/* Our main Scene object that holds our Layer. */
var SceneStart = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new LayerStart());
    }
});