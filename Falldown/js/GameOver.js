var GameOverLayer = cc.Layer.extend({
    _ship:null,
    _lbScore:0,
    ctor:function() {
        // needed for JS-Bindings compatibility
        cc.associateWithNative( this, cc.Layer);
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
        this.background = cc.Sprite.create(s_menu_labels, cc.rect(0, 150, 570, 150));
        this.background.setPosition(new cc.Point(384.0, 1040.0));
        this.addChild(this.background, 0);


        var lbScore = cc.LabelTTF.create("Your Score: "+_g.score,"Arial Bold",48);
        lbScore.setPosition(cc.p(384,875));
        lbScore.setColor(cc.c3b(250,179,0));
        this.addChild(lbScore,10);

        var playAgainNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 700, 440, 140));
        playAgainNormal.setContentSize(new cc.size(440, 140));
        var highScoresNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 140, 440, 140));
        highScoresNormal.setContentSize(new cc.size(440, 140));
        var menuNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 980, 440, 140));
        menuNormal.setContentSize(new cc.size(440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 0, 440, 140));
        settingsNormal.setContentSize(new cc.size(440, 140));


        playAgainNormal.setPosition(384, 700);
        highScoresNormal.setPosition(384, 575);
        menuNormal.setPosition(384, 450);
        settingsNormal.setPosition(384, 329);

        this.addChild(playAgainNormal, 1);
        this.addChild(highScoresNormal, 1);
        this.addChild(menuNormal, 1);
        this.addChild(settingsNormal, 1);

        function spriteContainsPoint(sprite, touch) {
            var x = touch.pageX;
            var y = 1280 - touch.pageY;
            var maxX = sprite.getPosition().x + sprite.getContentSize().width / 2;
            var minX = sprite.getPosition().x - sprite.getContentSize().width / 2;
            var maxY = sprite.getPosition().y + sprite.getContentSize().height / 2;
            var minY = sprite.getPosition().y - sprite.getContentSize().height / 2;
//            console.log(x,",",y,",", minX,",", maxX,",",minY, ",", maxX );
            return maxX >= x && x >= minX &&
                maxY >= y && y >= minY;
        }

        window.document.addEventListener('touchstart', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
//                console.log(touch.pageY);
                if (spriteContainsPoint(playAgainNormal,touch)) {
//                    console.log("new game");
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    var scene = cc.Scene.create();
                    scene.addChild(new GameLayer(), 10, 10);
                    scene.addChild(new PauseLayer(), 100, 100);
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.4, scene));
                } else if (spriteContainsPoint(menuNormal,touch)) {
//                    console.log("going back to main menu");
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,new MainMenuScene()));
                }
            }
        }, false);

    }
});

var GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new GameOverLayer());
    }
});
