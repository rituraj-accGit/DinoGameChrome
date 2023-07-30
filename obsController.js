import Cactus from "./Cactus.js";

export default class obsController{
    obstacle_interval_MIN= 500;
    obstacle_interval_MAX= 2000;

    nextObsInterval= null;
    obstacles= [];


    constructor(cntxt, obsImages, scaleRatio, speed){
        this.cntxt= cntxt;
        this.canvas= cntxt.canvas;
        this.obsImages= obsImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextObsTime();
    }

    setNextObsTime(){
         const num= this.getRandomNumber(
            this.obstacle_interval_MIN, this.obstacle_interval_MAX
            );
            this.nextObsInterval= num;
            //console.log(this.nextObsInterval);
    }
    getRandomNumber(min, max){
        return Math.floor(Math.random() * (max-min+1) + min);
    }

    createObs(){
        const index= this.getRandomNumber(0, this.obsImages.length -1);
        const obstacleImage= this.obsImages[index];

        const x= this.canvas.width * 1.5;           //so that obstacles are created wayyy offscreen
        const y= this.canvas.height- obstacleImage.height;
        //a new obstacle class to represent each obstacle
        const cactus = new Cactus(
            this.cntxt,
            x,
            y,
            obstacleImage.width,
            obstacleImage.height,
            obstacleImage.image,
            );
          this.obstacles.push(cactus);      //every kind of obstacle is a cactus here XD
    }

    update(gameSpeed, FrameDelta){
        if(this.nextObsInterval <= 0){
            this.createObs();//craeate an obs
            this.setNextObsTime();
        }
        this.nextObsInterval -= FrameDelta;

        //console.log(this.obstacles.length);     after inserting the cacti in the obstacles array 
        this.obstacles.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, FrameDelta, this.scaleRatio);
        });
        //to filter out the obstacles that went off screen
        this.obstacles= this.obstacles.filter((cactus)=> cactus.x > -cactus.width);
    }

    draw(){
        this.obstacles.forEach(cactus => cactus.draw());
    }

    collideWith(sprite){
        return this.obstacles.some((cactus)=> cactus.collideWith(sprite));  //if anyyy cactus is colliding we get true
    }

    reset(){
        this.obstacles= [];
    }
}