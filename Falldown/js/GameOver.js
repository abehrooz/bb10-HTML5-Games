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

        var lbScore = cc.LabelTTF.create("Your Score: "+_g.score,"Arial Bold",48);
        lbScore.setPosition(cc.p(384,1050));
        lbScore.setColor(cc.c3b(250,179,0));
        this.addChild(lbScore,10);

        var replayNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 366, 366, 122));
        replayNormal.setContentSize(new cc.size(366, 122));
        var menuNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 488, 366, 122));
        menuNormal.setContentSize(new cc.size(366, 122));
        var helpNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 610, 366, 122));
        helpNormal.setContentSize(new cc.size(366, 122));

        replayNormal.setPosition(384, 850);
        menuNormal.setPosition(384, 650);
        helpNormal.setPosition(384, 450);

        this.addChild(replayNormal, 1);
        this.addChild(menuNormal, 1);
        this.addChild(helpNormal, 1);

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
                if (spriteContainsPoint(replayNormal,touch)) {
                    console.log("new game");
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    var scene = cc.Scene.create();
                    scene.addChild(new GameLayer());
//                    scene.addChild(GameControlMenu.create());
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
                } else if (spriteContainsPoint(menuNormal,touch)) {
                    console.log("going back to main menu");
                    window.document.removeEventListener('touchstart', arguments.callee, false);
                    var scene = cc.Scene.create();
                    scene.addChild(new MainMenuLayer());
                    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
                } else if (spriteContainsPoint(helpNormal,touch)) {
                    console.log("about");
                }
            }
        }, false);

    }
});
