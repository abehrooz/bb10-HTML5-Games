var dirImg = "res/images/";
var dirMusic = "res/music/";
var dirTmx = "res/tmx/";
if( cc.config.deviceType == 'browser') {
    dirImg = "res/images/";
    dirMusic = "res/music/";
    dirTmx = "res/tmx/";
}

//image
var s_game_bg = dirImg + "game_bg.png";
var s_game_floors = dirImg + "game_floor.png";
var s_game_ball = dirImg + "game_ball.png";
var s_menu_bg = dirImg + "menu_bg.png";
var s_menu_labels = dirImg + "menu_labels.png";
var s_menu_buttons = dirImg + "menu_buttons.png";
var s_menu_buttons_pressed = dirImg + "menu_buttons_pressed.png";
var s_menu_buttons_settings = dirImg + "menu_buttons_settings.png";

//effect
var s_game_ball_hit = dirMusic + "game_ball_hit.wav";
var s_game_ball_noise = dirMusic + "game_ball_noise.wav";
var s_game_pop = dirMusic + "pop.mp3";

//tmx
var s_tmx = dirTmx + "0-0.xml";



var g_ressources = [
    {type:"image", src:s_game_ball},
    {type:"image", src:s_game_floors},
    {type:"image", src:s_game_bg},
    {type:"image", src:s_menu_bg},
    {type:"image", src:s_menu_buttons},
    {type:"image", src:s_menu_buttons_pressed},
    {type:"image", src:s_menu_buttons_settings},
    {type:"image", src:s_menu_labels},

    //tmx
    {type:"tmx", src:s_tmx},


    //effect
    {type:"sound", src:s_game_ball_hit},
    {type:"sound", src:s_game_ball_noise},
    {type:"sound", src:s_game_pop}

];
