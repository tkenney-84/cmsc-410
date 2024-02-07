/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

/**
 * @fileOverview This file is a refactored, functional combination of the
 * initShaders.js, webgl-utils.js, and MV.js files from the provided triangle
 * example.
 *
 * Primary Author:
 * @author Dr. Abdulrahman Abumurad
 *
 * Compilation, Refactoriziation, & Custom Scripts by:
 * @author Mr. Tyler J. Kenney
 *
 * @version 2024.02.06.2239
 * @license GNU GPL v3
 */

// The id of the canvas element for every HTML file this script is included in.
// If your canvas ID is different, simply change this value to match.
const globalCanvasID = "gl-canvas";

/* ############################################################
   ###################### ERROR HANDLING ######################
   ############################################################ */

/**
  * Builds the HTML element which displays any error messages.
  * @param  { string } canvasContainerId id of container of the canvas.
  * @return { string } The html.
  */
var buildErrorHTML = function (msg) {

  // The button element is placed within an h1 element for the margins.
  // This decision is purely for aesthetics and can be changed.
  return (
    '<h1 class="error-text">Error</h1>' +
    '<p class="error-text">' +
    msg +
    '</p><h1>' +
    '<button class="reload-button" onclick="reloadPage()">' +
    'Reload Page' +
    '</button></h1>'
  );
};

/**
  * Adds an error message to the parent container of the canvas.
  * @param { string } msg. The error message to display.
  */
function showErrorText(msg) {

  // Get the canvas from the DOM.
  const canvas = document.getElementById(globalCanvasID);

  // Get the parent container of the canvas.
  var parentContainer = canvas.parentNode;

  // If the parent container exists, add the error message to it.
  if (parentContainer) {
    parentContainer.innerHTML = buildErrorHTML(msg);
  }
}

/* ############################################################
   ################### WEBGL INITIALIZATION ###################
   ############################################################ */

WebGLUtils = ( function () {

  /**
   * Message suggesting the user get a browser which runs WebGL.
   * @type { string } The message.
   */
  const GET_A_WEBGL_BROWSER =
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

  /**
   * Message suggesting the user does not have sufficient hardware to run WebGL.
   * @type { string } The message.
   */
  const HARDWARE_PROBLEM =
    'It appears your computer is unable to run WebGL.<br/>' +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

  /**
   * Creates a webgl context. If creation fails, it will
   * change the contents of the parent container of the <canvas>
   * tag to an error message with the correct links for WebGL.
   * @param  { WebGLContextCreationAttributes } opt_attribs. Any creation
   *                                            attributes you want to pass in.
   * @return { WebGLRenderingContext } The created context.
   */
  var setupWebGL = function (opt_attribs) {

    // Get the canvas from the DOM.
    const canvas = document.getElementById(globalCanvasID);

    // If the browser does not support WebGL, display an error message and
    // return null.
    if (!window.WebGLRenderingContext) {
      showErrorText(GET_A_WEBGL_BROWSER);
      return null;
    }

    // Create a webgl context.
    var context = create3DContext(opt_attribs);

    // If the context was not created, display an error message.
    if (!context) {
      showErrorText(HARDWARE_PROBLEM);
    }

    // Return the created context. If it was not successfully created, this
    // will be null.
    return context;
  };

  /**
   * Creates a 3D webgl context.
   * @param  { WebGLContextCreationAttributes } opt_attribs. Any creation
   *                                            attributes you want to pass in.
   * @return { !WebGLContext } The created context.
   */
  var create3DContext = function (opt_attribs) {

    // Get the canvas from the DOM.
    const canvas = document.getElementById(globalCanvasID);

    // An array of possible WebGL context names across different browsers.
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

    // The context to be returned. Starts as null.
    var context = null;

    // Loop through the names array and attempt to create a context with each
    // name. If a context is created, break out of the loop.
    for (var i = 0; i < names.length; ++i) {

      // Attempt to create a context with the current name.
      try {
        context = canvas.getContext(names[i], opt_attribs);
      } catch (e) {
        // Do nothing. This is expected for some names.
      }

      // If a context was created, break out of the loop.
      if (context) {
        break;
      }
    }

    // Return the created context. If no context was created, this will be null.
    return context;
  };

  // End of setupWebGL.
  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL,
  };

}) (); // End of WebGLUtils.

