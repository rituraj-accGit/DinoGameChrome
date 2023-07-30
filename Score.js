export default class score{
    score= 0;
    HIGH_SCORE_KEY= "highScore";

    constructor(cntxt, scaleRatio){
        this.cntxt= cntxt;
        this.canvas= cntxt.canvas; 
        this.scaleRatio = scaleRatio;
    }

    update(FrameDelta){
        this.score += FrameDelta* 0.1;
    }

    reset(){
        this.score= 0;
    }

    setHighScore(){
        const highScore= Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if(this.score > highScore){
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    draw(){
        const highScore= Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y= 20* this.scaleRatio;

        const fontsize = 20 * this.scaleRatio;
        this.cntxt.font = `${fontsize}px serif`;
        this.cntxt.fillStyle= "#525250";
        const scoreX= this.canvas.width- 75*this.scaleRatio;
        const highScoreX= scoreX- 125*this.scaleRatio;

        const scorePadded= Math.floor(this.score).toString().padStart(6, 0);    //to make 6 0s always at least
        const highScorePadded= highScore.toString().padStart(6, 0);
        
        this.cntxt.fillText(scorePadded, scoreX, y);
        this.cntxt.fillText(`BEST ${highScorePadded}`, highScoreX, y);
    }
}