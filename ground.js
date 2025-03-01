class Ground{

    img; imgGameNotStarted;

    constructor(){
        this.x = 0;
        this.x2 = -1280;
        this.y = 480;
        this.w = 1280;
        this.h = 24;
    }

    update(speed){
        this.x -= speed;
        if(this.x<this.x2){
            this.x = 0;
        }
    }

    display(){
      
        push();
        imageMode(CORNER);
        image(this.img, this.x, this.y, this.w, this.h);
        image(this.img, this.x-this.x2, this.y, this.w, this.h);
        pop();
    }
    displayGameNotStarted(){
        push();
        imageMode(CORNER);
        image(this.imgGameNotStarted, 153, this.y, 80, this.h);
        pop();
    }
}