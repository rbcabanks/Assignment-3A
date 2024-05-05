// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix* u_ProjectionMatrix* u_GlobalRotateMatrix* u_ModelMatrix * a_Position;\n' +
  //'gl_Position =a_Position;\n'+
  '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV; \n'+
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor; 
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  uniform float u_texColorWeight;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){
      gl_FragColor=vec4(v_UV,1,1);
    }
    else if(u_whichTexture == 0){
      float t= u_texColorWeight;
      vec4 texColor=texture2D(u_Sampler0,v_UV);
      vec4 baseColor=vec4(0,1,0,1);
      gl_FragColor = t*baseColor+t*texColor;
    }
    else{
      gl_FragColor=vec4(1,.2,.2,1);
    }

  }`; 
  
// global variables
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let canvas;
let display2;
let gl;
let rgba;
let a_Position;
let u_FragColor;
let u_Size;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_segment=10;
let g_width=0.0;
let g_height=0.0;
let g_fliph=false;
let g_flipv=false;
let g_eql=false
var g_shapesList = [];
let bonsaiSaveArray=[]
let refImage=document.getElementById('img2')
let u_ModelMatrix;
let g_rLeg=15;
let g_lLeg=15;
let wings=10;
let animate=false;
let moveUp; 
let moveBack; 
let moveBackL; 
let aboveN=1.8; 
let aboveN2=1.8; 
var k=.03
let moveBottom;
let checkgr=0;
let rotateNr=0;
let checkg=0;
let rotateN=0;
let moveBottomL;
let u_Sampler0;

let u_texColorWeight;
let a_UV;



let gAnimalGlobalRotation=0; // was 40
function addActionsForUI() { // used this resource "https://www.w3schools.com/howto/howto_js_rangeslider.asp"
 //document.getElementById('camera').addEventListener('mousemove', function () {gAnimalGlobalRotation=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 document.getElementById('rLeg').addEventListener('mousemove', function () {g_rLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 document.getElementById('lLeg').addEventListener('mousemove', function () {g_lLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 document.getElementById('wings').addEventListener('mousemove', function () {wings=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 document.getElementById('on').onclick = function () {animate=true};
 document.getElementById('off').onclick = function () {animate=false};
}


function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // magic runtime code

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  if (!u_texColorWeight) {
    console.log('Failed to get the storage location of u_texColorWeight');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  
}

function updateAnimationAngles(){
  if(animate==true){
    g_rLeg=45*Math.sin(g_seconds*6);
    wings=10*Math.sin(g_seconds*2);
    g_lLeg=-45*Math.sin(g_seconds*6);
  }
}
function renderScene(){

  let translateAll=0;
  var startTime=performance.now();
  updateAnimationAngles();
  renderAllShapes();
  
  //gl.uniform1i(u_texColorWeight,0.8);

  let translateM= new Matrix4();
  let rotateM= new Matrix4();
  let scaleM= new Matrix4();
  let modelMatrix = new Matrix4();

  let uv=[
    0,0,0,1,1,1,
    0,0,1,1,1,0,
  ]
  
  translateM.setTranslate(0,-1.8,0);
  modelMatrix.multiply(translateM);
  scaleM.setScale(30,1,32);
  modelMatrix.multiply(scaleM);
  translateM.setTranslate(-.5,0,-.5);
  modelMatrix.multiply(translateM);
  rgba=[.1,.1,.7,1];
  //let modelMatrix=new Matrix4();
  drawCube(modelMatrix);

  modelMatrix = new Matrix4();
  translateM=new Matrix4();
  scaleM= new Matrix4();

  translateM.setTranslate(0,.5,+translateAll);
  rotateM.setRotate(5,-.1,0,0);
  scaleM.setScale(.13,.1,.15);
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[1,.1,.7,1];
  //head (1)
  //drawCube(modelMatrix);
  drawCubeUV(modelMatrix,uv);
  translateM.setTranslate(0,.5,-.3+translateAll);
  //rotateM.setRotate(5,-.1,0,0);
  scaleM.setScale(1.1,.2,.2);
  modelMatrix.multiply(translateM);
  //modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.01,.01,.01,1];
  //eyes (2)

  gl.uniform1i(u_whichTexture,-2);
  drawCube(modelMatrix);
  

  //beak (3)
  translateM.setTranslate(0,.48,-.18+translateAll);
  rotateM.setRotate(-5,.1,0,0);
  scaleM.setScale(.07,.06,.03);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.7,.7,.7,1];
  drawCube(modelMatrix);

  //beak (white front) (4)
  translateM.setTranslate(0,.50,-.27+translateAll);
  rotateM.setRotate(-5,.1,0,0);
  scaleM.setScale(.07,.02,.07);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.7,.7,.7,1];
  drawCube(modelMatrix);

  //beak (black) (5)
  translateM.setTranslate(0,.42,-.3+translateAll);
  rotateM.setRotate(-5,.1,0,0);
  scaleM.setScale(.07,.07,.03);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.02,.02,.02,1];
  drawCube(modelMatrix);

  //beak (black) (6)
  translateM.setTranslate(0,.40,-.25+translateAll);
  rotateM.setRotate(-5,.1,0,0);
  scaleM.setScale(.07,.07,.06);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.02,.02,.02,1];
  drawCube(modelMatrix);
  

  //neck (7)
  translateM.setTranslate(0,.2,.025+translateAll);
  rotateM.setRotate(10,.1,0,0);
  scaleM.setScale(.07,.27,.07);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.9,.1,.7,1];
  drawCube(modelMatrix);

  //body (8)
  translateM.setTranslate(0,-.06,.2+translateAll);
  scaleM.setScale(.165,.18,.26);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  //modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.8,.1,.6,1];
  drawCube(modelMatrix);

  
  if(wings==10){
    moveUp=0;
  }
  else{
    moveUp=(wings-10)/1200;
  }
  //left wing bottom (9)
  translateM.setTranslate(-.2-moveUp/2,-.04+moveUp,.2+translateAll);
  rotateM.setRotate(5+wings/2,0,0,-.15);
  scaleM.setScale(.02,.16,.26);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.8,.1,.5,1];
  drawCube(modelMatrix);

  //right wing bottom (10)
  translateM.setTranslate(.2+moveUp/2,-.04+moveUp,.2+translateAll);
  rotateM.setRotate(-(5+wings/2),0,0,-.15);
  scaleM.setScale(.02,.16,.26);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.8,.1,.5,1];
  drawCube(modelMatrix);

  if(g_lLeg==15){
    moveBackL=0;
  }
  else{
    moveBackL=(g_lLeg-15)/500;
  }

  //right leg (11)
  if(g_rLeg==15){
    moveBack=0;
  }
  else{
    moveBack=(g_rLeg-15)/500;
  }

  translateM.setTranslate(.055,-.3,.25+(moveBack)+translateAll);
  rotateM.setRotate(g_rLeg,-.5,0,0);
  scaleM.setScale(.03,.17,.03);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.6,.3,.6,1];
  drawCube(modelMatrix);
  
  //right joint (12)
  var rLegMatrix=new Matrix4();
  rLegMatrix.set(modelMatrix);
  rLegMatrix.scale(1.6,.28, 1.7);
  rLegMatrix.translate(0,-2.6,0+translateAll);
  rLegMatrix.rotate(g_rLeg/1.5,.5,0,0);
  rgba=[.8,.1,.6,1];
  drawCube(rLegMatrix);

  
  //right bottom part of leg (13)
  if(g_rLeg>3){
    if(checkgr<.26){
      checkgr=g_rLeg/500
      rotateNr=g_rLeg
      moveBottom=0;
    }
  }
  else if(-3<g_rLeg<3){
    checkgr=-g_rLeg/670
    rotateNr=g_rLeg*-.6;
    if(moveBottom>-.3){
      moveBottom=g_rLeg/160;
    }
  }

  translateM.setTranslate(.055,-.6+(checkgr),.25+(moveBottom)+translateAll);
  rotateM.setRotate(rotateNr,1,0,0);
  rLegMatrix.scale(.8,1, .8);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.6,.3,.6,1];
  drawCube(modelMatrix);

  
  let footr=new Matrix4();
  footr.set(modelMatrix);
  footr.translate(0,-1,-.9+translateAll);
  footr.scale(1,.1,3.1);
  rgba=[.6,.3,.6,1];
  drawCube(footr);

//-------------------------------------------------------------------
  translateM.setIdentity();
  scaleM.setIdentity();
  rotateM.setIdentity();

  //left leg (14)
  translateM.setTranslate(-.055,-.3,.25+(moveBackL)-translateAll);
  rotateM.setRotate(g_lLeg,-.5,0,0);
  scaleM.setScale(.03,.17,.03);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.6,.3,.6,1];
  drawCube(modelMatrix);


  //left joint (15)
  var lLegMatrix=new Matrix4();
  lLegMatrix.set(modelMatrix);
  lLegMatrix.scale(1.6,.28, 1.8);
  lLegMatrix.translate(0,-2.6,0-translateAll);
  lLegMatrix.rotate(g_lLeg/1.5,.5,0,0);
  rgba=[.8,.1,.6,1];
  drawCube(lLegMatrix);

  //left bottom part of leg (16)
  if(g_lLeg>3){
    if(checkg<.26){
      checkg=g_lLeg/500
      rotateN=g_lLeg
      moveBottomL=0;
    }
  }
  else if(-3<g_lLeg<3){
    checkg=-g_lLeg/670
    rotateN=g_lLeg*-.6;
    if(moveBottomL>-.3){
      moveBottomL=g_lLeg/160;
    }
  }

  translateM.setTranslate(-.055,-.6+(checkg),.25+(moveBottomL)-translateAll);
  rotateM.setRotate(rotateN,1,0,0);
  scaleM.setScale(.03,.17,.03);
  modelMatrix.setIdentity();
  modelMatrix.multiply(translateM);
  modelMatrix.multiply(rotateM);
  modelMatrix.multiply(scaleM);
  rgba=[.6,.3,.6,1];
  drawCube(modelMatrix);

  let footl=new Matrix4();
  footl.set(modelMatrix);
  footl.translate(0,-1,-.9-translateAll);
  footl.scale(1,.1,3.1);
  rgba=[.6,.3,.6,1];
  drawCube(footl);


  var duration = performance.now()-startTime;
  sendTextToHTML(("ms:" + Math.floor(duration)+" fps:"+ Math.floor(10000/duration)/10), "numdot")

}
function renderAllShapes() {
  //var startTime = performance.now();
  
  var globalRotMat=new Matrix4().rotate(gAnimalGlobalRotation,0,1,0);
  //var globalRotMat=new Matrix4().rotate(0,0,0,0);
  //var globalRotMat=new Matrix4().rotate(30,-1,-4,0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

  var xformMatrix = new Matrix4();
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); //
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, xformMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

}
function sendTextToHTML(text,htmlID){
  var htmlElm=document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID+" from HTML");
    return;
  }
  htmlElm.innerHTML=text;
}

//from textbook

function initTextures(gl, n) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler0, image); };
  // Tell the browser to load an image
  image.src = 'sky.jpg';

  return true;
}
//send texture to glsl
function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function keydown(ev) {
  if(ev.keyCode == 87) { // The w key was pressed
    camera.moveForward();
  } else 
  if (ev.keyCode == 84) { // The s key was pressed
    camera.moveBackward();
  } else { return; }
  if (ev.keyCode == 81) { // The q key was pressed
    camera.moveLeft();
  } else { return; }
  if (ev.keyCode == 69) { // The e key was pressed
    camera.moveRight();
  } else { return; }
  initTextures(gl,0);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForUI();

  camera=new Camera(canvas.width/canvas.height,.1,1000);
  document.onkeydown=function(ev){keydown(ev);};

  //gl.uniformMatrix4fv(u_ViewMatrix,false,camera.viewMatrix.elements);
  //gl.uniformMatrix4fv(u_ProjectionMatrix,false,camera.projectionMatrix.elements);


  initTextures(gl,0);
  gl.enable(gl.DEPTH_TEST);
  // Specify the color for clearing <canvas>  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  requestAnimationFrame(tick);
} 

var g_startTime=performance.now()/1000;
var g_seconds=performance.now()/1000-g_startTime;

function tick(){
  g_seconds=performance.now()/1000-g_startTime;
  renderScene();
  requestAnimationFrame(tick);
}