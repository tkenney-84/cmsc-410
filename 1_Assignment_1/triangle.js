/**
 * @fileOverview Renders a canvas and its elements with WebGL.
 *
 * This file assumes that the following files are included in the HTML file:
 * .shared.js
 */

var gl;
const numPoints = 3;

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
  for (var i = 0; i < numPoints; i++) {
    var coordinate = random2DCoordinate();
    points.push(coordinate.x, coordinate.y);
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
  var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

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
