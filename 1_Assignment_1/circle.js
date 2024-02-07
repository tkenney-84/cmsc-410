/**
 * @fileOverview Renders a canvas and its elements with WebGL.
 *
 * This file assumes that the following files are included in the HTML file:
 * .shared.js
 */

var gl;
const numSides = 360; // Also number of triangles needed.
const numPoints = numSides * 3; // three points per triangle. 8*3=24
const originPixelPoint = { x: 0.0, y: 0.0 };
const percentageRadius = 0.75;
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

  // Fill the points array with coordinates.
  for (var i = 0; i < numSides; i++) {
    const triangle = Math.floor(i);
    const point1AngleInRadians = triangleThetaInRadians * triangle;
    const point2AngleInRadians = triangleThetaInRadians * (triangle + 1);
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
  }

  // Convert the points array to a Float32Array.
  const finalArray = new Float32Array(points);

  // Set up the canvas.
  const dimensions = canvasDimensions();
  gl.viewport(0, 0, dimensions.width, dimensions.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Initialize the shaders.
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Set the fragment color with a uniform.
  const color = randomRGBAColor();
  var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
  gl.uniform4f(u_FragColor, color.red, color.green, color.blue, color.alpha);

  // Load the data into the GPU.
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, finalArray, gl.STATIC_DRAW);

  // Associate the shader variables with the buffer data.
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Render the points.
  render();
};

function render() {

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the points.
  gl.drawArrays(gl.TRIANGLES, 0, numPoints);
}
