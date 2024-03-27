
/**
 * Converts the arguments object into an array.
 * @param {Object} args - The arguments object.
 * @returns {Array} - The converted array.
 */
function objectToArray(args) {
  return [].concat.apply([], Array.prototype.slice.apply(args));
}

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180.0;
}

// ##################### VECTOR CONSTRUCTORS ####################

/**
 * Creates a 2D vector.
 * @param {...number} arguments - The components of the vector.
 * @returns {Array<number>} The created 2D vector.
 */
function vec2() {
  var result = objectToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
}

/**
 * Creates a 3D vector.
 * @param {...number} arguments - The components of the vector.
 * @returns {Array<number>} The 3D vector.
 */
function vec3() {
  var result = objectToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
  }

  return result.splice(0, 3);
}

/**
 * Creates a 4-dimensional vector.
 * @param {...number} arguments - The components of the vector.
 * @returns {Array<number>} The 4-dimensional vector.
 */
function vec4() {
  var result = objectToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
    case 3:
      result.push(1.0);
  }

  return result.splice(0, 4);
}

// ##################### MATRIX CONSTRUCTORS ####################

/**
 * Creates a 2x2 matrix.
 * @param {...number} arguments - The values to initialize the matrix. If no arguments are provided, the matrix will be initialized as an identity matrix.
 * @returns {Array<Array<number>>} The 2x2 matrix.
 */
function mat2() {
  var v = objectToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec2(v[0], 0.0), vec2(0.0, v[0])];
      break;

    default:
      m.push(vec2(v));
      v.splice(0, 2);
      m.push(vec2(v));
      break;
  }

  m.matrix = true;

  return m;
}

/**
 * Creates a 3x3 matrix.
 * @param {...number} arguments - The values to initialize the matrix. If no arguments are provided, the matrix will be initialized as an identity matrix.
 * @returns {Array<Array<number>>} The 3x3 matrix.
 */
function mat3() {
  var v = objectToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec3(v[0], 0.0, 0.0), vec3(0.0, v[0], 0.0), vec3(0.0, 0.0, v[0])];
      break;

    default:
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      break;
  }

  m.matrix = true;

  return m;
}

/**
 * Creates a 4x4 matrix.
 * @param {...number} arguments - The values to initialize the matrix. If no arguments are provided, the matrix will be initialized as an identity matrix.
 * @returns {Array} The 4x4 matrix.
 */
function mat4() {
  var v = objectToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [
        vec4(v[0], 0.0, 0.0, 0.0),
        vec4(0.0, v[0], 0.0, 0.0),
        vec4(0.0, 0.0, v[0], 0.0),
        vec4(0.0, 0.0, 0.0, v[0]),
      ];
      break;

    default:
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      break;
  }

  m.matrix = true;

  return m;
}

// ##################### GENERIC MATRIX & VECTOR OPERATIONS ####################

/**
 * Checks if two arrays or matrices are equal.
 * @param {Array|Matrix} u - The first array or matrix.
 * @param {Array|Matrix} v - The second array or matrix.
 * @returns {boolean} Returns true if the arrays or matrices are equal, false otherwise.
 */
function linearEquivalence(u, v) {
  if (u.length != v.length) {
    return false;
  }

  if (u.matrix && v.matrix) {
    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        return false;
      }
      for (var j = 0; j < u[i].length; ++j) {
        if (u[i][j] !== v[i][j]) {
          return false;
        }
      }
    }
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    return false;
  } else {
    for (var i = 0; i < u.length; ++i) {
      if (u[i] !== v[i]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Adds two matrices or vectors together.
 * @param {Array} u - The first matrix or vector.
 * @param {Array} v - The second matrix or vector.
 * @returns {Array} - The result of adding u and v.
 */
function linearAddition(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
        console.error("WebGL Utilities:", "linearAddition(): Cannot add matrices of different dimensions.");
        return;
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        console.error("WebGL Utilities:", "linearAddition(): Cannot add matrices of different dimensions.");
        return;
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] + v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    console.error("WebGL Utilities:", "linearAddition(): Cannot add matrix and non-matrix variables.");
    return;
  } else {
    if (u.length != v.length) {
        console.error("WebGL Utilities:", "linearAddition(): Cannot add matrices of different dimensions.");
        return;
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] + v[i]);
    }

    return result;
  }
}

