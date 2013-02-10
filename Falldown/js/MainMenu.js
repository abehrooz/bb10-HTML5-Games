var MainMenuLayer = cc.Layer.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.Layer );
        this.init();
    },
    init:function () {
        this._super();
        this._isTouchEnabled = true;


        /* Load the Background. */
        this.background = cc.Sprite.create(s_menu_bg);
        this.background.setPosition(new cc.Point(384.0, 640.0));
        this.addChild(this.background, 0);

        /* Load the Game Logo. */
        this.background = cc.Sprite.create(s_menu_labels, cc.rect(0, 0, 570, 150));
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
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 0, 440, 140));
        settingsNormal.setContentSize(new cc.size(440, 140));

        newGameNormal.setPosition(384, 800);
        highScoresNormal.setPosition(384, 675);
        gameSettingsNormal.setPosition(384, 550);
        helpNormal.setPosition(384, 425);
        settingsNormal.setPosition(384, 304);

        this.addChild(newGameNormal, 10, 1);
        this.addChild(highScoresNormal, 10, 2);
        this.addChild(gameSettingsNormal, 10, 3);
        this.addChild(helpNormal, 10, 4);
        this.addChild(settingsNormal, 10, 5);

        var newGamePressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 0, 440, 140));
        newGamePressed.setContentSize(new cc.size(440, 140));
        var highScoresPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 140, 440, 140));
        highScoresPressed.setContentSize(new cc.size(440, 140));
        var gameSettingsPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 280, 440, 140));
        gameSettingsPressed.setContentSize(new cc.size(440, 140));
        var helpPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 420, 440, 140));
        helpPressed.setContentSize(new cc.size(440, 140));

        newGamePressed.setPosition(384, 800);
        highScoresPressed.setPosition(384, 675);
        gameSettingsPressed.setPosition(384, 550);
        helpPressed.setPosition(384, 425);
//        settingsPressed.setPosition(384, 304);

        this.addChild(newGamePressed, 1);
        this.addChild(highScoresPressed, 1);
        this.addChild(gameSettingsPressed, 1);
        this.addChild(helpPressed, 1);
//        this.addChild(settingsPressed, 1);




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

        var context = this;
        context.pressedButtonTag = 0;

        function spriteContainsPoint(tag, touch) {
            var sprite = context.getChildByTag(tag);
            var x = touch.pageX;
            var y = 1280 - touch.pageY;
            var maxX = sprite.getPosition().x + sprite.getContentSize().width / 2;
            var minX = sprite.getPosition().x - sprite.getContentSize().width / 2;
            var maxY = sprite.getPosition().y + sprite.getContentSize().height / 2;
            var minY = sprite.getPosition().y - sprite.getContentSize().height / 2;
            return maxX >= x && x >= minX &&
                maxY >= y && y >= minY;
        }

        window.document.addEventListener('touchstart',  function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                if (spriteContainsPoint(1,touch) && context.pressedButtonTag == 0) {
                    newGameNormal.setVisible(false);
                    context.pressedButtonTag = 1;
                    console.log("new game start");
                }
            }
        }, false);
        window.document.addEventListener('touchend', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                if (context.pressedButtonTag != 0 && spriteContainsPoint(1,touch)) {
                    newGameNormal.setVisible(true);
                    context.pressedButtonTag = 0;
                    console.log("new game end");
                    var scene = cc.Scene.create();
                    scene.addChild(new GameLayer(), 10, 10);
                    scene.addChild(new PauseLayer(), 100, 100);
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.4, scene));
                }

            }
        }, false);

        window.document.addEventListener('touchmove', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                if (context.pressedButtonTag != 0 && !spriteContainsPoint(context.pressedButtonTag ,touch)) {
                    newGameNormal.setVisible(true);
                    context.pressedButtonTag = 0;
                    console.log("pressed button was released");
                }

            }
        }, false);

        window.document.addEventListener('touchcancel', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
//                menu.onTouchCancelled(touch);
//                console.log(menu._state);
            }
        }, false);

    },

//    onTouchStart : function (touch){
//        if (this.spriteContainsPoint(this.getChildByTag(1),touch)) {
//            this.getChildByTag(1).setVisible(false);
//            console.log("new game");
//            window.document.removeEventListener('touchstart', arguments.callee, false);
//            var scene = cc.Scene.create();
//            scene.addChild(new GameLayer(), 10, 10);
//            scene.addChild(new PauseLayer(), 100, 100);
//            cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.4, scene));
//        }
//    },

    onTouchEnd : function (touch){
//        if (!this.pressedButtonTag) return;
//        if (this.spriteContainsPoint(this.getChildByTag(this.pressedButtonTag),touch)) {
//            this.getChildByTag(this.pressedButtonTag).setVisible(true);
//            this.pressedButtonTag = 0;
//
//        }
    }

//    spriteContainsPoint : function(sprite, touch) {
//        var x = touch.pageX;
//        var y = 1280 - touch.pageY;
//        var maxX = sprite.getPosition().x + sprite.getContentSize().width / 2;
//        var minX = sprite.getPosition().x - sprite.getContentSize().width / 2;
//        var maxY = sprite.getPosition().y + sprite.getContentSize().height / 2;
//        var minY = sprite.getPosition().y - sprite.getContentSize().height / 2;
//        return maxX >= x && x >= minX &&
//            maxY >= y && y >= minY;
//    }

});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new MainMenuLayer());
    }
});
