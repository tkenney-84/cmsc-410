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

class WebGLResources {
  constructor(globalCanvasID) {
    this.globalCanvasID = globalCanvasID;

    /* ############################################################
      ################### WEBGL INITIALIZATION ###################
      ############################################################ */

    this.WebGLUtils = (function () {
      /**
       * Message suggesting the user get a browser which runs WebGL.
       * @type { string } The message.
       */
      const GET_A_WEBGL_BROWSER =
        "This page requires a browser that supports WebGL.<br/>" +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

      /**
       * Message suggesting the user does not have sufficient hardware to run WebGL.
       * @type { string } The message.
       */
      const HARDWARE_PROBLEM =
        "It appears your computer is unable to run WebGL.<br/>" +
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

        if (!canvas) {
          return null;
        }

        // If the browser does not support WebGL, display an error message and
        // return null.
        if (!window.WebGLRenderingContext) {
          console.error("WebGL", GET_A_WEBGL_BROWSER);
          return null;
        }

        // Create a webgl context.
        var context = create3DContext(opt_attribs);

        // If the context was not created, display an error message.
        if (!context) {
          console.error("WebGL", HARDWARE_PROBLEM);
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
    })(); // End of WebGLUtils.

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
    window.requestAnimFrame = (function () {
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
    })();
  }

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
  initShaders(gl, vertexShaderId, fragmentShaderId) {
    var vertexShader;
    var fragmentShader;

    // ##################### VERTEX SHADER #####################

    // Get the vertex shader from the DOM.
    var vertexElement = document.getElementById(vertexShaderId);

    // If the vertex shader does not exist, display an error message and return
    // null.
    if (!vertexElement) {
      console.error(
        "WebGL",
        "Unable to load vertex shader " + vertexShaderId + "."
      );
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
        console.error("WebGL", msg);
        return null;
      }
    }

    // #################### FRAGMENT SHADER ####################

    // Get the fragment shader from the DOM.
    var fragElem = document.getElementById(fragmentShaderId);

    // If the fragment shader does not exist, display an error message and return
    // null.
    if (!fragElem) {
      console.error(
        "WebGL",
        "Unable to load vertex shader " + fragmentShaderId + "."
      );
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
        console.error("WebGL", msg);
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
      console.error("WebGL", msg);
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
  randomNumber(roundResult = false, maximumValue = 1, minimumValue = 0) {
    if (roundResult) {
      return Math.min(
        Math.round(Math.random() * maximumValue) + minimumValue,
        maximumValue
      );
    } else {
      return Math.min(
        Math.random() * maximumValue + minimumValue,
        maximumValue
      );
    }
  }

  /**
   * This function returns a random multiplier of 1 or -1 for other numbers to
   * use for sign randomization.
   * @return { number } - A random number of 1 or -1.
   */
  randomSignMultiplier() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  /**
   * This function returns an object representing a random color with red, green,
   * blue, and alpha properties. It has checks in place to prevent the color
   * being too bright against a white background.
   * @return { object } - An object with red, green, blue, and alpha properties.
   */
  randomRGBAColor() {
    // The minimum alpha value for the color.
    const minimumAlpha = 1.0; // Arbitrary value. Percentage.

    // The maximum sum of the red, green, and blue values for the color.
    // This is to ensure that the color is not too bright.
    const maximumColorSum = 2.65; // Arbitrary value. Sum of percentages.

    // The random color object to be returned.
    var color = {
      red: this.randomNumber(),
      green: this.randomNumber(),
      blue: this.randomNumber(),
      alpha: Math.max(this.randomNumber(), minimumAlpha),
    };

    // If the sum of the red, green, and blue values is greater than the maximum
    // color sum, reduce the color values to ensure the color is not too bright.
    if (color.red + color.green + color.blue > maximumColorSum) {
      // The difference between the sum of the color values and the maximum color
      // sum.
      var currentOverage =
        color.red + color.green + color.blue - maximumColorSum;

      // While the current overage is greater than 0, randomly reduce the color
      // values.
      while (currentOverage > 0) {
        // Randomly select a color to reduce.
        const randomColorIndex = this.randomNumber(true, 2, 0);

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
  reloadPage() {
    location.reload();
  }

  /**
   * This function returns the pixel dimensions of whatever canvas element it
   * finds with id globalCanvasID as an object with both width and height properties.
   * @return { object } - An object with width and height properties.
   */
  canvasDimensions() {
    const canvas = document.getElementById(this.globalCanvasID);
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
  random2DCoordinate() {
    return {
      x: this.randomSignMultiplier() * this.randomNumber(),
      y: this.randomSignMultiplier() * this.randomNumber(),
    };
  }
}
