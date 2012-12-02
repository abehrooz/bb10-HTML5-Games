var ccApplication = cc.Application.extend({
	ctor: function () {
		this._super();
		this.startScene = SceneStart;

		cc.COCOS2D_DEBUG = 0;	/* 0 = OFF, 1 = BASIC, 2 = FULL. */
		cc.initDebugSetting();

		/* Initialize our primary <canvas>. */
		cc.setup('ccCanvas', window.innerWidth, window.innerHeight);
		document.querySelector('#Cocos2dGameContainer').style.overflow = 'hidden';
		document.querySelector('#Cocos2dGameContainer').style.position = 'fixed';
		document.querySelector('#ccCanvas').style.position = 'fixed';

		/* Display the default scene during load. */
		cc.Loader.getInstance().onloading = function () {
			cc.LoaderScene.getInstance().draw();
		};

		/* Initiate application once loading is complete. */
		cc.Loader.getInstance().onload = function () {
			cc.AppController.shareAppController().didFinishLaunchingWithOptions();
		};

		/* Initiate preloading; at minimum, this REQUIRES an [] argument. */
		cc.Loader.getInstance().preload([
			{type: 'tmx', src: './tmx/0-0.xml'},
			{type: 'image', src: './images/tiles.png'}
		]);
	},

	applicationDidFinishLaunching: function () {
		var director = cc.Director.getInstance();
		director.setDisplayStats(true); /* Show FPS information? */
		director.runWithScene(new this.startScene());
		return true;
	}
});

/* Create our new application that we just defined. */
var ccMain = new ccApplication();