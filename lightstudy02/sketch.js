//goals: - fit to widths and heights
// - height margins same as widths
let numCols, numRows;
let squareSize = 60;
let margin = 6;
let potPosY = [];
let grid1 = [];
let potPosX = [];
let slider1, slider2, slider3;
let offsetYa, offsetYb, offsetXa, offsetXb;

function setup() {
  createCanvas(600, 600);
  
  // Create a slider and place it at the top of the canvas.
  slider1 = createSlider(0, 2, 1, 0.0125);
  slider1.position(30, 10);
  slider1.size(width-60);
  slider2 = createSlider(0, 2, 1, 0.0125);
  slider2.position(310,290);
  slider2.size(height-60);
  slider2.style('transform', 'rotate(90deg)');
  slider3 = createSlider(0, 2, 1, 0.0125);
  slider3.position(30, height-30);
  slider3.size(width-60);
  slider3.style('transform', 'rotate(180deg)');
  slider4 = createSlider(0, 2, 1, 0.0125);
  slider4.position(-250,290);
  slider4.size(height-60);
  slider4.style('transform', 'rotate(270deg)');
  
  numCols = width / (squareSize + margin) * 3;
  numRows = height / (squareSize + margin) * 3;

  for (let i = 0; i < numCols; i++) {
    potPosY[i] = [];
    potPosX[i] = [];
    grid1[i] = [];
  }

  offsetYa = random(10);
  offsetYb = random(10);
  offsetXa = random(10);
  offsetXb = random(10);
  updateGrid(offsetYb, offsetYa, offsetXb, offsetXa);
}

function draw() {
  background(225, 225, 255);
  
  updateGrid(slider1.value(), slider3.value(), slider4.value(), slider2.value())

  // Display
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
        grid1[i][j].displayObject();
    }
  }
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
        grid1[i][j].displayShadow(mouseX, mouseY);
    }
  }
  // for (let i = 0; i < numCols; i++) {
  //   for (let j = 0; j < numRows; j++) {
  //       grid1[i][j].displayLight(mouseX, mouseY);
  //   }
  // }
}

function updateGrid(_noiseOffsetXa, _noiseOffsetYa, _noiseOffsetXb, _noiseOffsetYb){
  // Initialize the grid
  let noiseOffsetXa = _noiseOffsetXa;
  let noiseOffsetYa = _noiseOffsetYa;
  let noiseOffsetXb = _noiseOffsetXb;
  let noiseOffsetYb = _noiseOffsetYb;
  

  for (let j = 0; j < numRows; j++) {
    let widthProgress = 0;
    for (let i = 0; i < numCols; i++) {
      // Use 2D noise to determine the size of each square
      let noiseValueX = noise(noiseOffsetXa + i * 0.1, noiseOffsetYa + j * 0.1);
      let newSizeX = map(noiseValueX, 0, 1, squareSize * 0.025, squareSize * 1);
      widthProgress += newSizeX + margin / 2;
      potPosY[i][j] = widthProgress - newSizeX / 2;
      let x = potPosY[i][j] + i * margin + (margin * 4) / 3;
      
      let noiseValueY = noise(noiseOffsetXb + i * 0.1, noiseOffsetYb + j * 0.1);
      let newSizeY = map(noiseValueY, 0, 1, squareSize * 0.025, squareSize * 1);
      if(j>0){
      potPosX[i][j] = potPosX[i][j-1] + newSizeY + margin / 2- newSizeY / 2;
      }else{
          potPosX[i][j] = 0 - newSizeY / 2;
      }
      // potPosY[i][j] = heightProgress - newSizeY / 2;
      let y = potPosX[i][j] + j * margin + (margin * 4) / 3;

      grid1[i][j] = new Square(x, y, newSizeX, newSizeY);
    }
  }
}

class Square {
  constructor(x, y, sizeX, sizeY) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  displayShadow(_sourceX, _sourceY) {
    ellipseMode(CENTER);

    // Number of opposite rectangles
    let numOpposites = 24; // Adjust as needed

    let distanceScale = map(dist(0, 0, _sourceX - this.x, _sourceY - this.y), 0, width, 0.8, 0.11); // Adjust this distance as needed
    let distance = 5 * distanceScale;
    for (let i = 0; i < numOpposites; i++) {
      // Calculate the position of the opposite rectangle at an increasing distance
      let scaleFactor = (i + 1) * distance / dist(0, 0, _sourceX - this.x, _sourceY - this.y);
      let oppositeX = this.x - (_sourceX - this.x) * scaleFactor;
      let oppositeY = this.y - (_sourceY - this.y) * scaleFactor;

      fill(0, 0, 80, map(i, 0, numOpposites - 1, 32, 0)); // Gradually decrease transparency
      ellipse(oppositeX, oppositeY, this.sizeX + i * (1 - distanceScale), this.sizeY + i * (1 - distanceScale));
    }
  }

  displayObject() {
    // MAIN OBJECT
    fill(0, 0, 160, 100);
    noStroke();
    ellipse(this.x, this.y, this.sizeX, this.sizeY);
  }

  displayLight(_sourceX, _sourceY) {
    // LIGHT ON OBJECT
    let distanceScale = map(dist(0, 0, _sourceX - this.x, _sourceY - this.y), 0, width, 0.1, 0.8); // Adjust this distance as needed
    let distance = 4 * distanceScale;
    let scaleFactorS = distance / dist(0, 0, _sourceX - this.x, _sourceY - this.y);
    let spotX = this.x + (_sourceX - this.x) * scaleFactorS * 4.5;
    let spotY = this.y + (_sourceY - this.y) * scaleFactorS * 4.5;
    let colIntensity = (this.sizeX / this.sizeY) * 200 + 155 * (1 - distanceScale);
    fill(colIntensity, colIntensity, 255, 255 * (1 - distanceScale));
    noStroke();
    ellipse(
      spotX,
      spotY,
      (this.sizeX * (1 - distanceScale)) / 1.6 + this.sizeX / this.sizeY,
      (this.sizeY * (1 - distanceScale)) / 1.6 + this.sizeX / this.sizeY
    );
  }
}

// function mousePressed() {
//   save("LightStudy_JamieRobinson.png");
// }