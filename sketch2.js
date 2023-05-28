let sakuraArray = [];
let fadeOutStartTime;
let dialogClicked = false;
let dialogText = "Cherry blossom rain drifts towards Monet's shop window,\nThe colors of nature are the best gift to Impressionist painters,\nIn Fife, you can also use the elements on or around you as pigments to create your own abstract impressionist painting,\nOpen your camera, place any colored object in front, or simply extract color elements from yourself by doing nothing, \nand you will obtain an abstract painting that belongs to your own physical elements, \nClick to START"; // 对话框文本内容
let dialogVisible = true; // 对话框是否可见
let dialogX, dialogY; // 对话框位置
let dialogAlpha = 255; // 对话框透明度

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 创建樱花粒子
  for (let i = 0; i < 100; i++) {
    let sakura = new Sakura(random(width), random(height, height * 2), random(10, 20));//random 修改大小
    sakuraArray.push(sakura);
  }
  dialogX = width / 2 - 100;
  dialogY = height / 2 - 50;

  //画布
  video = createCapture(VIDEO, function() {
    streamReady = true;
  });
  video.size(width * pixelDensity(), height * pixelDensity());
  video.hide();
  noFill();
  streamReady = false;
  drawingLines = false;
  
}

function draw() {
  clear();
  // 更新和绘制所有的樱花粒子
  for (let i = 0; i < sakuraArray.length; i++) {
    let sakura = sakuraArray[i];
    sakura.update();
    sakura.display();
  }
  
  // 显示对话框
  if (dialogVisible) {
    fill(255, 255, 255, dialogAlpha);//修改对话框背景颜色和透明度
    rect(dialogX, dialogY, 200, 100, 10);//修改对话框的位置和大小，以及圆角矩形的半径
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0, 0, 0, dialogAlpha);//修改对话框文本的颜色和透明度
    text(dialogText, dialogX + 100, dialogY + 50);//修改对话框文本的内容和位置。
  }
  
  // 淡出效果
  if (dialogClicked) {
    let fadeOutProgress = (millis() - fadeOutStartTime) / 5000; // 用5000毫秒（5秒）来完成淡出
    fadeOutProgress = constrain(fadeOutProgress, 0, 1); // 限制淡出进度在0到1之间
    let alpha = 255 * (1 - fadeOutProgress);
    for (let i = 0; i < sakuraArray.length; i++) {
      sakuraArray[i].setAlpha(alpha);
    }
    if (fadeOutProgress >= 1) {
      dialogVisible = false;
      window.location.href = "color.html";
    }    
  }
}

function mouseClicked() {
  if (dialogVisible && mouseX > dialogX && mouseX < dialogX + 200 && mouseY > dialogY && mouseY < dialogY + 100) {
    dialogClicked = true;
    fadeOutStartTime = millis(); // 记录淡出开始的时间
  }
}

class Sakura {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fallSpeed = random(1, 3);
    this.angle = random(-PI / 8, PI / 8);
    this.petalSize = size;
    this.petalAngle = TWO_PI / 5;
    this.alpha = 255;
  }

  update() {
    // 更新樱花的位置和状态
    this.y -= this.fallSpeed;
    this.size *= 0.98;  // 每次更新时将樱花大小缩小 2%
    this.x += sin(this.angle) * 2;
    this.angle += random(-0.05, 0.05);
    // 如果樱花已经超出了屏幕范围，就重置它的位置和大小
    if (this.y < -this.size || this.x < -this.size || this.x > width + this.size) {
    this.y = height + this.size;
    this.x = random(width);
    this.size = random(30, 50);
    }
    }
    
    display() {
    // 绘制樱花
    noStroke();
    fill(255, 192, 203, this.alpha);
    let angle = this.angle;
    for (let i = 0; i < 5; i++) {
    let angle = i * this.petalAngle;
    let x1 = this.x + this.petalSize * cos(angle - this.petalAngle / 2);
    let y1 = this.y + this.petalSize * sin(angle - this.petalAngle / 2);
    let x2 = this.x + this.petalSize * cos(angle + this.petalAngle / 2);
    let y2 = this.y + this.petalSize * sin(angle + this.petalAngle
    / 2);
    let cx = this.x + this.petalSize * 0.6 * cos(angle);
    let cy = this.y + this.petalSize * 0.6 * sin(angle);
    arc(cx, cy, this.petalSize * 1.2, this.petalSize * 1.2, angle - this.petalAngle / 2, angle + this.petalAngle / 2, PIE);
    triangle(this.x, this.y, x1, y1, cx, cy);
    triangle(this.x, this.y, cx, cy, x2, y2);
    }
    // 绘制花蕊
    fill(255, 153, 204, this.alpha);
    ellipse(this.x, this.y, this.size * 2 / 3, this.size * 2 / 3);
    // 绘制花蕊芯线
    stroke(255, 255, 0, this.alpha);
    strokeWeight(2);
    let numLines = 5;
    for (let i = 0; i < numLines; i++) {
    let angle = i * TWO_PI / numLines;
    let startX = this.x + this.petalSize * 0.5 * cos(angle);
    let startY = this.y + this.petalSize * 0.5 * sin(angle);
    let endX = this.x + this.petalSize * 0.3 * cos(angle);
    let endY = this.y + this.petalSize * 0.3 * sin(angle);
    line(startX, startY, endX, endY);
    }
    }
    
    // 设置樱花透明度
    setAlpha(alpha) {
    this.alpha = alpha;
    }
    }

    