/**
 * Subtracts two vectors or matrices.
 * @param {Array<number>|Array<Array<number>>} u - The first vector or matrix.
 * @param {Array<number>|Array<Array<number>>} v - The second vector or matrix.
 * @returns {Array<number>|Array<Array<number>>} - The result of subtracting u from v.
 */
function linearSubtract(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
        console.error("WebGL Utilities:", "linearSubtract(): Cannot subtract matrices of different lengths.");
        return;
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        console.error("WebGL Utilities:", "linearSubtract(): Cannot subtract matrices of different lengths.");
        return;
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] - v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    console.error("WebGL Utilities:", "linearSubtract(): Cannot subtract vector/matrix and non-vector/matrix variables.");
    return;
  } else {
    if (u.length != v.length) {
        console.error("WebGL Utilities:", "linearSubtract(): Cannot subtract vectors/matrices of different lengths.");
        return;
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] - v[i]);
    }

    return result;
  }
}

/**
 * Multiplies two matrices or vectors.
 * @param {Array} u - The first matrix or vector.
 * @param {Array} v - The second matrix or vector.
 * @returns {Array} - The result of the multiplication.
 * @throws {string} - Throws an error if the matrices or vectors have different dimensions.
 */
function linearMultiply(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      console.error("WebGL Utilities:", "linearMultiply(): Cannot multiply vectors/matrices of different dimensions.");
      return;
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        console.error("WebGL Utilities:", "linearMultiply(): Cannot multiply vectors/matrices of different dimensions.");
        return;
      }
    }

    for (var i = 0; i < u.length; ++i) {
      result.push([]);

      for (var j = 0; j < v.length; ++j) {
        var sum = 0.0;
        for (var k = 0; k < u.length; ++k) {
          sum += u[i][k] * v[k][j];
        }
        result[i].push(sum);
      }
    }

    result.matrix = true;

    return result;
  }

  if (u.matrix && u.length == v.length) {
    for (var i = 0; i < v.length; i++) {
      var sum = 0.0;
      for (var j = 0; j < v.length; j++) {
        sum += u[i][j] * v[j];
      }
      result.push(sum);
    }
    return result;
  } else {
    if (u.length != v.length) {
        console.error("WebGL Utilities:", "linearMultiply(): Cannot multiply vectors/matrices of different dimensions.");
        return;
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] * v[i]);
    }

    return result;
  }
}

// ##################### BASIC TRANSFORMATION MATRIX GENERATORS ####################

/**
 * Translates a 3D point or vector by the specified amounts along the x, y, and z axes.
 * If the input is an array of length 3, it treats the array as [x, y, z].
 * @param {number|number[]} x - The amount to translate along the x-axis or an array representing the [x, y, z] coordinates.
 * @param {number} [y] - The amount to translate along the y-axis.
 * @param {number} [z] - The amount to translate along the z-axis.
 * @returns {mat4} The resulting translation matrix.
 */
function translateMatrix(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][3] = x;
  result[1][3] = y;
  result[2][3] = z;

  return result;
}

/**
 * Rotates a matrix by the specified angle around the given axis.
 * If the axis is not provided as an array, it will be extracted from the function arguments.
 * @param {number} angle - The angle of rotation in degrees.
 * @param {Array<number>} axis - The axis of rotation as an array of three numbers [x, y, z].
 * @returns {mat4} - The resulting rotated matrix.
 */
function rotateMatrix(angle, axis) {
  if (!Array.isArray(axis)) {
    axis = [arguments[1], arguments[2], arguments[3]];
  }

  var v = normalizeVectors(axis);

  var x = v[0];
  var y = v[1];
  var z = v[2];

  var c = Math.cos(degreesToRadians(angle));
  var omc = 1.0 - c;
  var s = Math.sin(degreesToRadians(angle));

  var result = mat4(
    vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0),
    vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0),
    vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0),
    vec4()
  );

  return result;
}

