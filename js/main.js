class Sprite {
    constructor ({position, imageSrc, scale=1, framesMax=1, offset={x:0, y:0} }){
        this.position = position
        this.height = 150
        this.width = 50
        this.image  = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.offset = offset 
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }


    draw(){
        // draw the background image
        c.drawImage(this.image,
                    this.framesCurrent*(this.image.width/this.framesMax),
                    0,
                    this.image.width/this.framesMax,
                    this.image.height,
                    this.position.x-this.offset.x, 
                    this.position.y-this.offset.y,
                    (this.image.width/this.framesMax) * this.scale,
                    this.image.height* this.scale
                    )

    }
    
    animateFrame(){
        this.framesElapsed++

        if  (this.framesElapsed % this.framesHold == 0){

        if (this.framesCurrent < this.framesMax - 1){
            this.framesCurrent++
            } else{
            this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrame()
    }
}





class Fighter extends Sprite {
    constructor ({position,
                velocity, 
                color="#FD0", 
                imageSrc, 
                scale=1, 
                framesMax=1,
                offset={x:0, y:0},
                sprites , 
                attackBox = {offset : {}, width:undefined, height:undefined}
            }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        })

        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position : {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.dead = false
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites 

        // loop through the  sprites
        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }


    }

    attack(){
        this.switchSprites('attack1')
        this.isAttacking = true;
    }

    takeHit(){
        
        this.health -= 20
        if (this.health <= 0){
            this.switchSprites('death')
        } else {
            this.switchSprites('takeHit')
        }
    }

    switchSprites(sprites){
        // check if the player A or player B is dead
        if (this.image === this.sprites.death.image ){
            if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true
            return}  

        // overriding all other animations with the attack animations
        if (this.image === this.sprites.attack1.image
            && this.framesCurrent < this.sprites.attack1.framesMax -1 ) return 

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image && 
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ) return


        switch (sprites){
            case 'idle':
                if(this.image != this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'jump':
                if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fall':
                if(this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack1':
                if(this.image != this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if(this.image != this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death':
                if(this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }

    

    update(){
        this.draw()
        if (!this.dead){
            this.animateFrame()
        }
        
        
        // update attackbox position
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw attackbox
        // c.fillRect(
        //     this.attackBox.position.x, 
        //     this.attackBox.position.y, 
        //     this.attackBox.width, 
        //     this.attackBox.height
        // )

        // direction in which a play moves
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // check if the players are at the bottom of the canvas window
        if(this.position.y + this.height + this.velocity.y >= canvas.height-96){
            this.velocity.y = 0;
            this.position.y = 330
        }else {
            this.velocity.y += gravity
        }
        
    }
}