/**
 * This is a cross-browser implementation of the requestAnimationFrame method.
 *
 * requestAnimationFrame is a method that tells the browser you wish to perform
 * an animation and requests that the browser call a specified function to
 * update an animation before the next repaint. This method is a better choice
 * for animation than setInterval or setTimeout because it's more efficient and
 * can lead to smoother animations.
 *
 * However, not all browsers support requestAnimationFrame directly, hence the
 * need for a cross-browser implementation. This function checks if the
 * requestAnimationFrame method is available in the current browser under any
 * of the vendor prefixes (webkit, moz, o, ms). If none of these are available,
 * it falls back to using setTimeout to call the animation function at
 * approximately 60 frames per second (1000ms/60 ≈ 16.67ms).
 *
 * The function that is passed as an argument to requestAnimationFrame (or the
 * fallback setTimeout) is expected to be a function that updates the animation
 * for the next frame, and it's typically where you'd put your WebGL rendering
 * code for animating WebGL scenes.
 */
window.requestAnimFrame = ( function () {

  return (

    // Check for the requestAnimationFrame method under any of the vendor
    // prefixes. If it's available, use it to request the animation frame.
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||

    // If the requestAnimationFrame method is not available, use a fallback
    // method that uses setTimeout to call the animation function at
    // approximately 60 frames per second. 1000ms/60fps ≈ 16.67ms.
    function (
      /* function FrameRequestCallback */ callback,
      /* DOMElement Element */ element
    ) {
      window.setTimeout(callback, 1000 / 60); // 1000ms/60fps ≈ 16.67ms.
    }
  );
}) ();

/* ###########################################################
   ################## SHADER INITIALIZATION ##################
   ########################################################### */

/**
 * This function initializes the shaders for a WebGL program.
 * @param  { WebGLRenderingContext } gl - The WebGL rendering context.
 * @param  { string } vertexShaderId - The id of the vertex shader.
 * @param  { string } fragmentShaderId - The id of the fragment shader.
 * @return { WebGLProgram } - The WebGL program.
 */
function initShaders(gl, vertexShaderId, fragmentShaderId) {

  var vertexShader;
  var fragmentShader;

  // ##################### VERTEX SHADER #####################

  // Get the vertex shader from the DOM.
  var vertexElement = document.getElementById(vertexShaderId);

  // If the vertex shader does not exist, display an error message and return
  // null.
  if (!vertexElement) {
    showErrorText("Unable to load vertex shader " + vertexShaderId + ".");
    return null;

  // If the vertex shader does exist, create a vertex shader and compile it.
  } else {

    // Create a vertex shader.
    vertexShader = gl.createShader(gl.VERTEX_SHADER);

    // Set the source code of the vertex shader to the text of the vertex
    // element.
    gl.shaderSource(vertexShader, vertexElement.text);

    // Compile the vertex shader.
    gl.compileShader(vertexShader);

    // If the vertex shader failed to compile, display an error message and
    // return null.
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      var msg =
        "Vertex shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(vertexShader) +
        "</pre>";
      showErrorText(msg);
      return null;
    }
  }

  // #################### FRAGMENT SHADER ####################

  // Get the fragment shader from the DOM.
  var fragElem = document.getElementById(fragmentShaderId);

  // If the fragment shader does not exist, display an error message and return
  // null.
  if (!fragElem) {
    showErrorText("Unable to load vertex shader " + fragmentShaderId + ".");
    return null;

  // If the fragment shader does exist, create a fragment shader and compile it.
  } else {

    // Create a fragment shader.
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Set the source code of the fragment shader to the text of the fragment
    // element.
    gl.shaderSource(fragmentShader, fragElem.text);

    // Compile the fragment shader.
    gl.compileShader(fragmentShader);

    // If the fragment shader failed to compile, display an error message and
    // return null.
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      var msg =
        "Fragment shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(fragmentShader) +
        "</pre>";
      showErrorText(msg);
      return null;
    }
  }

  // ##################### SHADER PROGRAM ####################

  // Create a shader program.
  var program = gl.createProgram();

  // Attach the vertex and fragment shaders to the program.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program.
  gl.linkProgram(program);

  // If the program failed to link, display an error message and return null.
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var msg =
      "Shader program failed to link.  The error log is:" +
      "<pre>" +
      gl.getProgramInfoLog(program) +
      "</pre>";
    showErrorText(msg);
    return null;
  }

  // Return the program.
  return program;
}

/* ############################################################
   ###################### CUSTOM SCRIPTS ######################
   ############################################################ */

