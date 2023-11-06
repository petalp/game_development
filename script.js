const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

c.fillStyle =  "#E52"
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


const background = new Sprite({
    position : {
        x:0,
        y:0
    },
    imageSrc : './media_files/background.png'

})
const shop = new Sprite({
    position : {
        x:630,
        y:80
    },
    imageSrc : './media_files/shop.png', 
    scale : 3,
    framesMax:6

})

const player = new Fighter({
    position:{
        x:0, 
        y:0},
    velocity:{
        x:0,
        y:0
    },
    offset:{x:234, 
            y:185},
    scale:2.75,
    imageSrc:'./media_files/samuraiMack/samuraiMack/Idle.png',
        framesMax: 8,
    sprites :{
        idle:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Idle.png',
            framesMax: 8,
            
        },
        run:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death:{
            imageSrc:'./media_files/samuraiMack/samuraiMack/Death.png',
            framesMax: 6,
        },

    }, 
    attackBox:{
        offset :{
            x :150, 
            y :40
        }, 
        width:130,
        height:50,
    }
    
    })



const enemy = new Fighter({
    position:{
        x:500, 
        y:180
    },
    velocity:{
        x:0,
        y:0
    },
    color:"#BF6",
    offset:{x:170, 
            y:200},
    scale:2.75,
    imageSrc:'./media_files/kenji/kenji/Idle.png',
        framesMax: 4,
    sprites :{
        idle:{
            imageSrc:'./media_files/kenji/kenji/Idle.png',
            framesMax: 4,
            
        },
        run:{
            imageSrc:'./media_files/kenji/kenji/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc:'./media_files/kenji/kenji/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc:'./media_files/kenji/kenji/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc:'./media_files/kenji/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc:'./media_files/kenji/kenji/Take_hit.png',
            framesMax: 3,
        },
        
        death:{
            imageSrc:'./media_files/kenji/kenji/Death.png',
            framesMax: 7,
        },
        

    },
    attackBox:{
    offset :{
        x :-120, 
        y :40
    }, 
    width : 130,
    height : 50
    }
})

const  keys = {
    a : {
        pressed : false,
    },
    d: {
        pressed : false
    },
    w:{
        pressed : false
    },
    ArrowRight : {
        pressed :false
    },
    ArrowLeft : {
        pressed : false
    }

}



decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)                    
    c.fillStyle = "#E52"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    // player movement 
    player.switchSprites('idle')
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprites('run')
    }else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprites('run')
    }
    
    if (player.velocity.y < 0){
        player.switchSprites('jump')
    } else if(player.velocity.y > 0){
        player.switchSprites('fall')
    }

    //  enemy movement
    
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey=='ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey=='ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprites('jump')
    } else if(enemy.velocity.y > 0){
        enemy.switchSprites('fall')
    }


    // detect collision
    if (rectangularCollision({rectangle1:player, rectangle2:enemy})
        && player.isAttacking 
        && player.framesCurrent==5){
        enemy.takeHit()
        document.querySelector('#enemyHealth').style.width =  enemy.health + '%'
        
    }

    // if player misses
    if(player.isAttacking && player.framesCurrent == 5){
        player.isAttacking = false
    }

    if (rectangularCollision({rectangle1:enemy, rectangle2:player})
        && enemy.isAttacking
        && enemy.framesCurrent == 2){
        player.takeHit()
        document.querySelector('#playerHealth').style.width =  player.health + '%'
    }

    // if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent == 2){
        enemy.isAttacking = false
    }

    // deter the winner when either the player or enemy has no health
    if (player.health <= 0 || enemy.health <= 0){
        determineWinner({player, enemy, timeID})
    }

}

animate()


window.addEventListener('keydown', (event) => {
        if (!player.dead){
        switch (event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey ='d'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                player.lastKey = 'w'
                break
            case ' ':
                player.attack()
                break
        } 
    }

        if (!enemy.dead){
            switch(event.key){
            // the enemy moves 
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true 
                    enemy.lastKey ='ArrowLeft'
                    break
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true 
                    enemy.lastKey = 'ArrowRight'
                    break
                case 'ArrowUp':
                    enemy.velocity.y = -20
                    break
                case 'ArrowDown':
                    enemy.attack()
                    break
                }
            }
    
        
})

window.addEventListener('keyup', (event) => {
        switch (event.key){
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 'w':
                keys.w.pressed = false
                break


            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
        }
        
        
})