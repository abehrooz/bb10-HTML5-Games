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
        var menuNormal = cc.Sprite.create(s_menu_buttons, cc.rect(0, 980, 440, 140));
        var settingsNormal = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));

        var resumePressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 840, 440, 140));
        var menuPressed = cc.Sprite.create(s_menu_buttons_pressed, cc.rect(0, 980, 440, 140));
        var settingsPressed = cc.Sprite.create(s_menu_buttons_settings, cc.rect(0, 5, 440, 140));

        var resumeItem = cc.MenuItemSprite.create(resumeNormal, resumePressed, this.onResumeCallback, this);
        var mainMenuItem = cc.MenuItemSprite.create(menuNormal, menuPressed, this.onMainMenuCallback, this);
        var settingsItem = cc.MenuItemSprite.create(settingsNormal, settingsPressed, this.onSettingsCallback, this);
        var menu = cc.Menu.create(resumeItem, mainMenuItem, settingsItem);
        menu.alignItemsVerticallyWithPadding(-12)
        menu.setPosition(cc.p(384, 540));
        this.addChild(menu, 10);
    },
    onResumeCallback:function () {
        console.log("onResumeCallback");
        _g.LayerStart.onResume();
        _g.LayerPause.setVisible(false);
    },
    onMainMenuCallback:function () {
        console.log("onMainMenuCallback");
        _g.LayerStart.onGameOver();
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,new MainMenuScene()));
    },
    onSettingsCallback:function () {
        console.log("onSettingsCallback");
    }
});