/**
 * This function returns a random, positive integer between minimumValue
 * (defaulted to 0) and maximumValue.
 * @param  { boolean } roundResult - Whether or not to round the result to the
 *                     nearest integer.
 * @param  { number } maximumValue - The maximum value of the random number.
 * @param  { number } minimumValue - The minimum value of the random number.
 * @return { number } - A random number between minimumValue and maximumValue.
 */
function randomNumber(roundResult = false, maximumValue = 1, minimumValue = 0) {
  if (roundResult) {
    return Math.round(Math.random() * maximumValue) + minimumValue;
  } else {
    return Math.random() * maximumValue + minimumValue;
  }
}

/**
 * This function returns a random multiplier of 1 or -1 for other numbers to
 * use for sign randomization.
 * @return { number } - A random number of 1 or -1.
 */
function randomSignMultiplier() {
  return Math.random() < 0.5 ? -1 : 1;
}

/**
 * This function returns an object representing a random color with red, green,
 * blue, and alpha properties. It has checks in place to prevent the color
 * being too bright against a white background.
 * @return { object } - An object with red, green, blue, and alpha properties.
 */
function randomRGBAColor() {

  // The minimum alpha value for the color.
  const minimumAlpha = 1.0; // Arbitrary value. Percentage.

  // The maximum sum of the red, green, and blue values for the color.
  // This is to ensure that the color is not too bright.
  const maximumColorSum = 2.65; // Arbitrary value. Sum of percentages.

  // The random color object to be returned.
  var color = {
    red: randomNumber(),
    green: randomNumber(),
    blue: randomNumber(),
    alpha: Math.max(randomNumber(), minimumAlpha),
  };

  // If the sum of the red, green, and blue values is greater than the maximum
  // color sum, reduce the color values to ensure the color is not too bright.
  if (color.red + color.green + color.blue > maximumColorSum) {

    // The difference between the sum of the color values and the maximum color
    // sum.
    var currentOverage = color.red + color.green + color.blue - maximumColorSum;

    // While the current overage is greater than 0, randomly reduce the color
    // values.
    while (currentOverage > 0) {

      // Randomly select a color to reduce.
      const randomColorIndex = randomNumber(true, 2, 0);

      // If the random color index is 0, reduce the red value.
      if (randomColorIndex == 0) {

        // If the red value is less than the current overage, reduce the red
        // value to 0 and reduce the current overage by the red value.
        if (color.red < currentOverage) {
          currentOverage -= color.red;
          color.red = 0;

        // If the red value is greater than or equal to the current overage,
        // reduce the red value by the current overage and set the current
        // overage to 0.
        } else {
          color.red -= currentOverage;
          currentOverage = 0;
        }

      // If the random color index is 1, reduce the green value.
      } else if (randomColorIndex == 1) {

        // If the green value is less than the current overage, reduce the green
        // value to 0 and reduce the current overage by the green value.
        if (color.green < currentOverage) {
          currentOverage -= color.green;
          color.green = 0;

        // If the green value is greater than or equal to the current overage,
        // reduce the green value by the current overage and set the current
        // overage to 0.
        } else {
          color.green -= currentOverage;
          currentOverage = 0;
        }

      // If the random color index is 2, reduce the blue value.
      } else {

        // If the blue value is less than the current overage, reduce the blue
        // value to 0 and reduce the current overage by the blue value.
        if (color.blue < currentOverage) {
          currentOverage -= color.blue;
          color.blue = 0;

        // If the blue value is greater than or equal to the current overage,
        // reduce the blue value by the current overage and set the current
        // overage to 0.
        } else {
          color.blue -= currentOverage;
          currentOverage = 0;
        }
      }
    }
  }

  return color;
}

/**
 * This function reloads the page that the user is currently on.
 * @return { void }
 */
function reloadPage() {
  location.reload();
}

/**
 * This function returns the pixel dimensions of whatever canvas element it
 * finds with id globalCanvasID as an object with both width and height properties.
 * @return { object } - An object with width and height properties.
 */
function canvasDimensions() {
  const canvas = document.getElementById(globalCanvasID);
  return {
    width: canvas.width,
    height: canvas.height,
  };
}

/**
 * This function returns an object with an x and y property representing a
 * randomly selected 2D pixel coordinate given the working canvas' pixel
 * dimensions.
 * @return { object } - An object with x and y properties.
 */
function random2DCoordinate() {
  return {
    x: randomSignMultiplier() * randomNumber(),
    y: randomSignMultiplier() * randomNumber(),
  };
}
