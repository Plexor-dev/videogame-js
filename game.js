const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanLevel = document.querySelector('#spanLevel');
const spanRecord = document.querySelector('#spanRecord');
const spanResult = document.querySelector('#spanResult');
const modal = document.querySelector('#active');
//const closeModal = document.querySelector('#closeModal');
let gameOver = true;



window.addEventListener('load', setCanvas)
window.addEventListener('resize', setCanvas)

let canvasSize;

let elementsSize;

const playerPosition = {
    x: undefined,
    y: undefined
}

const giftPosition = {
    x: undefined,
    y: undefined
}

let bombsPosition = []

let level = 0;
let lives = 3;

let timeInterval;
let timeStart;
let timePlayed;
let segundos;


let onKeyDown = false;
document.body.onkeydown = () => onKeyDown = true;
document.body.onmousedown = () => onKeyDown = true;


function starGame(){

    game.font = elementsSize + "px Arial";
    //game.textBaseline = 'top';
    game.textAlign = "end";

    const map = maps[level];

    if(!map) {
        gameWin()
        return;
    }

    if(!timeStart){
        if(onKeyDown){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 10)
        spanResult.innerHTML = ' ';
        }
        showRecord()
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();
    

    bombsPosition = []
    game.clearRect(0,0,canvasSize, canvasSize);
    mapRowCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colIndex + 1)
            const posY = elementsSize * (rowIndex + 1)
            
            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    //console.log('player x', playerPosition.x, 'player y', playerPosition.y)
                } }
                else if(col == 'I') {
                    giftPosition.x = posX;
                    giftPosition.y = posY;
                    //console.log('Gift x', giftPosition.x, 'gift y', giftPosition.y )
                } else if(col == 'X') {
                        bombsPosition.push({x:posX, y:posY})
                    }
                    
                    
                    game.fillText(emoji, posX, posY)
                    
                    //console.table({col, emoji, colIndex, row, rowIndex})
                })     
            })
            
            //console.log(bombsPosition)
    // for(let row = 0; row < 10; row++) {
    //     for(let col = 0; col < 10; col++) {
    //     game.fillText(emojis[mapRowCols[row][col]], (elementsSize * col) + 30, (elementsSize * row ) +6)
    //   } }
    // console.log({canvasSize,elementsSize})

    movePlayer();
    showLevel();
}


btnUp.addEventListener('click', moveUp)
btnDown.addEventListener('click', moveDown)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
window.addEventListener( 'keydown', moveKeys)

function moveKeys(event){
    if(gameOver) {
    if(event.key == 'ArrowUp') moveUp();
     else if(event.key == 'ArrowDown') moveDown();
     else if(event.key == 'ArrowLeft') moveLeft();
     else if(event.key == 'ArrowRight') moveRight();
     //else { console.log("se presiono otra tecla " + event.code); }
}
}

function showLives(){
    const arraysHeart = Array(lives).fill(emojis['HEART']);

    spanLives.innerHTML = '';
    arraysHeart.forEach(heart => spanLives.append(heart))

}

function showTime(){
    let diferencia = Date.now() - timeStart;
    segundos = diferencia /1000;
    spanTime.innerHTML = segundos.toFixed(2);
}
function showLevel(){
    if(!level >0){
        spanLevel.innerHTML = level + 1;
    } else {
        spanLevel.innerHTML = ` Game Over`
    }
}

function showRecord() {
    spanRecord.innerHTML = (Number(localStorage.getItem('recordTime')) / 1000).toFixed(2)
 }

function movePlayer() {
    const giftCollisionX = giftPosition.x.toFixed(2) == playerPosition.x.toFixed(2);
    const giftCollisionY = giftPosition.y.toFixed(2) == playerPosition.y.toFixed(2);
    const giftCollisions = giftCollisionX && giftCollisionY
    if(giftCollisions) {
        console.log("se juntaron el regalo🎁 y el jugador💀")
        nextLevel()
    }

    const enemyCollision = bombsPosition.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    }   )
    if(enemyCollision) {
        console.log("tocaste una bomba") 
        levelFail()
     }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
    //console.log('player x', playerPosition.x, 'player y', playerPosition.y)
}


function levelFail(){
console.log('lives',lives)

    lives--
    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
        onKeyDown = false;
        clearInterval(timeInterval)
        spanResult.innerHTML = 'Perdiste';
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    starGame();
}

function showModal() { 
    modal.classList.remove('active')
    window.location.reload();
}

function gameWin(){
    modal.classList.add('active');



    onkeydown = false;
    gameOver = false;
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('recordTime');
    const playedTime = Date.now() - timeStart;


    if(recordTime){
    if(recordTime >= playedTime){
        localStorage.setItem('recordTime', playedTime)
        spanResult.innerHTML = "Record superado 😄";
        modal.style.backgroundColor = 'green'
    } else {
        spanResult.innerHTML = "No superaste el record 😪";
        modal.style.backgroundColor = 'salmon'
    }
} else {
    localStorage.setItem('recordTime', playedTime)
    spanResult.innerHTML = "Primer record ☺";
    modal.style.backgroundColor = 'lightgreen'
}
    console.log({recordTime, playedTime})
}


function nextLevel() {
    console.log("nextLevel");
    level++;
    starGame();
}

function moveUp() {
    console.log('moveUp');
    if( Math.ceil(playerPosition.y - elementsSize) < elementsSize){
        console.log('out');
    } else {
    playerPosition.y -= elementsSize;
    starGame()
    }
}

function moveDown() { 
    console.log('moveDown');
    if((playerPosition.y + elementsSize) > canvasSize){
        console.log('out');
    } else {
    playerPosition.y += elementsSize;
    starGame()
    }
 }

function moveLeft() { 
    console.log('moveLeft');
    if( Math.ceil(playerPosition.x - elementsSize) < elementsSize){
        console.log('out');
    } else {
    playerPosition.x -= elementsSize;
    starGame()
    }
}

function moveRight() { 
    console.log('moveright');
    if((playerPosition.x + elementsSize) > canvasSize){
        console.log('out');
    } else {
    playerPosition.x += elementsSize;
    starGame()
    }
}



function setCanvas() {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = Number(window.innerWidth.toFixed(0)) * 0.7;
    } else {
        canvasSize = Number(window.innerHeight.toFixed(0)) * 0.7;
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    elementsSize = (canvasSize / 10) -1;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    starGame();
}
