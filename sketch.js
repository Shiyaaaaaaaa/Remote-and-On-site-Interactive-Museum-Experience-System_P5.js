//对话框
class Dialog {
  constructor(x, y, w, h, text, fontSize, visible = true, active = true, displayText, position) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fontSize = fontSize;
    this.visible = visible;
    this.active = active;
    this.displayText = displayText;
    this.position = position;
  }

  draw() {
    if (!this.visible) return;
    push();
    rectMode(CENTER);
    strokeWeight(2);
    fill(255);
    rect(this.x, this.y, this.w, this.h, 10);
    textAlign(CENTER, CENTER);
    textSize(this.fontSize);
    fill(0);
    text(this.text, this.x, this.y);
    pop();
  }

  hitTest(x, y) {
    if (!this.visible) return false;
    return (
      x > this.x - this.w / 2 &&
      x < this.x + this.w / 2 &&
      y > this.y - this.h / 2 &&
      y < this.y + this.h / 2
    );
  }
}

let dialog1;
let dialog2;
let dialog3;
let dialog4;
let dialog5
let currentDialog;
let comicFont;

let treeImg;
let flowers = [];
let flowerSize;
let sizeSlider;
let eraserButton;
let eraserEnabled = false;
let cherryBlossomsCount = 0;
let countDisplay;

let valueSakura = []
let valueButton = []



let song;
let songPlayed = false;

function preload() {
  treeImg = loadImage('tree.jpg');
  song = loadSound('Cherry Blossom.mp3'); // 加载音频文件
  comicFont = loadFont('ComicFont.ttf');
}

//与micorbit沟通
let serial;
let latestData = "waiting for data";


function setup() {
////p5 control
serial = new p5.SerialPort();

  serial.list();
  serial.open('COM4');

  serial.on('connected', serverConnected);

  serial.on('list', gotList);

  serial.on('data', gotData);

  serial.on('error', gotError);

  serial.on('open', gotOpen);

  serial.on('close', gotClose);

////画布
  let canvas = createCanvas(1500, 800);
  canvas.parent("canvasContainer");
  // 创建对话框对象
  dialog1 = new Dialog(width / 2, height / 2 - 60, 200, 50, "1", 18, true, true,
   "Generate cherry blossoms by clicking on the branches, or pressing buttonA to generate random one", "left");
  dialog2 = new Dialog(width / 2, height / 2 - 60, 200, 50, "2", 18, false, false,
   "Generate cherry blossoms by clicking on the branches, or pressing buttonA to generate random one,\nErasing can be done by clicking on the eraser,\nthen click the flower you want to erase", "right");
  dialog3 = new Dialog(width / 2, height / 2 - 60, 200, 50, "3", 18, false, false, 
   "Generate cherry blossoms by clicking on the branches, or pressing buttonA to generate random one,\nErasing can be done by clicking on the eraser,\nClicking on the FLOWER icon to generate more randomly", "right");
  dialog4 = new Dialog(width / 2, height / 2 - 60, 200, 50, "4", 18, false, false, 
   "Generate cherry blossoms by clicking on the branches, or pressing buttonA to generate random one,\nErasing can be done by clicking on the eraser,\nClicking on the FLOWER icon to generate more randomly,\nClick 99 Blossoms with One Click on TREE icon or pressing buttonB, \nAnd receive all cherry blossoms collected from the museum", "right");
  dialog5 = new Dialog(width / 2, height / 2 + 60, 200, 50, "Next Exhibition", 18, false, false, 
   "Generate cherry blossoms by clicking on the branches, or pressing buttonA to generate random one\nErasing can be done by clicking on the eraser\nClicking on the FLOWER icon to generate more randomly\nClick 99 Blossoms with One Click on TREE icon or pressing buttonB\n\nAmidst Fife's blooming cherry blossoms,\nThough we cannot be there to witness,\nOur museum conveys the warmth and love of spring.\nTake a break, venture out and bask in the beauty of the season.", "right");
  currentDialog = dialog1;


//监听随机花朵
  let randomButton = select("#randomButton");
  randomButton.mousePressed(addRandomCherryBlossom);

//监听樱花雨
  let cherryBlossomRainButton = select("#cherryBlossomRainButton");
  cherryBlossomRainButton.mousePressed(cherryBlossomRain);

  
  sizeSliderContainer = createDiv();
  sizeSliderContainer.parent("sizeSliderContainer");
  sizeSlider = createSlider(10, 50, 20);
  sizeSlider.style('width', '600px'); // 增加这行代码以调整滑块长度
  sizeSlider.parent("sizeSlider");


  eraserButton = select("#eraserButton");
  eraserButton.mousePressed(toggleEraser);

  countDisplay = select("#countDisplay");
  recieveDisplay = select("#recieveDisplay")
}