function rotateX(theta) {
  var c = Math.cos(degreesToRadians(theta));
  var s = Math.sin(degreesToRadians(theta));
  var rx = mat4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    c,
    -s,
    0.0,
    0.0,
    s,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return rx;
}
function rotateY(theta) {
  var c = Math.cos(degreesToRadians(theta));
  var s = Math.sin(degreesToRadians(theta));
  var ry = mat4(
    c,
    0.0,
    s,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -s,
    0.0,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return ry;
}
function rotateZ(theta) {
  var c = Math.cos(degreesToRadians(theta));
  var s = Math.sin(degreesToRadians(theta));
  var rz = mat4(
    c,
    -s,
    0.0,
    0.0,
    s,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return rz;
}

/**
 * Creates a scaling matrix.
 * @param {number|Array} x - The scaling factor along the x-axis or an array containing the scaling factors for all three axes.
 * @param {number} y - The scaling factor along the y-axis.
 * @param {number} z - The scaling factor along the z-axis.
 * @returns {mat4} The scaling matrix.
 */
function scalingMatrix(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][0] = x;
  result[1][1] = y;
  result[2][2] = z;

  return result;
}

// ##################### MODEL-VIEW MATRIX GENERATORS ####################

/**
 * Calculates a view matrix for a camera using the lookAt algorithm.
 *
 * @param {vec3} eye - The position of the camera.
 * @param {vec3} at - The point the camera is looking at.
 * @param {vec3} up - The up direction of the camera.
 * @returns {mat4} The resulting view matrix.
 */
function viewMatrixAt(eye, at, up) {
  if (!Array.isArray(eye) || eye.length != 3) {
    console.error("WebGL Utilities:", "viewMatrixAt(): First parameter [eye] must be in the form of a vec3.");
    return;
  }

  if (!Array.isArray(at) || at.length != 3) {
    console.error("WebGL Utilities:", "viewMatrixAt(): First parameter [at] must be in the form of a vec3.");
    return;
  }

  if (!Array.isArray(up) || up.length != 3) {
    console.error("WebGL Utilities:", "viewMatrixAt(): First parameter [up] must be in the form of a vec3.");
    return;
  }

  if (linearEquivalence(eye, at)) {
    return mat4();
  }

  var v = normalizeVectors(linearSubtract(at, eye)); // view direction vector
  var n = normalizeVectors(crossProduct(v, up)); // perpendicular vector
  var u = normalizeVectors(crossProduct(n, v)); // "new" up vector

  v = negateElements(v);

  var result = mat4(
    vec4(n, -dotProduct(n, eye)),
    vec4(u, -dotProduct(u, eye)),
    vec4(v, -dotProduct(v, eye)),
    vec4()
  );

  return result;
}

// ##################### PROJECTION MATRIX GENERATORS ####################

/**
 * Creates an orthographic projection matrix.
 * @param {number} left - The left coordinate of the viewing volume.
 * @param {number} right - The right coordinate of the viewing volume.
 * @param {number} bottom - The bottom coordinate of the viewing volume.
 * @param {number} top - The top coordinate of the viewing volume.
 * @param {number} near - The near coordinate of the viewing volume.
 * @param {number} far - The far coordinate of the viewing volume.
 * @returns {mat4} The orthographic projection matrix.
 */
function buildOrthographicMatrix(left, right, bottom, top, near, far) {
  if (left == right) {
    throw "ortho(): left and right are equal";
  }
  if (bottom == top) {
    throw "ortho(): bottom and top are equal";
  }
  if (near == far) {
    throw "ortho(): near and far are equal";
  }

  var w = right - left;
  var h = top - bottom;
  var d = far - near;

  var result = mat4();
  result[0][0] = 2.0 / w;
  result[1][1] = 2.0 / h;
  result[2][2] = -2.0 / d;
  result[0][3] = -(left + right) / w;
  result[1][3] = -(top + bottom) / h;
  result[2][3] = -(near + far) / d;

  return result;
}

/**
 * Creates a perspective projection matrix.
 * @param {number} fovY - The vertical field of view in degrees.
 * @param {number} aspect - The aspect ratio of the viewport.
 * @param {number} near - The distance to the near clipping plane.
 * @param {number} far - The distance to the far clipping plane.
 * @returns {mat4} The perspective projection matrix.
 */
function buildPerspectiveMatrix(fovY, aspect, near, far) {
  var f = 1.0 / Math.tan(degreesToRadians(fovY) / 2);
  var d = far - near;

  var result = mat4();
  result[0][0] = f / aspect;
  result[1][1] = f;
  result[2][2] = -(near + far) / d;
  result[2][3] = (-2 * near * far) / d;
  result[3][2] = -1;
  result[3][3] = 0.0;

  return result;
}

// ##################### MATRIX FUNCTIONS ####################

/**
 * Transposes a matrix.
 * @param {Array<Array<number>>} m - The matrix to transpose.
 * @returns {Array<Array<number>>} - The transposed matrix.
 */
function transposeMatrix(m) {
  if (!m.matrix) {
    console.error("WebGL Utilities:", "transposeMatrix(): Cannot transpose a non-matrix.");
    return;
  }

  var result = [];
  for (var i = 0; i < m.length; ++i) {
    result.push([]);
    for (var j = 0; j < m[i].length; ++j) {
      result[i].push(m[j][i]);
    }
  }

  result.matrix = true;

  return result;
}

// ##################### VECTOR FUNCTIONS ####################

/**
 * Calculates the dot product of two vectors.
 * @param {number[]} u - The first vector.
 * @param {number[]} v - The second vector.
 * @returns {number} The dot product of the two vectors.
 */
function dotProduct(u, v) {
  if (u.length != v.length) {
    console.error("WebGL Utilities", "dotProduct(): Vectors are not the same dimension.");
  }

  var sum = 0.0;
  for (var i = 0; i < u.length; ++i) {
    sum += u[i] * v[i];
  }

  return sum;
}

/**
 * Negates each element in the given array.
 * @param {number[]} u - The array to be negated.
 * @returns {number[]} - The resulting array with negated elements.
 */
function negateElements(u) {
  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(-u[i]);
  }

  return result;
}

