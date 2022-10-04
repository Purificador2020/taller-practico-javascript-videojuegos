const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

/* Guardamos en varaibles los datos de consulta del teclado */
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#Lives');
const spanTime = document.querySelector('#Time');
const spanStar = document.querySelector('#star');
const spanDiamond = document.querySelector('#diamond');
const spanrecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let timeStart;
let star = 0;
let diamond = 0;
let level = 0;
let lives = 3;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
/* Detectar coliciones */
const gitPosition={
  x: undefined,
  y: undefined,
};
/* Detectar enemigos multiples */
let enemyPositions=[]
let star1Position=[]
let diamondPosition=[]
  
;
/* Captura el eventos de ajuste de pantalla */
window.addEventListener('load', setCanvasSize);
/* Captura el eventos de ajuste de ajuste de pantalla */
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize =canvasSize.toFixed(0);
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  elementsSize = canvasSize / 10;

  playerPosition.x=undefined;
  playerPosition.y=undefined;
  startGame();
}

function startGame() {
  console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  /* me traigo el mapa que requiero*/
  const map = maps[level];

  /* consultamos si hay mas mapas en el arreglo */
   if (!map){
    gameWin();
    return;
   }
   /* tomando el tiempo de inicio */

   if(!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime,100);
    showRecort();
   }
  /* con split() quito los saltos y con trim()quitamos 
  los espacions en blanco asi tenemos un arreglo de filas*/
  const mapRows = map.trim().split('\n');
  /* Con .map() convertimos los strings en un arreglo osea tendremos un
  array de arrays */
  const mapRowCols = mapRows.map(row=>row.trim().split(''));
  /* mostramos corazone vidas */
  showLives();

  /* Limpiar el arreglo de enemigos */
  enemyPositions =[];
  star1Position = [];
  diamondPosition = [];

/* Refactorizando el codigo del los "for" tenemos */
/* cuando el array de arrays le asemos forEach en sus lineas "Row" donde tendremos 
el valor y su número de posición (row, rowI) luego se realiza un rowforEach 
para obtener el valor y su posicion en la columnas */
  game.clearRect(0,0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      /* consultamos si emoji es igual a player */
      if(col == 'O'){
        if (!playerPosition.x && !playerPosition.y){
        playerPosition.x=posX;
        playerPosition.y=posY;
        }
        /*  Preguntamos si estamos encontrando con una I "Regalo"  */

      }else if (col == 'I'){
        gitPosition.x= posX;
        gitPosition.y= posY;
      }else if (col == 'X'){
        enemyPositions.push({
          x:posX,
          y:posY,
        });
      }else if (col == 'S'){
        star1Position.push({
          x:posX,
          y:posY,
        });
        
      }else if (col == 'D'){
        diamondPosition.push({
          x:posX,
          y:posY,
        });
      }

      game.fillText(emoji, posX, posY);
    });
    
  });
  moverPlayer();
 /* for (let row = 1 ; row<= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      game.fillText(emojis[mapRowCols[row-1][col-1]], elementsSize * col  , elementsSize * row);
    } 
    }*/
  
}
function moverPlayer(){
  const gitCollisionX = playerPosition.x.toFixed(3) == gitPosition.x.toFixed(3);
  const gitCollisionY = playerPosition.y.toFixed(3) == gitPosition.y.toFixed(3);
  const gitCollision = gitCollisionX && gitCollisionY;
  if(gitCollision){
    levelWin();
  }
  /* variable que textea los eneemigos del arreglo  */
  const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });
  /* Calculando posicion de la estrella y si coliciona con el juegador */
  const star1Collision = star1Position.find(estrella =>{
    const star1CollisionX = estrella.x.toFixed(3) == playerPosition.x.toFixed(3);
    const star1CollisionY = estrella.y.toFixed(3) == playerPosition.y.toFixed(3);
    return star1CollisionX && star1CollisionY;
  });
  /*  calculando la posicion de el diamante y si coliciona con el jugador */
  const diamondCollision = diamondPosition.find(diamond =>{
    const diamondCollisionX = diamond.x.toFixed(3) == playerPosition.x.toFixed(3);
    const diamondCollisionY = diamond.y.toFixed(3) == playerPosition.y.toFixed(3);
    return diamondCollisionX && diamondCollisionY;
  });
  
  if (enemyCollision){
    levelFail();
  } 
 if(star1Collision){
    star++;
    showStar();
  }
  if ( diamondCollision){
    diamond++;
    showDiamound();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y);
}
/* Cambiando de nivel */

/* creraremos las funciones para cuando chocamos 
con la bomba perdemos una vida yreiniciamos el juego */

/* Cambiando de nivel */
function levelWin(){
  level++;
  startGame();
}
function levelFail(){
  lives--;
  /* mostrando los corazones en el HTML */
  //spanLives.innerHTML = emojis('HEART');

  if (lives <= 0){
    level = 0;
    lives = 3;
    timeStart=undefined;
    star=undefined;
    diamond=undefined;
    
  }
  playerPosition.x=undefined;
  playerPosition.y=undefined;
  startGame();
  
}
function gameWin(){
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval);
  //agregamos el valor que hay en record_time
  const recordTime=localStorage.getItem('record_time');
  //Guardamos el tiempo del jugador
  const playerTime=Date.now()-timeStart;
  //Si recorTime tiene un valor ingresamos
  if(recordTime)
  {if(recordTime>=playerTime){
    localStorage.setItem('record_time',playerTime);
    pResult.innerHTML='SUPERASTE EL RECORD :)';
  }else{
    pResult.innerHTML='lo siento, no superaste el records :(';}
  //Si la variable recorTime esta Null 
  }else{
    localStorage.setItem('record_time',playerTime);
    pResult.innerHTML='Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';}
console.log({recordTime,playerTime});}

function showLives(){
  const heartsArray = Array(lives).fill(emojis['HEART']);

  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  console.log('Me quiero mover hacia arriba');
  if((playerPosition.y - elementsSize) < elementsSize-1){
    console.log('Llego al final');
  }else{
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Me quiero mover hacia izquierda');
  if((playerPosition.x - elementsSize) < elementsSize-1){
    console.log('Llego al final');
  }else{
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log('Me quiero mover hacia derecha');
  if((playerPosition.x + elementsSize) > canvasSize){
    console.log('Llego al final');
  }else{
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  if((playerPosition.y + elementsSize) > canvasSize -1){
    console.log('Llego al final');
  }else{
    playerPosition.y += elementsSize;
    startGame();
  }
}
function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecort(){
  spanrecord.innerHTML = localStorage.getItem('record_time');
}
function showStar(){
  spanStar.innerHTML=star;
}
function showDiamound(){
  spanDiamond.innerHTML=diamond;
}


