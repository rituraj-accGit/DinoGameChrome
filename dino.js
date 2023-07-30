export default class dino{
    WALK_ANIMATION_TIMER= 200;
    WalkAnimationTimer= this.WALK_ANIMATION_TIMER;
    dinoRunImages= [];

    jumpPressed= false;
    jumpOngoing= false;
    falling= false;
    JUMP_Speed= 0.6;        //best suited numbers for the program
    GRAVITY= 0.4;
    
    constructor(cntxt, width, height, maxJumpHeight, minJumpHeight, scaleRatio){
        this.cntxt= cntxt;
        this.canvas= cntxt.canvas;
        this.width= width;
        this.height= height;
        this.maxJumpHeight = maxJumpHeight;
        this.minJumpHeight = minJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x= 10*scaleRatio;
        this.y= this.canvas.height - this.height - 10*scaleRatio; //10 is not a discrete(fixed actually) number, can be varied
        this.yBase= this.y;     //y will be changing(e.g. when jumps) so we want the standStill pos^n.

        this.standingDino= new Image();
        this.standingDino.src= "sources/standing_still.png";
        this.image= this.standingDino;

        const dinorunning1= new Image();
        dinorunning1.src="sources/dino_run1.png";
        const dinorunning2= new Image();
        dinorunning2.src="sources/dino_run2.png";

        this.dinoRunImages.push(dinorunning1);
        this.dinoRunImages.push(dinorunning2);

        //keyborad event listeners: first remove tjose existing then add
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
        
        //touch listeners
        window.removeEventListener("touchstart", this.touchstart);
        window.removeEventListener("touchend", this.touchend);
        window.addEventListener("touchstart", this.touchstart);
        window.addEventListener("touchend", this.touchend);
    }

    touchstart = ()=> {
        this.jumpPressed= true;
    }
    touchend = ()=> {
        this.jumpPressed= false;
    }

    keydown= (event)=>{
        if(event.code ==="Space"){
            this.jumpPressed= true;
        }
    }
    keyup= (event)=>{
        if(event.code ==="Space"){
            this.jumpPressed= false;
        }
    }

    jump(FrameDelta){
        if(this.jumpPressed){
            this.jumpOngoing= true;
        }

        if(this.jumpOngoing && !this.falling){
            if  (this.y > this.canvas.height - this.minJumpHeight || 
                (this.y > this.canvas.height- this.maxJumpHeight && this.jumpPressed))
                {
                        this.y -= this.JUMP_Speed * FrameDelta * this.scaleRatio;
                }
            else {
                this.falling= true;
                }
        }
        else {
            if(this.y < this.yBase){
                this.y += this.GRAVITY* FrameDelta* this.scaleRatio;
                if(this.y + this.height > this.canvas.height){
                    this.y= this.yBase;
                }
            }
            else {
                this.falling= false;
                this.jumpOngoing= false;
            }
        }
        
    }

    run(gameSpeed, FrameDelta){
        if(this.WalkAnimationTimer <= 0){
            if(this.image === this.dinoRunImages[0]){
                this.image= this.dinoRunImages[1];
            }
            else {
            this.image= this.dinoRunImages[0];
            }
            this.WalkAnimationTimer= this.WALK_ANIMATION_TIMER;
        }
        this.WalkAnimationTimer -= FrameDelta* gameSpeed;
    }

    update(gameSpeed, FrameDelta){
        this.run(gameSpeed, FrameDelta);

        if(this.jumpOngoing){
            this.image= this.standingDino;
        }
        this.jump(FrameDelta);
    }

    draw(){
        this.cntxt.drawImage(this.image, this.x, this.y, this.height, this.width);
    }
}