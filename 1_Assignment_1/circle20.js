/**
 * @fileOverview Renders a canvas and its elements with WebGL.
 *
 * This file assumes that the following files are included in the HTML file:
 * .shared.js
 */

// In case you have a hard time finding the circles, limit their radii here.
const maximumPercentageRadius = 1.00;
const minimumPercentageRadius = 0.01;

// Control blending here.
const blending = true;

var gl;
const numCircles = 10;
const numSides = 360; // Also number of triangles needed.
// three points per triangle per circle.
const numPoints = numSides * numCircles * 3;
const triangleThetaInRadians = (360 / numSides) * (Math.PI / 180);

/**
 * This function is called when the HTML file is loaded. It initializes the
 * WebGL canvas and renders the provided canvas elements.
 * @returns { void }
 */
window.onload = function init() {

  // Set up the WebGL canvas. If WebGL isn't available, display an error
  // message for the user.
  gl = WebGLUtils.setupWebGL();
  if (!gl) {
    showErrorText(
      "WebGL isn't available on your browser or with your current computer."
    );
  }

  // An array of points to be rendered on the canvas.
  var points = [];
  var colors = [];

  for (var i = 0; i < numCircles; i++) {

    // Add the color for the triangle.
    var color = randomRGBAColor();
    var percentageRadius =
    randomNumber(false, maximumPercentageRadius, minimumPercentageRadius);
    var originPixelPoint = random2DCoordinate();
    var alphaValue = 1 - (1 / numCircles) * i;

    // Fill the points array with coordinates.
    for (var j = 0; j < numSides; j++) {
        var triangle = Math.floor(j);
        var point1AngleInRadians = triangleThetaInRadians * triangle;
        var point2AngleInRadians = triangleThetaInRadians * (triangle + 1);
        var point1 = {
            x: originPixelPoint.x + percentageRadius * Math.cos(point1AngleInRadians),
            y: originPixelPoint.y + percentageRadius * Math.sin(point1AngleInRadians)
        };

        var point2 = {
            x: originPixelPoint.x + percentageRadius * Math.cos(point2AngleInRadians),
            y: originPixelPoint.y + percentageRadius * Math.sin(point2AngleInRadians)
        };

        points.push(originPixelPoint.x, originPixelPoint.y);
        points.push(point1.x, point1.y);
        points.push(point2.x, point2.y);

        colors.push(color.red, color.green, color.blue, alphaValue);
        colors.push(color.red, color.green, color.blue, alphaValue);
        colors.push(color.red, color.green, color.blue, alphaValue);

    }
  }

  // Set up the canvas.
  const dimensions = canvasDimensions();
  gl.viewport(0, 0, dimensions.width, dimensions.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Initialize the shaders.
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load the data into the GPU.
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  // Associate the shader variables with the buffer data.
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  var a_Color = gl.getAttribLocation(program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  if (blending) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  // Render the points.
  render();
};

function render() {

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the points.
  gl.drawArrays(gl.TRIANGLES, 0, numPoints);
}
