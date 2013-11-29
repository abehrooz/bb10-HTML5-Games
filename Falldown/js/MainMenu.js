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
        var highScoresNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 140, 440, 140));
        var gameSettingsNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 280, 440, 140));
        var helpNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 420, 440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));
        var newGamePressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 0, 440, 140));

        var highScoresPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 140, 440, 140));
        var gameSettingsPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 280, 440, 140));
        var helpPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 420, 440, 140));
        var settingsPressed = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));




        var newGameItem = cc.MenuItemSprite.create(newGameNormal, newGamePressed, this.onNewGameCallback, this);
        var highScoresItem = cc.MenuItemSprite.create(highScoresNormal, highScoresPressed, this.onHighScoreCallback, this);
        var gameSettingsItem = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsPressed, this.onGameSettinsCallback, this);
        var helpItem = cc.MenuItemSprite.create(helpNormal, helpPressed, this.onHelpCallback, this);
        var settingsItem = cc.MenuItemSprite.create(settingsNormal, settingsPressed, this.onSettingsCallback, this);
//
//
        var menu = cc.Menu.create(newGameItem, highScoresItem, gameSettingsItem, helpItem,settingsItem);
        menu.alignItemsVerticallyWithPadding(-15)
        menu.setPosition(cc.p(384, 540));

        this.addChild(menu, 10);

    },
    onNewGameCallback:function () {
        console.log("onPlayAgainCallback");
        var scene = cc.Scene.create();
        scene.addChild(new GameLayer(), 10, 10);
        scene.addChild(new PauseLayer(), 100, 100);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(0.4, scene));
    },
    onHighScoreCallback:function () {
        console.log("onHighScoreCallback");
    },
    onGameSettinsCallback:function () {
        console.log("onGameSettinsCallback");
    },
    onHelpCallback:function () {
        console.log("onHelpCallback");
        var scene = cc.Scene.create();
    },
    onSettingsCallback:function () {
        console.log("onSettingsCallback");
    }



});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new MainMenuLayer());
    }
});