/**
 * Calculates the cross product of two vectors.
 * @param {number[]} u - The first vector.
 * @param {number[]} v - The second vector.
 * @returns {number[]} The cross product of the two vectors.
 */
function crossProduct(u, v) {
  if (!Array.isArray(u) || u.length < 3) {
    console.error("WebGL Utilities:", "crossProduct(): First argument is not a vector of minimum size, 3.");
    return;
  }

  if (!Array.isArray(v) || v.length < 3) {
    console.error("WebGL Utilities:", "crossProduct(): Second argument is not a vector of minimum size, 3.");
    return;
  }

  var result = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];

  return result;
}

/**
 * Calculates the length of a vector.
 *
 * @param {Array<number>} u - The vector to calculate the length of.
 * @returns {number} The length of the vector.
 */
function vectorLength(u) {
  return Math.sqrt(dotProduct(u, u));
}

/**
 * Normalizes a vector by dividing each component by its length.
 * If excludeLastComponent is true, the last component will be excluded from normalization.
 * @param {number[]} u - The vector to be normalized.
 * @param {boolean} excludeLastComponent - Whether to exclude the last component from normalization.
 * @returns {number[]} The normalized vector.
 */
function normalizeVectors(u, excludeLastComponent) {
  if (excludeLastComponent) {
    var last = u.pop();
  }

  var len = vectorLength(u);

  if (!isFinite(len)) {
    console.error("WebGL Utilities", "normalizeVectors(): Vector has zero length.");
    return;
  }

  for (var i = 0; i < u.length; ++i) {
    u[i] /= len;
  }

  if (excludeLastComponent) {
    u.push(last);
  }

  return u;
}

/**
 * Mixes two vectors based on a scalar value.
 * @param {number[]} u - The first vector.
 * @param {number[]} v - The second vector.
 * @param {number} s - The scalar value.
 * @returns {number[]} - The resulting mixed vector.
 */
function mixVectors(u, v, s) {
  if (typeof s !== "number") {
    console.error("WebGL Utilities:", "mixVectors()): The third parameter must be a number.");
    return;
  }

  if (u.length != v.length) {
    console.error("WebGL Utilities:", "mixVectors()): Vectors are not the same dimension.");
    return;
  }

  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push((1.0 - s) * u[i] + s * v[i]);
  }

  return result;
}

// ##################### VECTOR & MATRIX FUNCTIONS ####################

/**
 * Scales a vector or matrix by a scalar value.
 * @param {number} s - The scalar value to scale by.
 * @param {Array} u - The vector or matrix to be scaled.
 * @returns {Array} - The scaled vector or matrix.
 */
function linearScale(s, u) {
  if (!Array.isArray(u)) {
    console.error("WebGL Utilities:", "linearScale(): The second parameter must be a vector/matrix.");
  }

  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(s * u[i]);
  }

  return result;
}

