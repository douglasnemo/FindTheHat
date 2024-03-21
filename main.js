/*
In this project, you’ll be building an interactive terminal game. 
The scenario is that the player has lost their hat in a field full of holes, 
and they must navigate back to it without falling down one of the holes 
or stepping outside of the field.
*/

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
    this._startPoint = [0,0];
  }
  print() {
    for (let row of this.field) {
      console.log(row.join(""));
    }
  }
  changeStartPoint(y,x) {
    return this._startPoint = [y,x];
  }
  get startPoint() {
    return this._startPoint;
  }
  randomField(width, height, percentage) {
    let startPoint = this.startPoint;
    const sum = width*height;
    const amountOfHoles = Math.trunc(sum*percentage/100);
    // create the position of the holes and the hat
    let placeOfHoles = [];
    for (let i=0; i<amountOfHoles; i++) {
      let newHole = [Math.trunc(Math.random()*(width-1)), Math.trunc(Math.random()*(height-1))]
      const already = (element) => (JSON.stringify(element) === JSON.stringify(newHole) | JSON.stringify(element) === JSON.stringify(startPoint)); // test if the new hole already exist
      if (!placeOfHoles.some(already)) {
        placeOfHoles.push(newHole);
      }
      else i--;
    }
    let placeHat   = [0,0];
    let occupied = (element) => (JSON.stringify(element) === JSON.stringify(placeHat) | JSON.stringify(placeHat) === JSON.stringify(startPoint));
    do {
      placeHat = [Math.trunc(Math.random()*(width-1)), Math.trunc(Math.random()*(height-1))];
    } while(placeOfHoles.some(occupied))
    // create the empty field
    let row  = [];
    let felt = [];
    for (let m=0; m<height; m++){
     for (let n=0; n<width; n++){
       row.push(fieldCharacter);
     }
     felt.push(row);
     row = [];
    }
    // place out the holes, hat, and starting point
    for (let j=0; j<placeOfHoles.length; j++){
      felt[parseInt(placeOfHoles[j][0])][parseInt(placeOfHoles[j][1])]= hole;
    }
    felt[parseInt(placeHat[0])][parseInt(placeHat[1])] = hat;
    felt[parseInt(startPoint[0])][parseInt(startPoint[1])] = pathCharacter;
    this.field = felt;
    }

  playGame() {
    let quitGame = false;
    let vertical   = this._startPoint[0];
    let horizontal = this._startPoint[1];
    const width = this.field[0].length;
    const depth = this.field.length;
    while (horizontal>= 0 && horizontal<width && vertical>=0 && vertical<depth && !quitGame) {
      this.print();
      let direction = prompt("Which direction (a=left, d=right, w=up, x=down): ", "");
        switch (direction.toUpperCase()){
          case "A": horizontal--; break;
          case "D": horizontal++; break;
          case "W": vertical  --; break;
          case "X": vertical  ++; break;
          case "Q": quitGame = true; break;
          default: console.log(`Please enter a valid letter (a/d/w/x)`);
        }
        if (quitGame) {console.log("you quit the game"); break;}
        if (!(horizontal>= 0 && horizontal<width && vertical>=0 && vertical<depth)){break;}
        if (this.field[vertical][horizontal] === hat ) {console.log('You found the hat!'); break;}
        if (this.field[vertical][horizontal] === hole) {console.log('You got into the rabbit hole'); break;}
        this.field[vertical][horizontal] = "*";
    };
    if (!((horizontal>= 0 && horizontal<width && vertical>=0 && vertical<depth))){console.log("you got out of the playing area");}
    console.log("end of game");
  }
}

const myField = new Field([]);
// myField.changeStartPoint(1,1); // optional. From 0 to (width/height-1)
myField.randomField(4,5,10);   // optional if you enter a valid field, like below
myField.playGame();

/*const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
]);
myField.playGame(); */


/* solution
https://discuss.codecademy.com/t/find-your-hat-challenge-project-javascript/462380/147
*/