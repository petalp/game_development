function determineWinner({player, enemy, timeID}){
    clearTimeout(timeID)
    document.querySelector('#gametime').style.display = 'flex'
    if (player.health === enemy.health){
        document.querySelector('#gametime').innerHTML = "TIE"
    }else if(player.health > enemy.health){
        document.querySelector('#gametime').innerHTML = "Player 1 wins"
    }else if(player.health < enemy.health){
        document.querySelector('#gametime').innerHTML = 'Player 2 wins'
    }
}

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let timer = 30 
let timeID;
function decreaseTimer(){
    if(timer>0){
    timeID =  setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer == 0){
        determineWinner({player, enemy, timeID})
}
}