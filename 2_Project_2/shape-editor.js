"use strict";

var globalCanvasID = "webgl-canvas";
var gl;

// NON-CRITICAL VARIABLES START

var NumVertices = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

// NON-CRITICAL VARIABLES END

window.onload = function init() {

  // ERROR HANDLING START
  if (document.getElementById(globalCanvasID) == null) {
    console.error(
      "Cube:",
      "Canvas with ID '" + globalCanvasID + "' not found."
    );
    return;
  }

  var resources = new WebGLResources(globalCanvasID);
  var utilities = resources.WebGLUtils;
  gl = utilities.setupWebGL();
  var canvasDimensions = resources.canvasDimensions();

  if (!gl) {
    console.error("Cube:", "init(): WebGL isn't available.");
  }
  // ERROR HANDLING END

  colorCube();

  gl.viewport(0, 0, canvasDimensions.width, canvasDimensions.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  var program = resources.initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, linearFlatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, linearFlatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  //event listeners for buttons

  document.getElementById("xButton").onclick = function () {
    axis = xAxis;
  };
  document.getElementById("yButton").onclick = function () {
    axis = yAxis;
  };
  document.getElementById("zButton").onclick = function () {
    axis = zAxis;
  };

  render();
};

/**
 * Colors the cube by drawing six quadrilaterals.
 */
function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

/**
 * Creates two triangles from the given indices and adds them to the points and colors arrays.
 * @param {number} a - The index of the first vertex.
 * @param {number} b - The index of the second vertex.
 * @param {number} c - The index of the third vertex.
 * @param {number} d - The index of the fourth vertex.
 */
function quad(a, b, c, d) {
  var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
  ];

  var vertexColors = [
    [0.0, 0.0, 0.0, 1.0], // black
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 1.0, 0.0, 1.0], // yellow
    [0.0, 1.0, 0.0, 1.0], // green
    [0.0, 0.0, 1.0, 1.0], // blue
    [1.0, 0.0, 1.0, 1.0], // magenta
    [0.0, 1.0, 1.0, 1.0], // cyan
    [1.0, 1.0, 1.0, 1.0], // white
  ];

  // We need to partition the quad into two triangles in order for
  // WebGL to be able to render it.  In this case, we create two
  // triangles from the quad indices

  //vertex color assigned by the index of the vertex

  var indices = [a, b, c, a, c, d];

  for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]]);
    //colors.push( vertexColors[indices[i]] );

    // for solid colored faces use
    colors.push(vertexColors[a]);
  }
}

/**
 * Renders the scene by clearing the color and depth buffers, updating the rotation angles,
 * setting the uniform variable for rotation angles, and drawing the triangles.
 * This function is called recursively using requestAnimationFrame for smooth animation.
 */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  theta[axis] += 2.0;
  gl.uniform3fv(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

  requestAnimFrame(render);
}