////p5 control
function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readStringUntil('\n');
  if (!currentString || currentString.length === 0) {
    return;
  }
  currentString = currentString.trim();
  console.log("Received:", currentString);
  latestData = currentString;

  //判定microbit的输入
  if (currentString.includes('buttonA')) {
    addRandomCherryBlossom();
  } else if (currentString.includes('buttonB')) {
    cherryBlossomRain();
  }
}



////画布部分
function draw() {
  image(treeImg, 0, 0, width, height);
  flowerSize = sizeSlider.value();

  //记录创造的樱花数
  cherryBlossomsCount = flowers.length;
  countDisplay.html('Cherry Blossoms You Creat: ' + floor(cherryBlossomsCount)+ ' pieces of love');

  //记录接受的樱花树
  sumSakura = valueSakura
  recieveDisplay.html('Cherry Blossoms You recieve: ' + sumSakura + ' pieces of love');

  // 绘制样例樱花
  drawFlower(200, 60, flowerSize);

  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];
    drawFlower(flower.x, flower.y, flower.size);
  }

  //樱花飘落
  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];
    drawFlower(flower.x, flower.y, flower.size);

    if (flower.falling) {
      flower.y += flower.speed;

      if (flower.y > height) {
        flower.y = random(-height, 0);
      }
    }
  }
  currentDialog.draw(); // 仅绘制当前对话
  // 显示当前对话框的 displayText
  if (currentDialog.active) {
    push();
    textSize(22); // 修改此处的值以更改字体大小
    fill(0, 0, 0); // 修改此处的颜色值以更改字体颜色
    textAlign(LEFT, TOP);
    textFont(comicFont);
    
    let padding = 100; // 设置一个边距值，您可以根据需要调整这个值
    
    if (currentDialog.position === "left") {
      text(currentDialog.displayText, padding, 10);
    } else if (currentDialog.position === "right") {
      textAlign(RIGHT, TOP);
      text(currentDialog.displayText, width - padding, 10);
    }
    
    pop();
  }
}

//对话框鼠标事件
function mouseClicked() {
  if (currentDialog.active) {
    if (currentDialog == dialog1) {
      currentDialog.visible = false;
      currentDialog.active = false;
      dialog2.visible = true;
      dialog2.active = true;
      currentDialog = dialog2;
    } else if (currentDialog == dialog2) {
      currentDialog.visible = false;
      currentDialog.active = false;
      dialog3.visible = true;
      dialog3.active = true;
      currentDialog = dialog3;
    } else if (currentDialog == dialog3) {
      currentDialog.visible = false;
      currentDialog.active = false;
      dialog4.visible = true;
      dialog4.active = true;
      currentDialog = dialog4;
    } else if(currentDialog == dialog4) {
      currentDialog.visible = false;
      currentDialog.active = false;
      dialog5.visible = true;
      dialog5.active = true;
      currentDialog = dialog5;
    } else if (currentDialog == dialog5 && dialog5.hitTest(mouseX, mouseY)) {
      window.location.href = "page2.html";
    }
  }
}
  
function mouseReleased() {
  if (!currentDialog.hitTest(mouseX, mouseY)) { // 添加此条件以检查是否点击在对话框上
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      if (eraserEnabled) {
        for (let i = flowers.length - 1; i >= 0; i--) {
          let flower = flowers[i];
          let distance = dist(mouseX, mouseY, flower.x, flower.y);
          if (distance < flower.size) {
            flowers.splice(i, 1);
          }
        }
      } else {
        flowers.push({ x: mouseX, y: mouseY, size: flowerSize });
      }
    }
    window.cherryBlossomsCount = flowers.length;
 // 添加此行以立即更新樱花计数
 window.pushCherryBlossomsCountToFirebase();
  }
}



