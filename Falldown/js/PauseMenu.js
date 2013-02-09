var PauseLayer = cc.Layer.extend({
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
        _g.LayerPause = this;
        this._visible = false;

        this.background = cc.Sprite.create(s_menu_bg, cc.rect(110, 140, 500, 740));
        this.background.setPosition(new cc.Point(384.0, 580.0));
        this.background.setOpacity(200);
        this.addChild(this.background, 0);

        this.background = cc.Sprite.create(s_menu_labels, cc.rect(0, 300, 570, 150));
        this.background.setPosition(new cc.Point(384.0, 840.0));
        this.addChild(this.background, 0);


        var resumeNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 840, 440, 140));
        resumeNormal.setContentSize(new cc.size(440, 140));
        var highScoresNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 140, 440, 140));
        highScoresNormal.setContentSize(new cc.size(440, 140));
        var menuNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 980, 440, 140));
        menuNormal.setContentSize(new cc.size(440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 0, 440, 140));
        settingsNormal.setContentSize(new cc.size(440, 140));


        resumeNormal.setPosition(384, 700);
        highScoresNormal.setPosition(384, 575);
        menuNormal.setPosition(384, 450);
        settingsNormal.setPosition(384, 329);

        this.addChild(resumeNormal, 1);
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
            return maxX >= x && x >= minX &&
                maxY >= y && y >= minY;
        }

        window.document.addEventListener('touchstart', function (){
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                if (spriteContainsPoint(resumeNormal,touch)) {
//                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    _g.LayerStart.onResume();
                    _g.LayerPause.setVisible(false);
                } else if (spriteContainsPoint(menuNormal,touch)) {
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    _g.LayerStart.onGameOver();
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,new MainMenuScene()));
                }
            }
        }, false);

    }
});