//github test

import Ground from './Ground.js';
import dino from './dino.js';
import obsController from './obsController.js';
import score from './Score.js';

const canvas= document.getElementById("game");
const cntxt= canvas.getContext("2d");   //The context provides methods,properties that help to draw/manipulate graphics on the canvas, like shapes, images.

const gameSpeed_initial= 0.75; //later goes on to be 1
const gameSpeed_incremental= 0.00001; //work on this later

const GAME_WIDTH= 800;
const GAME_HEIGHT= 200;

const dinoWidth= 88/1.5;            //scaling by 1.5 so as it doesnt look absurd in the game world
const dinoHeight= 94/1.5;
const maxJumpHeight= GAME_HEIGHT;
const minJumpHeight= 150;

const desertWidth= 2400;    //coming here after dino was finished
const desertHeight= 24;
const desert_cactus_speed= 0.5;

const obstacles_config = [
    {width: 48/1.5, height: 100/1.5, image: "sources/cactus_1.png"},
    {width: 98/1.5, height: 100/1.5, image: "sources/cactus_2.png"},
    {width: 68/1.5, height: 100/1.5, image: "sources/cactus_3.png"}
];

let scaleRatio= null;
let PrevTime= null;
let gameSpeed= gameSpeed_initial;
let GAMEOVER= false;
let eventListenerForRestartAdded= false;
let waitingToStart= true;

//Game Objects
let daino= null; //used in game objects, daino is the object everything is about
let ground= null;
let obsMaker= null;
let GameScore= null;

function createSprite(){
    const dinoWidth_Ingame = dinoWidth * scaleRatio;
    const dinoHeight_Ingame = dinoHeight * scaleRatio;
    const maxJumpHeight_Ingame= maxJumpHeight * scaleRatio;
    const minJumpHeight_Ingame= minJumpHeight * scaleRatio;

    const desertWidth_Ingame= desertWidth *scaleRatio;
    const desertHeight_Ingame= desertHeight* scaleRatio;

    daino= new dino(cntxt, dinoHeight_Ingame, dinoWidth_Ingame, maxJumpHeight_Ingame, minJumpHeight_Ingame, scaleRatio);
    ground= new Ground(cntxt, desertWidth_Ingame, desertHeight_Ingame, desert_cactus_speed, scaleRatio);

    const obsImages = obstacles_config.map((obstacle) =>{
        const image = new Image();
        image.src= obstacle.image;
        return {
            image: image,
            width: obstacle.width* scaleRatio,
            height: obstacle.height* scaleRatio,
        };
    });
    obsMaker= new obsController(cntxt, obsImages, scaleRatio, desert_cactus_speed);     //the game object made from obsController class
    GameScore= new score(cntxt, scaleRatio);
}

function setScreen(){
    scaleRatio= getScaleRatio();
    //come here later after calculating scalable dimensns
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio; 
    createSprite();     //forgot to add this haha
}
setScreen();
// console.log(scaleRatio);

window.addEventListener('resize', setScreen);
    if(screen.orientation){
    screen.orientation.addEventListener("change", setScreen);
    }

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function clearScreen(){
    cntxt.fillStyle= "white";
    cntxt.fillRect(0,0,canvas.width, canvas.height); //create a rect on the canvas dimensns and fill it all white
}

function showGameOver(){
    const fontsize= 70 * scaleRatio;
    cntxt.font = `${fontsize}px Verdana`; //backticks for template Literals
    cntxt.fillStyle= 'grey';
    const x= canvas.width / 4.5;
    const y= canvas.height / 2;
    cntxt.fillText("GAME OVER :/",x ,y);
}
function showStartText(){
    const fontsize= 40*scaleRatio ;
    cntxt.font = `${fontsize}px Comic Sans MS`;
    cntxt.fillStyle='grey';
    const x=canvas.width/14;
    const y=canvas.height/2;
    cntxt.fillText('Tap Screen or Press Space to Start',x, y);
}

function updateGameSpeed(FrameDelta){
    gameSpeed += FrameDelta * gameSpeed_incremental;
}

function setupGameRestart(){
    if(!eventListenerForRestartAdded){
        eventListenerForRestartAdded= true;

        setTimeout(()=>{        //setTimeout 500 ms so that when one game ends, another starts but not immediately
        window.addEventListener("keyup", reset, {once : true});
        window.addEventListener("touchstart", reset, {once : true});
        }, 500
        );
    }
}
function reset(){
    eventListenerForRestartAdded= false;
    GAMEOVER= false;
    waitingToStart= false;

    ground.reset();
    obsMaker.reset();
    GameScore.reset();
    gameSpeed= gameSpeed_initial;
}

function GameLoop(currentTime){
    // console.log(gameSpeed);

    if(PrevTime === null){
        PrevTime= currentTime;
        requestAnimationFrame(GameLoop);
        return; 
    }
    const FrameDelta= currentTime- PrevTime;
    PrevTime= currentTime;

    clearScreen();

    if(!GAMEOVER && !waitingToStart){  //'if' added in the later part of the program
    //Update game objs
    GameScore.update(FrameDelta);
    ground.update(gameSpeed, FrameDelta); //design gameSpeed now, & create an update function in groundjs
    obsMaker.update(gameSpeed, FrameDelta);
    daino.update(gameSpeed, FrameDelta);

    updateGameSpeed(FrameDelta);
    }

    if(!GAMEOVER && obsMaker.collideWith(daino)){
        GAMEOVER= true;
        setupGameRestart();
        GameScore.setHighScore();
    }
    //Draw game objects
    ground.draw();
    obsMaker.draw();
    daino.draw();
    GameScore.draw();

    if(GAMEOVER){       //endgame materials
        showGameOver();
    }
    if(waitingToStart){
        showStartText();
    }

    requestAnimationFrame(GameLoop);
}
requestAnimationFrame(GameLoop);

window.addEventListener("keyup", reset, {once : true});
window.addEventListener("touchstart", reset, {once : true});

//git Test comment