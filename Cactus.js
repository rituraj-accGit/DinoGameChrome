export default class Cactus {
    constructor(cntxt, x, y, width, height, image) {
      this.cntxt = cntxt;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.image = image;
    }

    update(speed, gameSpeed, FrameDelta, scaleRatio){
        this.x -= speed* gameSpeed* FrameDelta* scaleRatio;
    }
    draw(){
      this.cntxt.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    collideWith(sprite){ 
      const adjustBy= 1.4;    //a variable for inclusion of the boundary of obstacles, any lower than 1.4 gives absurd visuals
      if(
        sprite.x < this.x+ this.width / adjustBy &&
        sprite.x + sprite.width / adjustBy > this.x &&
        sprite.y < this.y+ this.height / adjustBy &&
        sprite.height+ sprite.y / adjustBy > this.y 
      ){
        return true;
      }
      else{
        return false;
      }

    }
}

//collision detection used is axis aligned bounding box
//can be found on mdn web docs
//did a variation of this where two boxes r overlapping it's not a collision until they're little overlapped
//this is because most obstacle images have a boundary. A collision is only when daino and obs partly over each other
