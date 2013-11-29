/*global importScripts, self, Box2D */

/* Bring in the Box2DWeb functionality. */
importScripts('./Box2D.js');
importScripts('./RailFactory.js');

self.init = function (objects) {
	var fixtureDef, ballFixtureDef, bodyDef, object, n, j;

	/* Our world. */
	self.world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0.0, 18.6),	/* Gravity. */
		true										/* Allow sleep. */
	);
	
	self.world.scale = 32.0;
	self.remove = [];

    self.score = 0;
	

	/* Global properties. */
	fixtureDef				= new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.density		= 8.5;
	fixtureDef.friction		= 0.1;
	fixtureDef.restitution	= 0.1;
	bodyDef					= new Box2D.Dynamics.b2BodyDef();

	/* Generate our walls. */
	for (n = 0; n < objects.walls.length; n++) {
		object					= objects.walls[n];
		bodyDef.type			= Box2D.Dynamics.b2Body.b2_staticBody;
		bodyDef.position.x		= (object.x + object.width / 2.0) / self.world.scale;
		bodyDef.position.y		= -(object.y + object.height / 2.0) / self.world.scale;
		fixtureDef.shape		= new Box2D.Collision.Shapes.b2PolygonShape();
		fixtureDef.shape.SetAsBox(object.width / 2.0 / self.world.scale, object.height / 2.0 / self.world.scale);
		self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({
            tagName: 'wall'
        });
	}

	/* Add our floors. */
	var floors = [];
	for (n = 0; n < objects.floors.length; n++) {
        floors[n] = [];
        for (j = 0 ; j<objects.floors[n].length; j++ ){
            object					= objects.floors[n][j];
            bodyDef.type			= Box2D.Dynamics.b2Body.b2_staticBody;
            bodyDef.position.x		= (object.x + object.width / 2.0) / self.world.scale;
            bodyDef.position.y		= -(object.y + object.height / 2.0) / self.world.scale;
            fixtureDef.shape		= new Box2D.Collision.Shapes.b2PolygonShape();
            fixtureDef.shape.SetAsBox(object.width / 2.0 / self.world.scale, object.height / 2.0 / self.world.scale);
            object = self.world.CreateBody(bodyDef);
            object.CreateFixture(fixtureDef).SetUserData({
                tagName: 'floor',
                index: n
            });
            floors[n].push(object);
        }
    }
	self.floors = floors;


	/* Add a ball. */
    ballFixtureDef				= new Box2D.Dynamics.b2FixtureDef();
    ballFixtureDef.density		= 2.9;
    ballFixtureDef.friction		= 0.5;
    ballFixtureDef.restitution	= 0.4;
	bodyDef.type			= Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x		= 576 / self.world.scale;
	bodyDef.position.y		= -1100 / self.world.scale;
    ballFixtureDef.shape		= new Box2D.Collision.Shapes.b2CircleShape(64.0 / 2.0 / self.world.scale);
	self.ball = self.world.CreateBody(bodyDef);
	self.ball.CreateFixture(ballFixtureDef).SetUserData({});
	self.ball.j = [];
    self.ball.h = false;


    /* Collision listener for coins, portals, etc. */
//    self.collision = [];
//    self.listener = new Box2D.Dynamics.b2ContactListener();
//    self.listener.BeginContact = function (contact) {
//
//        if (contact.m_fixtureA.GetUserData().tagName === 'floor' || contact.m_fixtureB.GetUserData().tagName === 'floor'){
//            var body1 = contact.m_fixtureA.GetBody();
//            var body2 = contact.m_fixtureB.GetBody();
//
//            var v1 = body1.GetLinearVelocity().Length();
//            var v2 = body2.GetLinearVelocity().Length();
//            var x = v1 > v2 ? body1.GetPosition().x : body2.GetPosition().x;
//            var y = body1.GetPosition().y;
//
//            self.postMessage({
//                collision: {
//                    x: x * self.world.scale,
//                    y: -y * self.world.scale,
//                    v: v1 > v2 ? v1: v2
//                }
//            });
//
//        }
//
//    };
//    self.listener.EndContact = function () {
//        /* Keep track of how many collisions are currently in effect for jumping purposes. */
////        self.hero.contacts--;
//    };
//    self.world.SetContactListener(self.listener);

	setInterval(self.update, 0.0167);	/* Update the physics 60 times per second. */
	setInterval(self.cleanup, 0.0411);  /* Check for object removal 90 times per second. */
};

