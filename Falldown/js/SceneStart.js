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
	newRailFlag:		true,   /* An [] of floor objects retrieved from the TMX file. */

	ctor: function () {
		var tmx, n;
        var nextRail = new RandomRail(325);

		/* Always call _super() first. */
		this._super();
		_g.LayerStart = this;



        /* Load our TMX-as-XML world. */
		tmx = cc.TMXTiledMap.create('./tmx/0-0.xml');

		/* Get our physics worker going. */
		this.physics = new Worker('./js/Box2dWebWorker.js');
		this.physics.addEventListener('message', function (e) {
			if (e.data.ball) {
				/* If ball data exists, update our position and rotation. */
				_g.LayerStart.ball.setPosition(new cc.Point(
					e.data.ball.x,
					e.data.ball.y
				));
				_g.LayerStart.ball.setRotation(e.data.ball.r / (Math.PI * 2.0) * 360.0);
			} else if (e.data.msg === 'remove') {
				/* If we need to remove sprites (i.e. ball ran into a coin), update our counter. */
				_g.LayerStart.removeChild(_g.LayerStart.coins.sprites[e.data.index]);
				_g.LayerStart.coins.sprites[e.data.index] = null;
				_g.LayerStart.coins.sprites.count = _g.LayerStart.coins.sprites.count - 1;

				if (_g.LayerStart.coins.sprites.count === 0) {
					_g.LayerStart.finish.runAction(cc.FadeTo.create(2.0, 255.0));
				}
			} else if (e.data.msg === 'removeFloors') {
				/* If we need to remove sprites (i.e. ball ran into a coin), update our counter. */
                for (var i = 0 ; i< e.data.n ; i++) {
                    _g.LayerStart.removeChild(_g.LayerStart.floors.sprites.pop());
                }
                _g.LayerStart.newRailFlag = true;

			} else {
				for (n=0; n<e.data.length; n++){
                    var y = e.data[n].y;
                    if (y >= 1350 && _g.LayerStart.newRailFlag){
                        console.log("Creating new rail");
                        var rail = nextRail(-150);
                        for (var j = 0; j < rail.length; j++) {
                            var floor = rail[j];
                            var sprite = cc.Sprite.create('./images/wood-background.png', new cc.Rect(0.0, 0.0, floor.width, floor.height));
                            sprite.setPosition(
                                new cc.Point(
                                    floor.x + floor.width / 2.0,
                                    floor.y + floor.height / 2.0
                                )
                            );
                            _g.LayerStart.addChild(sprite, 4);
                            _g.LayerStart.floors.sprites.unshift(sprite);
                        }
//                        _g.LayerStart.floors.sprites.count += rail.length;
                        _g.LayerStart.physics.postMessage({
                            msg: 'NewRail',
                            rail: rail
                        });
                        _g.LayerStart.newRailFlag = false;
                    }else {
                        _g.LayerStart.floors.sprites[n].setPosition(new cc.Point(
                            e.data[n].x,
                            y));
                        _g.LayerStart.floors.sprites[n].setRotation(e.data[n].r / (Math.PI * 2.0) * 360.0);
                    }
				}
			} 
			
		});


        var initialFloors = [];
        var rail;
        for (var i = -750; i <= 600; i += 150) {
            var rail = nextRail(i);
            for (var j = 0; j < rail.length; j++) {
                initialFloors.push(rail[j]);
            }
        };



		/* Initialize our Web Worker. */
		this.physics.postMessage({
			msg: 'init',
			walls: tmx.getObjectGroup('walls').getObjects(),
			coins: tmx.getObjectGroup('coins').getObjects(),
			floors: initialFloors,
			portals: tmx.getObjectGroup('portals').getObjects()
		});

		/* Load the scenery. */
//		this.background = cc.Sprite.create('./images/0-0.png');
//		this.background.setAnchorPoint(new cc.Point(0.0, 0.0));
//		this.background.setPosition(new cc.Point(0.0, 0.0));
//		this.addChild(this.background, 0);

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
			this.floors.sprites.push(cc.Sprite.create('./images/wood-background.png', new cc.Rect(0.0, 0.0, this.floors[n].width, this.floors[n].height)));
			this.floors.sprites[n].setPosition(
				new cc.Point(
					this.floors[n].x + this.floors[n].width / 2.0,
					this.floors[n].y + this.floors[n].height / 2.0
				)
			);
			this.addChild(this.floors.sprites[n], 3);
		}
//		this.floors.sprites.count = this.floors.sprites.length;

        this.newRailFlag = true;
		
		

		/* Load the finish portal. */
		this.finish = cc.Sprite.create('./images/tiles.png', new cc.Rect(32.0, 0.0, 32.0, 32.0));
		this.finish.setPosition(new cc.Point(
			tmx.getObjectGroup('portals').getObjects()[1].x + tmx.getObjectGroup('portals').getObjects()[1].width / 2.0,
			tmx.getObjectGroup('portals').getObjects()[1].y + tmx.getObjectGroup('portals').getObjects()[1].height / 2.0
		));
		this.finish.setOpacity(0.0);
		this.addChild(this.finish, 1);
		
		_g.LayerStart.ball.j[0] = 0;
		_g.LayerStart.ball.j[1] = 0;
		window.addEventListener("devicemotion", function(event) {

		var ax = event.accelerationIncludingGravity.x;
		var ay = event.accelerationIncludingGravity.y;
		var az = event.accelerationIncludingGravity.z;
//		alert(ax+"\n"+ay+"\n"+az);
		_g.LayerStart.ball.j[0] = ax/2;
		_g.LayerStart.ball.j[1] = ay>0 ? 0: -ay/4;
		
		}, true);

		/* Every frame, we will update the Web Worker with the current forces acting on our ball based on user input. */
		this.schedule(this.update);
		return true;
	},

	/* Send the impulse forces based on the current actions being taken. */
	update: function () {
		this.physics.postMessage({
			msg: 'ApplyImpulse',
			j: this.ball.j
		});
//		this.ball.j[1] = 0.0; /* Reset vertical impulse to 0 after each frame (otherwise ball will fly away.) */
	}

});

/* Our main Scene object that holds our Layer. */
var SceneStart = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new LayerStart());
    }
});