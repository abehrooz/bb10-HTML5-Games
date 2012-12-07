/*global importScripts, self, Box2D */

/* Bring in the Box2DWeb functionality. */
importScripts('./Box2D.js');
importScripts('./RailFactory.js');

self.init = function (objects) {
	var fixtureDef, bodyDef, object, n, j;

	/* Our world. */
	self.world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0.0, 17.8),	/* Gravity. */
		true										/* Allow sleep. */
	);
	
	self.world.scale = 32.0;
	self.remove = [];

    self.score = 0;
	

	/* Global properties. */
	fixtureDef				= new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.density		= 4.0;
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
		self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({});
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
	bodyDef.type			= Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x		= (objects.portals[0].x + objects.portals[0].width / 2.0) / self.world.scale;
	bodyDef.position.y		= -(objects.portals[0].y + objects.portals[0].height / 2.0) / self.world.scale;
	fixtureDef.shape		= new Box2D.Collision.Shapes.b2CircleShape(64.0 / 2.0 / self.world.scale);
	self.ball = self.world.CreateBody(bodyDef);
	self.ball.CreateFixture(fixtureDef).SetUserData({});
	self.ball.j = [];

//	/* Collision listener for coins, portals, etc. */
//	self.listener = new Box2D.Dynamics.b2ContactListener();
//	self.listener.BeginContact = function (contact) {
//		/* If there is a collision, find if one of the objects is a coin and, if so, remove that coin. */
//		if (contact.m_fixtureB.GetUserData().tagName === 'coin') {
//			self.remove.push(contact.m_fixtureB.GetBody());
//			self.postMessage({
//				msg: 'remove',
//				index: contact.m_fixtureB.GetUserData().index
//			});
//		} else if (contact.m_fixtureA.GetUserData().tagName === 'coin') {
//			self.remove.push(contact.m_fixtureA.GetBody());
//			self.postMessage({
//				msg: 'remove',
//				index: contact.m_fixtureA.GetUserData().index
//			});
//		}
//
//	};
//	self.listener.EndContact = function () {
//	};
//	self.world.SetContactListener(self.listener);

	setInterval(self.update, 0.0167);	/* Update the physics 60 times per second. */
	setInterval(self.cleanup, 0.0111);  /* Check for object removal 90 times per second. */
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
//                if (newX*self.world.scale<100){
//                    newX = 100/self.world.scale;
//                }else {
//                    var width = self.floors[n][j].GetFixtureList().GetShape().GetVertices()[2].x;
//                    var lastcornerX = (newX + width);
//                    if (768 - lastcornerX *self.world.scale< 100 ){
//                        newX += 768/self.world.scale - lastcornerX;
//                    }
//                }
            b2Transform.Initialize(new Box2D.Common.Math.b2Vec2( xShift + self.floors[n][j].GetPosition().x,
                ( newRow)? 0: self.floors[n][j].GetPosition().y - 0.23),
                Box2D.Common.Math.b2Mat22.FromAngle(0));
            self.floors[n][j].SetTransform(b2Transform);
            floors[n][j] = {
                x: self.floors[n][j].GetPosition().x * self.world.scale,
                y: -self.floors[n][j].GetPosition().y * self.world.scale,
                r: self.floors[n][j].GetAngle()};
        }
        if (newRow){
            self.score++;
        }
    }

    /* Process the physics for this tick. */
    self.world.Step(
        0.0167,	/* Frame rate. */
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
        floors: floors
    });


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
    }
});

self.random = new Alea(6578);
