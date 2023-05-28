let newData = [];
let newData2 = [];
let newData3 = []


var video;
var c;
var x1, x2, x3, y1, y2, y3;
var curvePointX = 0;
var curvePointY = 0;
var counter;
var maxCounter = 10000;
var streamReady = false;
var colorInfoDiv;
var operationInfoDiv; // 操作提示框元素

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


    // 创建画布并设置大小
    createCanvas(1000, 500);
  
    // 绘制白色背景和黑色矩形框架
    background(255);
    stroke(0);
    strokeWeight(10);
    noFill();
    rect(0, 0, width, height);
  
    // 创建一个容器元素，将画布元素添加到其中
    var container = select('.canvas-container');
    container.child(canvas);
  
    video = createCapture(VIDEO, function() {
      streamReady = true;
    });
    video.size(width * pixelDensity(), height * pixelDensity());
    video.hide();
    noFill();
  
    x1 = 0;
    y1 = height / 2;
    x2 = width / 2;
    y2 = 0;
    x3 = width;
    y3 = height / 2;
  
    // 创建一个按钮并为其添加一个点击事件监听器
    var button = createButton("SHOW THE LAST THREE COLORS");
    button.mousePressed(displayColorInfo);
    button.position(width / 2 - button.width / 2, height + 70);
  
    colorInfoDiv = select('#color-info');
    colorInfoDiv.hide();

    // 创建一个新按钮并为其添加点击事件监听器
newButton = createButton('Send Your Physical Icon Color');
newButton.mousePressed(async () => {
  await window.pushHueToFirebase();
  await window.pushSaturationToFirebase();
  await window.pushBrightnessToFirebase();
  console.log("Color data sent to Firebase.");
});
newButton.position(width + 80, height - 20);


    // 创建操作提示框并设置样式
  operationInfoDiv = createDiv('Delet(buttonA):Clear Screen, S(buttonB):Save the picture, Q:stop, W:continue');
  operationInfoDiv.style('position', 'absolute');
  operationInfoDiv.style('top', '10px');
  operationInfoDiv.style('left', (width / 2 - 50) + 'px');
  operationInfoDiv.style('background-color', '#fff');
  operationInfoDiv.style('padding', '5px');
  operationInfoDiv.style('box-shadow', '0 2px 4px rgba(0,0,0,.3)');
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
  if (currentString.includes('buttonA')) clear();
  if (currentString.includes('buttonB')) save('canvas-' + Date.now() + '.png'); // 使用 save() 函数保存画布
}





function getHSVInfo(x, y) {
    var c = color(video.get(x, y));
    var cHSV = chroma(red(c), green(c), blue(c));
    return {
      hue: cHSV.get("hsv.h"),
      saturation: cHSV.get("hsv.s") * 100, // 将范围调整为 0 到 100
      brightness: cHSV.get("hsv.v") * 100, // 将范围调整为 0 到 100
    };
  }  

  //绘制色块
  function drawColorCircle(color, x, y, diameter) {
    push();
    fill(color);
    noStroke();
    ellipse(x, y, diameter, diameter);
    pop();
  }
  
  
  function displayColorInfo() {
    if (streamReady) {
      var line1Info = getHSVInfo(x1, y1);
      var line2Info = getHSVInfo(x2, y2);
      var line3Info = getHSVInfo(x3, y3);
  
      // 获取颜色的 RGB 值
      var line1Color = color(video.get(x1, y1));
      var line2Color = color(video.get(x2, y2));
      var line3Color = color(video.get(x3, y3));
  
      // 创建一个 div 元素来显示颜色信息，并设置样式
      colorInfoDiv = createDiv('');
      colorInfoDiv.style('position', 'absolute');
      colorInfoDiv.style('top', '50px'); // 将 div 元素放置在画布顶部
      colorInfoDiv.style('left', (width + 80) + 'px'); // 将 div 元素放置在画布右侧
      colorInfoDiv.style('width', '200px');
      colorInfoDiv.style('background-color', '#fff');
      colorInfoDiv.style('padding', '10px');
      colorInfoDiv.style('box-shadow', '0 2px 4px rgba(0,0,0,.3)');
      colorInfoDiv.style('text-align', 'center');
      colorInfoDiv.style('font-size', '14px');
  
      colorInfoDiv.html(
        'Color 1：<br>' +
        'Hue: ' + line1Info.hue.toFixed(2) + '<br>' +
        'Saturation: ' + line1Info.saturation.toFixed(2) + '<br>' +
        'Brightness: ' + line1Info.brightness.toFixed(2) +
        '<br><span style="background-color:' + line1Color + '; display:inline-block; width:50px; height:50px; border-radius:25px;"></span><br><br>' +
  
        'Color 2：<br>' +
        'Hue: ' + line2Info.hue.toFixed(2) + '<br>' +
        'Saturation: ' + line2Info.saturation.toFixed(2) + '<br>' +
        'Brightness: ' + line2Info.brightness.toFixed(2) +
        '<br><span style="background-color:' + line2Color + '; display:inline-block; width:50px; height:50px; border-radius:25px;"></span><br><br>' +
  
        'Color 3：<br>' +
        'Hue: ' + line3Info.hue.toFixed(2) + '<br>' +
        'Saturation: ' + line3Info.saturation.toFixed(2) + '<br>' +
        'Brightness: ' + line3Info.brightness.toFixed(2) +
        '<br><span style="background-color:' + line3Color + '; display:inline-block; width:50px; height:50px; border-radius:25px;"></span>'
      );
    }
  }  
  