self.update = function () {
    var n, j;
    /* Apply the horizontal and vertical impulse forces to our ball. */
    self.ball.ApplyImpulse(
        new Box2D.Common.Math.b2Vec2(self.ball.j[0], self.ball.j[1]),
        self.ball.GetWorldCenter()
    );

    self.ball.SetLinearVelocity(
        new Box2D.Common.Math.b2Vec2(
            self.ball.GetLinearVelocity().x,
            self.ball.GetLinearVelocity().y
        )
    );

    var b2Transform = new Box2D.Common.Math.b2Transform();
    var floors = [];
    var newRow, newX, xShift,rXShift,lXShift, width, lastcornerX,leftWhole, rightWhole;

    function checkForRightSmallWhole() {
        for (j = 0; j < this.floors[n].length; j++) {
            newX = xShift + self.floors[n][j].GetPosition().x;
            width = self.floors[n][j].GetFixtureList().GetShape().GetVertices()[2].x;
            lastcornerX = (newX + width);
            if (768 / self.world.scale - lastcornerX > 0 && 768 / self.world.scale - lastcornerX < 120 / self.world.scale) {
                rXShift = xShift + 768 / self.world.scale - lastcornerX;
                rightWhole = true;
            }
        }
    }

    function checkForLeftSmallWhole() {
        for (j = 0; j < this.floors[n].length; j++) {
            newX = xShift + self.floors[n][j].GetPosition().x;
            if (newX > 0 && newX < 120 / self.world.scale) {
                lXShift = - self.floors[n][j].GetPosition().x;
                leftWhole = true;
            }
        }
    }

    for (n = 0; n < self.floors.length; n++) {
        floors[n] = [];
        newRow = - self.floors[n][0].GetPosition().y * self.world.scale > 1400;
        if (newRow) {
            xShift = (self.floors[n][0].GetPosition().x > 0 / self.world.scale) ?( -1000/ self.world.scale - self.floors[n][0].GetPosition().x ) : self.random() * 400 / self.world.scale;
            leftWhole = false;
            rightWhole = false;
            checkForRightSmallWhole.call(this);
            if (rightWhole){
                xShift = rXShift;
            }
            checkForLeftSmallWhole.call(this);
            if (rightWhole && leftWhole){
                xShift = ( -1000/ self.world.scale - self.floors[n][0].GetPosition().x );
            }else if (leftWhole){
                xShift = lXShift;
            }
        } else {
            xShift = 0;
        }


        for (j = 0 ; j<this.floors[n].length; j++ ){
            b2Transform.Initialize(new Box2D.Common.Math.b2Vec2( xShift + self.floors[n][j].GetPosition().x,
                ( newRow)? 0: self.floors[n][j].GetPosition().y - (self.world.pause ? 0 : 0.065)),
                Box2D.Common.Math.b2Mat22.FromAngle(0));
            self.floors[n][j].SetTransform(b2Transform);
            floors[n][j] = {
                x: self.floors[n][j].GetPosition().x * self.world.scale,
                y: -self.floors[n][j].GetPosition().y * self.world.scale,
                r: self.floors[n][j].GetAngle()};
        }
        if (newRow){
            self.score += 1;
        }
    }

    /* Process the physics for this tick. */
    self.world.Step( self.world.pause ? 0: 0.0167,	/* Frame rate. */
        20,		/* Velocity iterations. */
        20		/* Position iterations. */
    );


    /* Reset any forces. */
    self.world.ClearForces();
    self.ball.j = [0.0, 0.0];



    /* Communicate the new position and rotation of our ball back to the main application thread so that our ball sprite can be updated. */
    self.postMessage({
        ball: {
            x: self.ball.GetPosition().x * self.world.scale,
            y: -self.ball.GetPosition().y * self.world.scale,
            r: self.ball.GetAngle()
        },
        floors: floors,
        score: self.score
    });

    self.ball.h = false;
};

self.cleanup = function () {
    var n;

    /* Cycle through and remove all outstanding bodies. */
    for (n = 0; n < self.remove.length; n = n + 1) {
        self.world.DestroyBody(self.remove[n]);
        self.remove[n] = null;
    }
    self.remove = [];
};

self.addEventListener('message', function (e) {
    if (e.data.msg === 'ApplyImpulse') {
        self.ball.j = e.data.j;
    } else if (e.data.msg === 'init') {
        self.init(e.data);
    } else if (e.data.msg === 'pause'){
        self.world.pause = true;
    } else if (e.data.msg === 'resume'){
        self.world.pause = false;
//        self.world.Step(0);
    }
});

self.random = new Alea(6578);
