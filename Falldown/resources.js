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
var s_game_pause = dirImg + "game_pause_64.png";
var s_menu_buttons = dirImg + "menu_buttons.png";

//music
var s_game_bgMusic = dirMusic + "game_bg_AngryMod.mp3" ;
var s_menu_bgMusic = dirMusic + "menu_bg_FogOfPeace.mp3";

//effect
var s_game_ball_hit = dirMusic + "game_ball_hit.wav";
var s_game_ball_noise = dirMusic + "game_ball_noise.wav";
var s_game_pop = dirMusic + "pop.mp3";

//tmx
var s_tmx = dirTmx + "0-0.xml";


var g_resources = [
    //image
    {type:"image", src:s_game_ball},
    {type:"image", src:s_game_floors},
    {type:"image", src:s_game_bg},
    {type:"image", src:s_menu_buttons},

    //tmx
    {type:"tmx", src:s_tmx},

    //music
    {type:"bgm", src:s_game_bgMusic},
    {type:"bgm", src:s_menu_bgMusic},

    //effect
    {type:"effect", src:s_game_ball_hit},
    {type:"effect", src:s_game_ball_noise},
    {type:"effect", src:s_game_pop}

];