function draw() {
  if (streamReady) {
    drawLines();

    counter++;
  }
}

function drawLines() {
    // 绘制第一条线段
    c = color(video.get(x1, y1)); // 获取摄像头当前像素的颜色值
    var cHSV = chroma(red(c), green(c), blue(c)); // 将颜色值转换为HSV格式
    var hueValue = cHSV.get('hsv.h'); // 获取颜色的hue值
    strokeWeight(hueValue / 50); // 根据hue值设置线条宽度
    stroke(c); // 设置线条颜色
  
    beginShape();
    curveVertex(x1, y1);
    curveVertex(x1, y1);
    for (var i = 0; i < 7; i++) {
      curvePointX = constrain(x1 + random(-50, 50), 0, width - 1); // 随机生成曲线控制点的x坐标
      curvePointY = constrain(y1 + random(-50, 50), 0, height - 1); // 随机生成曲线控制点的y坐标
      curveVertex(curvePointX, curvePointY); // 添加曲线控制点
    }
    curveVertex(curvePointX, curvePointY);
    endShape();
    x1 = curvePointX;
    y1 = curvePointY;

    // 更新全局变量
  window.hue = hueValue;
  window.saturation = saturationValue * 100;
  window.brightness = brightnessValue * 100;
  
    // 绘制第二条线段
    c = color(video.get(x2,y2));
    cHSV = chroma(red(c), green(c), blue(c));
    var saturationValue = cHSV.get('hsv.s'); // 获取颜色的饱和度
    strokeWeight(saturationValue / 2);
    stroke(c);

    beginShape();
    curveVertex(x2, y2);
    curveVertex(x2, y2);
    for (var i = 0; i < 7; i++) {
      curvePointX = constrain(x2 + random(-50, 50), 0, width - 1);
      curvePointY = constrain(y2 + random(-50, 50), 0, height - 1);
      curveVertex(curvePointX, curvePointY);
    }
    curveVertex(curvePointX, curvePointY);
    endShape();
    x2 = curvePointX;
    y2 = curvePointY;

    // 更新全局变量
  window.hue = hueValue;
  window.saturation = saturationValue * 100;
  window.brightness = brightnessValue * 100;

    // 绘制第三条线段
    c = color(video.get(x3, y3));
    cHSV = chroma(red(c), green(c), blue(c));
    var brightnessValue = cHSV.get('hsv.v'); // 获取颜色的明度
    strokeWeight(brightnessValue / 100);
    stroke(c);

    beginShape();
    curveVertex(x3, y3);
    curveVertex(x3, y3);
    for (var i = 0; i < 7; i++) {
      curvePointX = constrain(x3 + random(-50, 50), 0, width - 1);
      curvePointY = constrain(y3 + random(-50, 50), 0, height - 1);
      curveVertex(curvePointX, curvePointY);
    }
    curveVertex(curvePointX, curvePointY);
    endShape();
    x3 = curvePointX;
    y3 = curvePointY;

  // 更新全局变量
  window.hue = hueValue;
  window.saturation = saturationValue * 100;
  window.brightness = brightnessValue * 100;
}

function keyReleased() {
    if (keyCode == DELETE || keyCode == BACKSPACE) clear();
    if (key == 's' || key == 'S') save('canvas-' + Date.now() + '.png'); // 使用 save() 函数保存画布
    if (key == 'q' || key == 'Q') noLoop();
    if (key == 'w' || key == 'W') loop();
  }



  function someFunction() {
    // 
  }
  