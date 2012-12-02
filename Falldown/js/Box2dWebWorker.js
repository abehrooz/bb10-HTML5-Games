/*global importScripts, self, Box2D */

/* Bring in the Box2DWeb functionality. */
importScripts('./Box2D.js');

self.init = function (objects) {
	var fixtureDef, bodyDef, object, n;

	/* Our world. */
	self.world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0.0, 17.8),	/* Gravity. */
		true										/* Allow sleep. */
	);
	
	self.world.scale = 32.0;
	self.remove = [];
	

	/* Global properties. */
	fixtureDef				= new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.density		= 4.0;
	fixtureDef.friction		= 0.1;
	fixtureDef.restitution	= 0.1;
	bodyDef					= new Box2D.Dynamics.b2BodyDef();

	/* Generate our walls. */
	for (n = 0; n < objects.walls.length; n = n + 1) {
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
	for (n = 0; n < objects.floors.length; n = n + 1) {
		object					= objects.floors[n];
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
		floors[n] = object;
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

    function calculateNewY() {
        var newY = self.floors[n].GetPosition().y - 0.04;
        if ( - newY * self.world.scale > 1350){
            newY = 0;
        }
        return newY;
    }

    for (n = 0; n < self.floors.length; n++) {
        b2Transform.Initialize(new Box2D.Common.Math.b2Vec2(self.floors[n].GetPosition().x, calculateNewY()), Box2D.Common.Math.b2Mat22.FromAngle(0));
        self.floors[n].SetTransform(b2Transform);
        floors[n] = {
            x: self.floors[n].GetPosition().x * self.world.scale,
            y: -self.floors[n].GetPosition().y * self.world.scale,
            r: self.floors[n].GetAngle()};
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
    } else if (e.data.msg === 'NewRail') {
        self.newRail(e.data.rail);
    }
});

self.newRail = function(rail){
    var fixtureDef, bodyDef, object, n;
    fixtureDef				= new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density		= 4.0;
    fixtureDef.friction		= 0.1;
    fixtureDef.restitution	= 0.1;
    bodyDef					= new Box2D.Dynamics.b2BodyDef();
//    var floors = [];
    for (n = 0; n < rail.length; n = n + 1) {
        object					= rail[n];
        bodyDef.type			= Box2D.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x		= (object.x + object.width / 2.0) / self.world.scale;
        bodyDef.position.y		= -(object.y + object.height / 2.0) / self.world.scale;
        fixtureDef.shape		= new Box2D.Collision.Shapes.b2PolygonShape();
        fixtureDef.shape.SetAsBox(object.width / 2.0 / self.world.scale, object.height / 2.0 / self.world.scale);
        object = self.world.CreateBody(bodyDef);
        object.CreateFixture(fixtureDef).SetUserData({
            tagName: 'floor',
            index: self.floors.length + n
        });
//        floors[n] = object;
        self.floors.unshift(object);
    }

    // removing the floors that go out of the screen.
    var outOfBoundY= self.floors[self.floors.length - 1].GetPosition().y;
    var currentFloorY = outOfBoundY;
    var numberOfFloors = 0;
    while(Math.abs(currentFloorY - outOfBoundY)<0.1){
        currentFloorY = self.floors[self.floors.length - 2 - numberOfFloors++].GetPosition().y;
    };
    for(var i = 0; i< numberOfFloors ; i++){
        self.remove.push(self.floors.pop());
    }
    self.postMessage({
        msg: 'removeFloors',
        n:numberOfFloors
    });


};
