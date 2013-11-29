var GameOverLayer = cc.Layer.extend({
    _ship:null,
    _lbScore:0,
    ctor:function() {
        cc.associateWithNative( this, cc.Layer);
        this.init();
    },
    init:function () {
        this._super();

        /* Load the background. */
        this.background = cc.Sprite.create(s_menu_bg);
        this.background.setPosition(new cc.Point(384.0, 640.0));
        this.addChild(this.background, 0);

        /* Load the GameOver label. */
        this.background = cc.Sprite.create(s_menu_labels, cc.rect(0, 150, 570, 150));
        this.background.setPosition(new cc.Point(384.0, 1040.0));
        this.addChild(this.background, 0);

        var lbScore = cc.LabelTTF.create("Your Score: " + _g.score,"Arial Bold",48);
        lbScore.setColor(cc.c3b(250,179,0));
        lbScore.setPosition(cc.p(384,900));
        this.addChild(lbScore,10);

        var playAgainNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 700, 440, 140));
        var highScoresNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 140, 440, 140));
        var mainMenuNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 980, 440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));
        var playAgainPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 700, 440, 140));
        var highScoresPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 140, 440, 140));
        var mainMenuPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 980, 440, 140));
        var settingsPressed = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));
        var playAagainItem = cc.MenuItemSprite.create(playAgainNormal, playAgainPressed, this.onPlayAgainCallback, this);
        var highScoresItem = cc.MenuItemSprite.create(highScoresNormal, highScoresPressed, this.onHighScoreCallback, this);
        var mainMenuItem = cc.MenuItemSprite.create(mainMenuNormal, mainMenuPressed, this.onMainMenuCallback, this);
        var settingsItem = cc.MenuItemSprite.create(settingsNormal, settingsPressed, this.onSettingsCallback, this);
        var menu = cc.Menu.create(playAagainItem, highScoresItem, mainMenuItem, settingsItem);
        menu.alignItemsVerticallyWithPadding(-12)
        menu.setPosition(cc.p(384, 540));
        this.addChild(menu, 10);

    },
    onPlayAgainCallback:function () {
        console.log("onPlayAgainCallback");
        var scene = cc.Scene.create();
        scene.addChild(new GameLayer(), 10, 10);
        scene.addChild(new PauseLayer(), 100, 100);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.2, scene));
    },
    onHighScoreCallback:function () {
        console.log("onHighScoreCallback");
    },
    onMainMenuCallback:function () {
        console.log("onMainMenuCallback");
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.2,new MainMenuScene()));
    },
    onSettingsCallback:function () {
        console.log("onSettingsCallback");
    }

});

var GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new GameOverLayer());
    }
});



