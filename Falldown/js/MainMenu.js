var TAG_MENU = 77771;
var MainMenuLayer = cc.Layer.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.Layer );
        this.init();
    },
    init:function () {
        this._super();
        this._isTouchEnabled = true;


        /* Load the scenery. */
        this.background = cc.Sprite.create(s_menu_bg);
        this.background.setPosition(new cc.Point(384.0, 640.0));
        this.addChild(this.background, 0);

        /* Load the scenery. */
        this.background = cc.Sprite.create(s_menu_logo);
        this.background.setPosition(new cc.Point(384.0, 1040.0));
        this.addChild(this.background, 0);

        var newGameNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 0, 440, 140));
        newGameNormal.setContentSize(new cc.size(440, 140));
        var highScoresNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 140, 440, 140));
        highScoresNormal.setContentSize(new cc.size(440, 140));
        var gameSettingsNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 280, 440, 140));
        gameSettingsNormal.setContentSize(new cc.size(440, 140));
        var helpNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 420, 440, 140));
        helpNormal.setContentSize(new cc.size(440, 140));
        var aboutNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 560, 440, 140));
        aboutNormal.setContentSize(new cc.size(440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 0, 440, 140));
        settingsNormal.setContentSize(new cc.size(440, 140));

        newGameNormal.setPosition(384, 800);
        highScoresNormal.setPosition(384, 675);
        gameSettingsNormal.setPosition(384, 550);
        helpNormal.setPosition(384, 425);
//        aboutNormal.setPosition(384, 300);
        settingsNormal.setPosition(384, 304);

        this.addChild(newGameNormal, 1);
        this.addChild(highScoresNormal, 1);
        this.addChild(gameSettingsNormal, 1);
        this.addChild(helpNormal, 1);
//        this.addChild(aboutNormal, 1);
        this.addChild(settingsNormal, 1);



        /*The usage of freewill is a workaround to solve the initial black screen issue!! */
		/* Load freewill. */
		this.freewill = new Freewill({
			container: document.querySelector('#freewill')
		});

		/* Add a Joystick to control movement. */
		this.freewill.move = this.freewill.addJoystick({
			imageBase: s_game_ball,						/* Irrelevant since we never see the Joystick. */
			imagePad: s_game_ball,						/* Irrelevant since we never see the Joystick. */
			fixed: true,														/* Joystick won't move. */
			pos: [0.0, 0.0],													/* Irrelevant since we never see the Joystick. */
			trigger: [0.0, 0.0, window.innerWidth / 2.0, window.innerHeight],	/* The touch area that triggers this Joystick will be the left half of the screen. */
			opacLow: 0.0,														/* Lowest opacity is 0; invisible. */
			opacHigh: 0.0														/* Highest opacity is 0; invisible. */
		});

        function spriteContainsPoint(sprite, touch) {
            var x = touch.pageX;
            var y = 1280 - touch.pageY;
            var maxX = sprite.getPosition().x + sprite.getContentSize().width / 2;
            var minX = sprite.getPosition().x - sprite.getContentSize().width / 2;
            var maxY = sprite.getPosition().y + sprite.getContentSize().height / 2;
            var minY = sprite.getPosition().y - sprite.getContentSize().height / 2;
            console.log(x,",",y,",", minX,",", maxX,",",minY, ",", maxX );
            return maxX >= x && x >= minX &&
                maxY >= y && y >= minY;
        }

        window.document.addEventListener('touchstart', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                console.log(touch.pageY);
                if (spriteContainsPoint(newGameNormal,touch)) {
                    console.log("new game");
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    var scene = cc.Scene.create();
                    scene.addChild(new GameLayer());
//                    scene.addChild(GameControlMenu.create());
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.4, scene));
                } else if (spriteContainsPoint(gameSettingsNormal,touch)) {
                    console.log("game settings");
                } else if (spriteContainsPoint(aboutNormal,touch)) {
                    console.log("about");
                }
            }
        }, false);



        window.document.addEventListener('touchend', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
//                menu.onTouchEnded(touch);
//                console.log(menu._state);
            }
        }, false);

//        window.document.addEventListener('touchmove', function (){
//            if (event.targetTouches.length == 1) {
//                var touch = event.targetTouches[0];
//                menu.onTouchMoved(touch);
//            }
//        }, false);

        window.document.addEventListener('touchcancel', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
//                menu.onTouchCancelled(touch);
//                console.log(menu._state);
            }
        }, false);

    }

});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new MainMenuLayer());
    }
});
