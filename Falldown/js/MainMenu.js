var TAG_MENU = 77771;
var MainMenuLayer = cc.Layer.extend({
    ctor:function() {
        cc.associateWithNative( this, cc.Layer );
        this.init();
    },
    init:function () {
        this._super();
        this._isTouchEnabled = true;
        var newGameNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 0, 366, 122));
        newGameNormal.setContentSize(new cc.size(366, 122));
        var gameSettingsNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 122, 366, 122));
        gameSettingsNormal.setContentSize(new cc.size(366, 122));
        var aboutNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 244, 366, 122));
        aboutNormal.setContentSize(new cc.size(366, 122));

        newGameNormal.setPosition(384, 850);
        gameSettingsNormal.setPosition(384, 650);
        aboutNormal.setPosition(384, 450);

        this.addChild(newGameNormal, 1);
        this.addChild(gameSettingsNormal, 1);
        this.addChild(aboutNormal, 1);



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