//橡皮擦按钮状态
function toggleEraser() {
  eraserEnabled = !eraserEnabled;
  if (eraserEnabled) {
    eraserButton.style('background-color', '#FF8C00');
    eraserButton.style('color', '#FFFFFF');
    eraserButton.html('Eraser On');
  } else {
    eraserButton.style('background-color', '#FFFFFF');
    eraserButton.style('color', '#000000');
    eraserButton.html('Eraser Off');
  }
}

//绘制樱花
function drawFlower(x, y, size) {
  // 绘制樱花
  noStroke();
  let petalSize = size;
  let petalAngle = TWO_PI / 5;
  for (let i = 0; i < 5; i++) {
    let gradientColor = color(255, 192, 203, 200);
    fill(gradientColor);
    let angle = i * petalAngle;
    let x1 = x + petalSize * cos(angle - petalAngle / 2);
    let y1 = y + petalSize * sin(angle - petalAngle / 2);
    let x2 = x + petalSize * cos(angle + petalAngle / 2);
    let y2 = y + petalSize * sin(angle + petalAngle / 2);
    let cx = x + petalSize * 0.6 * cos(angle);
    let cy = y + petalSize * 0.6 * sin(angle);
    arc(cx, cy, petalSize * 1.2, petalSize * 1.2, angle - petalAngle / 2, angle + petalAngle / 2, PIE);
    triangle(x, y, x1, y1, cx, cy);
    triangle(x, y, cx, cy, x2, y2);
  }
  // 绘制花蕊
  fill(255, 153, 204);
  ellipse(x, y, size * 2 / 3, size * 2 / 3);
  // 绘制花蕊芯线
  stroke(255, 255, 0);
  strokeWeight(2);
  let numLines = 5;
  for (let i = 0; i < numLines; i++) {
    let angle = i * TWO_PI / numLines;
    let startX = x + petalSize * 0.5 * cos(angle);
    let startY = y + petalSize * 0.5 * sin(angle);
    let endX = x + petalSize * 0.3 * cos(angle);
    let endY = y + petalSize * 0.3 * sin(angle);
    line(startX, startY, endX, endY);
 }
}

//随机花朵
function addRandomCherryBlossom() {
  let attempts = 0;
  let maxAttempts = 1000;
  let alphaThreshold = 50;

  // 定义矩形范围
  let rectX = 350; // 矩形左上角的 x 坐标
  let rectY = 70; // 矩形左上角的 y 坐标
  let rectWidth = width - 700; // 矩形的宽度
  let rectHeight = height - 400; // 矩形的高度

  // 加载像素数据到 pixels[] 数组
  treeImg.loadPixels();

  while (attempts < maxAttempts) {
    let randomX = random(rectX, rectX + rectWidth); // 更新此行以应用矩形范围
    let randomY = random(rectY, rectY + rectHeight); // 更新此行以应用矩形范围

    // 获取随机位置的像素颜色
    let pixelColor = treeImg.get(floor(randomX), floor(randomY));

    // 检查像素颜色的透明度（alpha 通道）
    if (pixelColor[3] > alphaThreshold) { // 如果透明度大于 alphaThreshold，则该像素不透明
      flowers.push({ x: randomX, y: randomY, size: flowerSize });
      break;
    }

    attempts++;
  }
  window.cherryBlossomsCount = flowers.length;
  // 添加此行以立即更新花朵计数
  window.pushCherryBlossomsCountToFirebase();
}

//樱花雨
function cherryBlossomRain() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  let numberOfCherryBlossoms = 99; // 可以调整这个值,读取博物馆端的firebase
 

  for (let i = 0; i < numberOfCherryBlossoms; i++) {
    let randomX = random(width);
    let randomY = random(-height, 0);

    flowers.push({
      x: randomX,
      y: randomY,
      size: flowerSize,
      falling: true,
      speed: random(2, 7),
    });
  } window.cherryBlossomsCount = flowers.length;
  // 添加此行以立即更新樱花计数
  window.pushCherryBlossomsCountToFirebase();

  if (!songPlayed) {
    song.play();
    songPlayed = true;
  }
}

const cherryBlossomRainButton = document.getElementById("cherryBlossomRainButton");
cherryBlossomRainButton.addEventListener("click", () => {
  window.pushCherryBlossomsCountToFirebase();
});
