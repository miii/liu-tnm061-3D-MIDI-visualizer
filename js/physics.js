var Physics = function() {
  // The size of the vector field in Three.js coordinates on each axis
  // No spheres should be spawned outside this area
  // Default: 15
  var vectorFieldSize = 15;
  // Determine how many vector fields to be created for each Three.js coordinate
  // Default: 3
  var precision = 3;
  // Sphere gravity
  // Default: 3
  var gravity = 20;
  // Animation speed
  // Default: 3
  var speed = 0.1;
  // When calculating new velocity, old velocity should be multiplied with this factor
  // Use values between 0.9-1
  // Default: 1 (this will not affect the velocity at all)
  var velocityScale = 1;
  // Velocity distance compensation
  // Larger value means less compensation, set to 0 to disable
  // Default: 200
  var velCompCoefficient = 250;
  // Spiral force effect
  // Negative values will change direction, set to 0 to disable
  // Default: 0
  var spiralForce = 500;

  // Center of the vector field
  var center;
  // Variable to store the vector field
  var vectors = [];

  ///////////////////////////////////

  // Do not touch
  var sceneFrame = 0;
  var speedCoefficient = 1;
  var vectorFieldCoefficient = 1;
  var slowdownFired = 0;

  var slowdownEnabled = true;

  ///////////////////////////////////

  function _createVectorField() {
    // Get vector field size (field will be grids * grids large)
    var grids = vectorFieldSize * 2 + 1;
    // Total amount of vectors in vector field
    var nVectors = Math.pow(grids * precision, 2);
    // Find the center of the vector field
    // Since the vector field is a four-square the center coordinate is the same for both axis
    center = (grids * precision - 1) / 2;

    // Create all vectors
    for (i = 0; i < nVectors; i++) {
      // Find the x coordinate of the current vector
      x = ((i % (grids * precision)) - center) / precision;
      // Find the y coordinate of the current vector
      y = (center - Math.floor(i / (grids * precision))) / precision;

      // Arbitrary coefficient based on scientific evidence
      A = gravity / 40;
      B = spiralForce * 1 / 20;

      // Calculate acceleration
      xAcceleration = A * -x * Math.abs(x) - B * y;
      yAcceleration = A * -y * Math.abs(y) + B * x;

      // Create current vector
      vectors[i] = new Vector().create(xAcceleration, yAcceleration);
    }
  }

  function _getNearestVector(pos) {
    // Get vector field size (field will be grids * grids large)
    var grids = vectorFieldSize * 2 + 1;
    // Find vector field coordinate for nearest vector
    vx = Math.round(pos.x * precision);
    vy = Math.round(pos.y * precision);

    // If outside vector field, still use nearest vector (x-axis)
    if (Math.abs(vx) > vectorFieldSize * precision){
      vx = (vx > 0 ? 1 : -1) * vectorFieldSize * precision;
    }

    // If outside vector field, still use nearest vector (y-axis)
    if (Math.abs(vy) > vectorFieldSize * precision){
      vy = (vy > 0 ? 1 : -1) * vectorFieldSize * precision;
    }

    // Find the index of the vector in the vector field array
    return (vx + center) + (center - vy) * grids * precision;
  }

  // Method run once
  function init() {
    console.log('Physics init');

    _createVectorField();

    return this;
  }

  function updateSlowdownCoefficients(frame) {
    if (!slowdownEnabled){
      return;
    }

    sceneFrame = frame;

    var deltaFrame = frame - slowdownFired;

    //speedCoefficient = Math.pow(0.999, Math.pow(deltaFrame, 2) / 1500);
    vectorFieldCoefficient = Math.exp(-1 * deltaFrame / 60);
  }

  function resetSlowdown() {
    slowdownFired = sceneFrame;
  }

  // Metod to call when object should be affected by vector field
  function affect(note) {

    var velocity = note.getVelocity();
    var pos = note.getPosition();
    var vec = _getNearestVector(pos);

    if (!vec){
      console.warn('Nearest vector not found');
    }

    // Mass should affect the velocity of the object
    var density = 1 / note.getMass();

    var distance = Math.sqrt(Math.pow(vectors[vec].x, 2) + Math.pow(vectors[vec].y, 2));
    var denominator = velCompCoefficient === 0 ? 0 : (distance / velCompCoefficient);
    var compensation = 1 / (1 + denominator);

    // Use acceleration (from the nearest vector) to affect the velocity
    velocity.x = compensation * speedCoefficient * velocityScale * velocity.x + vectorFieldCoefficient * vectors[vec].x * density;
    velocity.y = compensation * speedCoefficient * velocityScale * velocity.y + vectorFieldCoefficient * vectors[vec].y * density;
  }

  function render(note) {
    var pos = note.getPosition();
    var velocity = note.getVelocity();

    // Arbitrary coefficient based on scientific evidence
    var A = speed * 1 / 240;

    // Translate the object with the new velocity
    pos.x += A * velocity.x;
    pos.y += A * velocity.y;
  }

  return {
    init: init,
    updateSlowdownCoefficients: updateSlowdownCoefficients,
    resetSlowdown: resetSlowdown,
    affect: affect,
    render: render
  };
};
