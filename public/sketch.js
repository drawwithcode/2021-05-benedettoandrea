// pattern control
let angleX = 0;
let angleY = 0;
let radius;
const detail = 6;

// theming
let currentTheme = "light";
let themeBackground = 255;
let themeFill = 0;

// pattern control
let clientPattern;
let peersPatterns = new Map();

// connection to the server
let clientSocket = io();

clientSocket.on("mouseBroadcast", (id, data) => {
  /* if not present inside the collection, create a clone of the pattern associated with 
     the id of the client that sent the message originally and store it in peersPatterns
   */
  if (!peersPatterns.has(id)) {
    peersPatterns.set(id, new moirePattern(40, 40));
  }

  // get the pattern associated with the id of the client that sent the message originally and set its rotation
  const pattern = peersPatterns.get(id);
  pattern.setRotation(data.x, data.y);
});

clientSocket.on("peerDisconnect", (id) => {
  peersPatterns.delete(id);
});

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL).parent("container");
  frameRate(60);
  angleMode(DEGREES);
  rectMode(CENTER);
  noStroke();
  clientPattern = new moirePattern(40, 40);
}

function draw() {
  // 3D environment setup
  background(themeBackground);
  fill(themeFill);
  ortho(-width / 2, width / 2, -height / 2, height / 2, -100000, 100000);

  if (width > height) {
    // horizontal screens
    radius = windowHeight / 150;
  } else {
    // vertical screens
    radius = windowWidth / 150;
  }

  // display the client's object (a single pattern)
  clientPattern.display();

  // cycle through each object (called pattern) stored in peersPattern and display it
  for (const [, pattern] of peersPatterns) {
    pattern.display();
  }
}

function mouseDragged() {
  // each time the cursor is moved, the client's pattern rotates
  angleX = map(mouseX, -width / 2, width / 2, 0, 360);
  angleY = map(mouseY, -height / 2, height / 2, 0, 360);
  clientPattern.setRotation(angleX, angleY);

  // send the updated rotation to the server
  let message = {
    x: angleX,
    y: angleY,
  };
  clientSocket.emit("patternRot", message);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// generate a rectangular pattern of points
class moirePattern {
  // parameters to build the pattern: number of spheres in the x and y axes
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
  }

  // set the rotation of the pattern
  setRotation(angleX, angleY) {
    this.angleX = angleX;
    this.angleY = angleY;
  }

  // display the pattern on-screen
  display() {
    push();
    rotateX(this.angleY);
    rotateY(this.angleX);
    for (
      let x = -width / 2 + width / this.xDim / 2;
      x < width / 2;
      x += width / this.xDim
    ) {
      for (
        let y = -height / 2 + height / this.yDim / 2;
        y < height / 2;
        y += height / this.yDim
      ) {
        push();
        translate(x, y);
        sphere(radius, detail, detail);
        pop();
      }
    }
    pop();
  }
}

// toggle between themes (light/dark)
function toggleP5Theme() {
  if (currentTheme === "dark") {
    themeBackground = 255;
    themeFill = 0;
    currentTheme = "light";
  } else if (currentTheme === "light") {
    themeBackground = 0;
    themeFill = 255;
    currentTheme = "dark";
  }
}

// save a screenshot
function saveScreenshot() {
  let date = new Date();
  let currentDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    "-" +
    date.getHours() +
    "-" +
    date.getMinutes() +
    "-" +
    date.getSeconds();
  saveCanvas("pattern_" + currentDate, "png");
}
