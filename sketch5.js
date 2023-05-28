let Hue = [];
let Saturation = [];
let Brightness = [];
let HueEmotion = [];
let SaturationEmotion = [];
let BrightnessEmotion = [];
let currentText = "";

let flowers = [];
let maxFlowers = 10;

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


  createCanvas(1500, 800);

  // 为全局颜色数组添加一些初始值
  Hue = [0, 50, 100, 150, 200, 250, 300];
  Saturation = [0, 50, 100];
  Brightness = [0, 50, 100];

  HueEmotion = [0, 50, 100, 150, 200, 250, 300];
  SaturationEmotion = [0, 50, 100];
  BrightnessEmotion = [0, 50, 100];

  // 获取按钮元素并添加点击事件监听器
  bloomButton = select("#bloomButton");
  bloomButton.mousePressed(() => {
    for (let i = 0; i < maxFlowers; i++) {
      const hue = Hue.length > 0 ? random(Hue) : 0;
      const saturation = Saturation.length > 0 ? random(Saturation) : 0;
      const brightness = Brightness.length > 0 ? random(Brightness) : 0;
      flowers.push(new Flower(random(width), random(height), random(0.5, 1.5), hue, saturation, brightness));
    }
  });
  bloomEmotionButton = select("#bloomButtonEmotion");
  bloomEmotionButton.mousePressed(() => {
    for (let i = 0; i < maxFlowers; i++) {
      const hue = HueEmotion.length > 0 ? random(HueEmotion) : 0;
      const saturation = SaturationEmotion.length > 0 ? random(SaturationEmotion) : 0;
      const brightness = BrightnessEmotion.length > 0 ? random(BrightnessEmotion) : 0;
      flowers.push(new Flower(random(width), random(height), random(0.5, 1.5), hue, saturation, brightness));
    }
  });
}


function draw() {
  background(220, 50);

  // 更新并绘制每朵花
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].update();
    flowers[i].draw();

    if (flowers[i].isDead()) {
      flowers.splice(i, 1);
    }
  }

  // 显示对话框
  if (flowers.length >= 200) {
    displayMessageBox("Emotions bloom like flowers of many hues,\n Each soul unique, with colors all its own,\nA vibrant tapestry of joy and blues,\nIn shades that glow and sparkle, then have flown.\n\nSome hearts are like the roses, bold and bright,\nWith passion burning hot like fiery red,\nWhile others like the violets, soft and light,\nWith gentle shades of purple, pink, and blue instead.\n\nAnd some are like the daisies, pure and white,\nWith innocence and grace that never fade,\nWhile others like the sunflowers, bold and bright,\nWith sunny yellow hues that never shade.\n\nEach soul, a garden full of wondrous blooms,\nA work of art, a masterpiece divine,\nA living canvas where each color looms,\nA precious gift, a treasure to enshrine.\n\nSo let us cherish every soul we meet,\nAnd celebrate the colors they display,\nFor in their vibrant hues, we'll find a treat,\nA beauty that will never fade away.");
  }
}



class Flower {
  constructor(x, y, scale, hue, saturation, brightness) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.bloomFactor = 0;
    this.angle = 0;
    this.lifespan = 255;
  }

  update() {
    this.bloomFactor += 0.01;
    this.angle += 0.02;
    this.lifespan -= 0.5;

    if (this.bloomFactor > 1) {
      this.bloomFactor = 1;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(this.scale);
    rotate(this.angle);

    colorMode(HSB);

    for (let i = 0; i < 8; i++) {
      const adjustedSaturation = this.saturation + i * 5;
      const adjustedBrightness = min(this.brightness + i * 12, 100);
      fill(color(this.hue, adjustedSaturation, adjustedBrightness), this.lifespan);
      push();
      rotate(TWO_PI * i / 8);
      ellipse(0, -30 * this.bloomFactor, 20, 60 * this.bloomFactor);
      pop();
    }

    fill(color(this.hue, this.saturation, this.brightness), this.lifespan);
    ellipse(0, 0, 20 * this.bloomFactor, 20 * this.bloomFactor);
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}
  // 显示对话框
  if (flowers.length >= 200) {
  displayMessageBox("Emotions bloom like flowers of many hues,\n Each soul unique, with colors all its own,\nA vibrant tapestry of joy and blues,\nIn shades that glow and sparkle, then have flown.\n\nSome hearts are like the roses, bold and bright,\nWith passion burning hot like fiery red,\nWhile others like the violets, soft and light,\nWith gentle shades of purple, pink, and blue instead.\n\nAnd some are like the daisies, pure and white,\nWith innocence and grace that never fade,\nWhile others like the sunflowers, bold and bright,\nWith sunny yellow hues that never shade.\n\nEach soul, a garden full of wondrous blooms,\nA work of art, a masterpiece divine,\nA living canvas where each color looms,\nA precious gift, a treasure to enshrine.\n\nSo let us cherish every soul we meet,\nAnd celebrate the colors they display,\nFor in their vibrant hues, we'll find a treat,\nA beauty that will never fade away.");
  }


const drawFlowers = (hue, saturation, brightness) => {
  // 更新全局颜色变量
  this.hue = hue;
  this.saturation = saturation;
  this.brightness = brightness
};


  


function displayMessageBox(message) {
  const messageBoxWidth = 300;
  const messageBoxHeight = 200;
  const messageBoxX = (width - messageBoxWidth) / 2.3;
  const messageBoxY = (height - messageBoxHeight) / 3;

  // 绘制对话框背景
  /*fill(240);
  stroke(0);
  strokeWeight(2);
  rect(messageBoxX, messageBoxY, messageBoxWidth, messageBoxHeight, 20);*/

  // 绘制文本
  textSize(22);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(message, messageBoxX + messageBoxWidth / 2, messageBoxY + messageBoxHeight / 2);
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

  if (currentString.includes('buttonA')) {
    for (let i = 0; i < maxFlowers; i++) {
      const hue = Hue.length > 0 ? random(Hue) : 0;
      const saturation = Saturation.length > 0 ? random(Saturation) : 0;
      const brightness = Brightness.length > 0 ? random(Brightness) : 0;
      flowers.push(new Flower(random(width), random(height), random(0.5, 1.5), hue, saturation, brightness));
    }
  }
  if (currentString.includes('buttonB')) {
    for (let i = 0; i < maxFlowers; i++) {
      const hue = HueEmotion.length > 0 ? random(HueEmotion) : 0;
      const saturation = SaturationEmotion.length > 0 ? random(SaturationEmotion) : 0;
      const brightness = BrightnessEmotion.length > 0 ? random(BrightnessEmotion) : 0;
      flowers.push(new Flower(random(width), random(height), random(0.5, 1.5), hue, saturation, brightness));
    }
  }
}
