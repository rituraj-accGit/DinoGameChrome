export default class Ground{
    constructor(cntxt, width, height, speed, scaleRatio){
      this.cntxt= cntxt;
      this.canvas= cntxt.canvas;
      this.width= width;
      this.height= height;
      this.speed= speed;
      this.scaleRatio= scaleRatio;
      
      this.x= 0;
      this.y= this.canvas.height- this.height;

      this.groundImage= new Image();
      this.groundImage.src= "sources/ground.png";
      this.imageForGround= this.groundImage;
    }

    update(gameSpeed, FrameDelta){
        this.x -= gameSpeed* FrameDelta* this.speed* this.scaleRatio;
    }

    draw(){
        this.cntxt.drawImage(this.imageForGround, this.x, this.y, this.width, this.height);
        //trick to make the ground go looping:
        this.cntxt.drawImage(this.imageForGround, this.x+this.width, this.y, this.width, this.height);
        if(this.x < -this.width){
            this.x=0;
        }
    }

    reset(){
        this.x=0;
    }
}