/**
 * Flattens a matrix or array of arrays into a Float32Array.
 * If the input is a matrix, it will be transposed before flattening.
 * @param {Array|Array[]} v - The matrix or array of arrays to flatten.
 * @returns {Float32Array} - The flattened array.
 */
function linearFlatten(v) {
  if (v.matrix === true) {
    v = transposeMatrix(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;
    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
}

// ##################### MISCELLANEOUS FUNCTIONS ####################

/**
 * Represents the size in bytes of various vector and matrix types.
 * @type {Object}
 * @property {number} vec2 - The size in bytes of a vec2.
 * @property {number} vec3 - The size in bytes of a vec3.
 * @property {number} vec4 - The size in bytes of a vec4.
 * @property {number} mat2 - The size in bytes of a mat2.
 * @property {number} mat3 - The size in bytes of a mat3.
 * @property {number} mat4 - The size in bytes of a mat4.
 */
var sizeof = {
  vec2: new Float32Array(linearFlatten(vec2())).byteLength,
  vec3: new Float32Array(linearFlatten(vec3())).byteLength,
  vec4: new Float32Array(linearFlatten(vec4())).byteLength,
  mat2: new Float32Array(linearFlatten(mat2())).byteLength,
  mat3: new Float32Array(linearFlatten(mat3())).byteLength,
  mat4: new Float32Array(linearFlatten(mat4())).byteLength,
};

/**
 * Prints the elements of a matrix to the console.
 * @param {number[][]} m - The matrix to be printed.
 */
function printm(m) {
  if (m.length == 2)
    for (var i = 0; i < m.length; i++) console.log(m[i][0], m[i][1]);
  else if (m.length == 3)
    for (var i = 0; i < m.length; i++) console.log(m[i][0], m[i][1], m[i][2]);
  else if (m.length == 4)
    for (var i = 0; i < m.length; i++)
      console.log(m[i][0], m[i][1], m[i][2], m[i][3]);
}

// ##################### DETERMINANTS ####################

/**
 * Calculates the determinant of a 2x2 matrix.
 * @param {number[][]} m - The 2x2 matrix.
 * @returns {number} The determinant of the matrix.
 */
function det2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/**
 * Calculates the determinant of a 3x3 matrix.
 * @param {number[][]} m - The input matrix.
 * @returns {number} The determinant of the matrix.
 */
function det3(m) {
  var d =
    m[0][0] * m[1][1] * m[2][2] +
    m[0][1] * m[1][2] * m[2][0] +
    m[0][2] * m[2][1] * m[1][0] -
    m[2][0] * m[1][1] * m[0][2] -
    m[1][0] * m[0][1] * m[2][2] -
    m[0][0] * m[1][2] * m[2][1];
  return d;
}

/**
 * Calculates the determinant of a 4x4 matrix.
 * @param {number[][]} m - The 4x4 matrix represented as a 2D array.
 * @returns {number} The determinant of the matrix.
 */
function det4(m) {
  var m0 = [
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3]),
  ];
  var m1 = [
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3]),
  ];
  var m2 = [
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3]),
  ];
  var m3 = [
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2]),
  ];
  return (
    m[0][0] * det3(m0) -
    m[0][1] * det3(m1) +
    m[0][2] * det3(m2) -
    m[0][3] * det3(m3)
  );
}

/**
 * Determines the type of determinant to calculate, then calculates the determinant of a matrix.
 * @param {Array} m - The matrix to calculate the determinant of.
 * @returns {number} The determinant of the matrix.
 */
function calculateDeterminant(m) {
  if (m.matrix != true) console.error("WebGL Utilities:", "calculateDeterminant(): Variable is not a matrix.");
  if (m.length == 2) return det2(m);
  if (m.length == 3) return det3(m);
  if (m.length == 4) return det4(m);
  return;
}

// ##################### INVERSES ####################

/**
 * Calculates the inverse of a 2x2 matrix.
 * @param {mat2} m - The input matrix.
 * @returns {mat2} - The inverse matrix.
 */
function inverse2(m) {
  var a = mat2();
  var d = det2(m);
  a[0][0] = m[1][1] / d;
  a[0][1] = -m[0][1] / d;
  a[1][0] = -m[1][0] / d;
  a[1][1] = m[0][0] / d;
  a.matrix = true;
  return a;
}

