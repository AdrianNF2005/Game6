class Dinosaur {
    constructor(){
        this.x = 200;
        this.w = 80;
        this.y = 450;
        this.h = 86;
        this.last_jump_y = 0;
        this.img_index = 0;
        this.img_crouching_index = 0;
        this.jumping = false;
        this.crouching = false;
        this.living = true;
        this.stop_jumping = false;
        this.will_die = false;
        this.jump_stage = 0;
        this.img;
        this.img_running_1;
        this.img_running_2;
        this.img_running_3;
        this.img_crouching_1;
        this.img_crouching_2;
        this.img_die;
        this.img_die_night;
        this.imgs = [];
        this.crouching_imgs = [];
        this.xPositionOfCollisionBoxes = [2, 12, 12, 16, 20, 20, 37, 28, 39];
        this.yPositionOfCollisionBoxes = [30, 42, 52, 60, 67, 72, 72, 30, 4];
        this.collisionBoxes = [];
        this.activeCollisionBoxes;
        this.crouchCollisionBoxes = [];
        this.createCollisionBoxes();
        this.createCrouchCollisionBoxes();
        this.activeCollisionBoxes = this.collisionBoxes;
    }

    f(x){
        return (-4*parseFloat(x)*(parseFloat(x)-1))*172;
    }

    update(){ 
        if(this.jumping){ 
            this.y=448-Math.floor(this.f(this.jump_stage));
            this.jump_stage += map(GlobalSpeed, 6, 20, 0.02, 0.03);
            this.last_jump_y = this.y;
            this.img = this.img_running_1;
         
            if(this.jump_stage>1){
                this.jumping = false;
                this.jump_stage = 0;
                this.y = 450;
            }
        }
        else if(this.crouching){
            if(frameCount%10==0 && !this.will_die){
                this.img = this.crouching_imgs[this.img_crouching_index ^= 1];
            }
        }
        else{ 
            if(frameCount%10==0){
                this.img_index++;
                if(this.img_index==3){
                    this.img_index = 0;
                }
                this.img = this.imgs[this.img_index];
            }
        }
        this.updateYCollisionBoxes();
    }

    doInitialJump(){
        if(this.jumping){
            this.y=448-Math.floor(this.f(this.jump_stage));
            this.jump_stage += 0.02;
            this.last_jump_y = this.y;
            this.img = this.img_running_1;
         
            if(this.jump_stage>1){
                this.jumping = false;
                this.jump_stage = 0;
                this.y = 450;
                game.started = true;
            }
        }
    }

    jump(){
        this.jumping = true;
    }

    die(... enemy_height){ 
        this.living = false;

          if (LastUpdate == true) {
        
          LastUpdate = false;
            
          if (RecordACT >= MaxScore) {
      
          ref = database.ref('Juegos/DinoDuck/HistoricalRecord');
          ref.set(round(RecordACT));
            
          }

          }
        
        if(game.night){
            image(game.imgGameOver, ((game.window_width/2)) + 5, 350 + 5, 347*1.5, 20*1.5);
            image(game.imgGameOverNight, ((game.window_width/2)), 350, 347*1.5, 20*1.5);
            this.img = this.img_die_night;
        }
        else{
            image(game.imgGameOver, ((game.window_width/2)) + 5, 350 + 5, 347*1.5, 20*1.5);
            image(game.imgGameOverNight, ((game.window_width/2)), 350, 347*1.5, 20*1.5);
            this.img = this.img_die;
        }
        
        if(this.isCrouching() && this.isStoppingJumping()){
            this.stop_crouch();
        }
        else if (this.isCrouching()){
            this.stop_crouch();
            this.x+=30;
        }
    
        let eh = (enemy_height.length >= 1) ? enemy_height[0] : null;
         
        if(eh != null){
           this.y = eh-(this.h-5);
        }
        this.w = 80;
        this.h = 86;
        this.activeCollisionBoxes = this.collisionBoxes;
        this.updateXYCollisionBoxes();
        noLoop();
    }

    stop_jump(... stop_jump_enemy_height){

        let eh = (stop_jump_enemy_height.length >= 1) ? stop_jump_enemy_height[0] : null;
         
        if(eh != null){
           this.y = eh-(this.h-5);
        }
        else{
            this.y = 450;
        }

        this.jumping = false;
        this.jump_stage = 0;
        this.crouch();
    }

    crouch(){
        
        if(this.y<=450 && !this.will_die && this.living){
            this.crouching = true;
            this.activeCollisionBoxes = this.crouchCollisionBoxes;
            this.y += 34;
            this.w = 110;
            this.h = 52;
        }
        else if (this.y<=450){
            this.crouching = true;
        }

        this.updateCrouchingImage();

    }
    
    updateCrouchingImage(){
        if(this.will_die){
            this.img = this.img_die;
        }
        else{
            this.img = this.crouching_imgs[this.img_crouching_index];
        }
    }

    stop_crouch(){
    
        if(this.y>450){
            this.crouching = false;
            this.stop_jumping = false;
            this.activeCollisionBoxes = this.collisionBoxes;
            this.y -= 34;
            this.w = 80;
            this.h = 86;
        }
       
        if(this.living){
            this.img = this.imgs[this.img_index];
        }

        this.updateYCollisionBoxes();
 
    }
    
    createCollisionBoxes(){
        for (let b of new CollisionBox(6,0).getCollisionBoxes()){
            this.collisionBoxes.push(b);
        } 
    }

    createCrouchCollisionBoxes(){
        for (let b of new CollisionBox(7,0).getCollisionBoxes()){
            this.crouchCollisionBoxes.push(b);
        } 
    }

    updateYCollisionBoxes(){
        for (let i=0; i<this.collisionBoxes.length;i++){
            this.collisionBoxes[i].y=this.y+this.yPositionOfCollisionBoxes[i];
        }
    }

    updateXYCollisionBoxes(){
        for (let i=0; i<this.collisionBoxes.length;i++){
            this.collisionBoxes[i].x=this.x+this.xPositionOfCollisionBoxes[i];
        }
        this.updateYCollisionBoxes();
    }

    display(){
      //image(this.img, this.x, this.y, this.w, this.h);
      push();
      //imageMode(BOTTOM);
  
  let Xpos =  this.x;
  let Ypos = this.y;
  
  let Size = 0.5;
      
  let imgWithBorder;
      
  if (this.crouching == true) {
    
  imgWithBorder = createGraphics(Duck1.width*Size, Duck1.height*Size); // Crear buffer
  imgWithBorder.image(Duck1, 0, 0, Duck1.width*Size, Duck1.height*Size); // Copiar la imagen original

  imgWithBorder.filter(DILATE); // Expande las partes visibles para crear un borde
  push();
  tint(255, 255, 255); // Ajusta la transparencia si es necesario
  image(imgWithBorder, Xpos, Ypos); // Dibujar borde expandido
  pop();

    
    image(Duck1, Xpos, Ypos, Duck1.width*Size, Duck1.height*Size);
    
  } else {
  
  if (millis() >= millisANT + 100)  {
    
    millisANT = millis();
    
  if (FrameDuck > 1) {
    
    FrameDuck = FrameDuck - 1;
    
  } else {
   
    FrameDuck = 8;
    
  }
    
  }
  
  if (FrameDuck == 1) {
  
  image(Duck2, Xpos, Ypos, Duck2.width*Size, Duck2.height*Size);
  
  } else if (FrameDuck == 2) {
       
  image(Duck3, Xpos, Ypos, Duck3.width*Size, Duck3.height*Size);
             
  } else if (FrameDuck == 3) {
       
  image(Duck4, Xpos, Ypos, Duck4.width*Size, Duck4.height*Size);
             
  } else if (FrameDuck == 4) {
       
  image(Duck5, Xpos, Ypos, Duck5.width*Size, Duck5.height*Size);
             
  } else if (FrameDuck == 5) {
       
  image(Duck6, Xpos, Ypos, Duck6.width*Size, Duck6.height*Size);
             
  } else if (FrameDuck == 6) {
       
  image(Duck7, Xpos, Ypos, Duck7.width*Size, Duck7.height*Size);
             
  } else if (FrameDuck == 7) {
       
  image(Duck8, Xpos, Ypos, Duck8.width*Size, Duck8.height*Size);
             
  } else if (FrameDuck == 8) {
       
  image(Duck9, Xpos, Ypos, Duck9.width*Size, Duck9.height*Size);
             
  }
  
  pop();
    
  }
      
  }

    isJumping(){
        return this.jumping;
    }

    isStoppingJumping(){
        return this.stop_jumping;
    }

    isCrouching(){
        return this.crouching;
    }

    isAlive(){
        return this.living;
    }
}