/**
 * Calculates the inverse of a 3x3 matrix.
 * 
 * @param {mat3} m - The input matrix.
 * @returns {mat3} The inverse matrix.
 */
function inverse3(m) {
  var a = mat3();
  var d = det3(m);

  var a00 = [vec2(m[1][1], m[1][2]), vec2(m[2][1], m[2][2])];
  var a01 = [vec2(m[1][0], m[1][2]), vec2(m[2][0], m[2][2])];
  var a02 = [vec2(m[1][0], m[1][1]), vec2(m[2][0], m[2][1])];
  var a10 = [vec2(m[0][1], m[0][2]), vec2(m[2][1], m[2][2])];
  var a11 = [vec2(m[0][0], m[0][2]), vec2(m[2][0], m[2][2])];
  var a12 = [vec2(m[0][0], m[0][1]), vec2(m[2][0], m[2][1])];
  var a20 = [vec2(m[0][1], m[0][2]), vec2(m[1][1], m[1][2])];
  var a21 = [vec2(m[0][0], m[0][2]), vec2(m[1][0], m[1][2])];
  var a22 = [vec2(m[0][0], m[0][1]), vec2(m[1][0], m[1][1])];

  a[0][0] = det2(a00) / d;
  a[0][1] = -det2(a10) / d;
  a[0][2] = det2(a20) / d;
  a[1][0] = -det2(a01) / d;
  a[1][1] = det2(a11) / d;
  a[1][2] = -det2(a21) / d;
  a[2][0] = det2(a02) / d;
  a[2][1] = -det2(a12) / d;
  a[2][2] = det2(a22) / d;

  return a;
}

/**
 * Calculates the inverse of a 4x4 matrix.
 * 
 * @param {mat4} m - The input matrix.
 * @returns {mat4} The inverse matrix.
 */
function inverse4(m) {
  var a = mat4();
  var d = det4(m);

  var a00 = [
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3]),
  ];
  var a01 = [
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3]),
  ];
  var a02 = [
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3]),
  ];
  var a03 = [
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2]),
  ];
  var a10 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3]),
  ];
  var a11 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3]),
  ];
  var a12 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3]),
  ];
  var a13 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2]),
  ];
  var a20 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[3][1], m[3][2], m[3][3]),
  ];
  var a21 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[3][0], m[3][2], m[3][3]),
  ];
  var a22 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[3][0], m[3][1], m[3][3]),
  ];
  var a23 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[3][0], m[3][1], m[3][2]),
  ];

  var a30 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
  ];
  var a31 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
  ];
  var a32 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
  ];
  var a33 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
  ];

  a[0][0] = det3(a00) / d;
  a[0][1] = -det3(a10) / d;
  a[0][2] = det3(a20) / d;
  a[0][3] = -det3(a30) / d;
  a[1][0] = -det3(a01) / d;
  a[1][1] = det3(a11) / d;
  a[1][2] = -det3(a21) / d;
  a[1][3] = det3(a31) / d;
  a[2][0] = det3(a02) / d;
  a[2][1] = -det3(a12) / d;
  a[2][2] = det3(a22) / d;
  a[2][3] = -det3(a32) / d;
  a[3][0] = -det3(a03) / d;
  a[3][1] = det3(a13) / d;
  a[3][2] = -det3(a23) / d;
  a[3][3] = det3(a33) / d;

  return a;
}

/**
 * Calculates the inverse of a matrix.
 * @param {Array} m - The matrix to calculate the inverse of.
 * @returns {Array} - The inverse of the input matrix.
 */
function calculateInverseMatrix(m) {
  if (m.matrix != true) console.error("WebGL Utilities:", "calculateInverseMatrix(): Variable is not a matrix.");
  if (m.length == 2) return inverse2(m);
  if (m.length == 3) return inverse3(m);
  if (m.length == 4) return inverse4(m);
  return;
}

/**
 * Calculates the normal matrix of a given matrix.
 * @param {mat4} m - The input matrix.
 * @param {boolean} flag - A flag indicating whether to return the full matrix or just the upper-left 3x3 submatrix.
 * @returns {mat4|mat3} - The normal matrix.
 */
function normalizeMatrix(m, flag) {
  var a = mat4();
  a = calculateInverseMatrix(transposeMatrix(m));
  if (flag != true) return a;
  else {
    var b = mat3();
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) b[i][j] = a[i][j];
    return b;
  }
}
