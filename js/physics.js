var Physics = function() {
  // The size of the vector field in Three.js coordinates on each axis
  // No spheres should be spawned outside this area
  var vectorFieldSize = 10;
  // Determine how many vector fields to be created for each Three.js coordinate
  // Default: 3
  var precision = 3;
  // Sphere gravity
  var gravity = 10;
  // Animation speed
  var speed = 3;
  // When calculating new velocity, old velocity should be multiplied with this factor
  // Use values between 0.9-1. Default: 1 (this will not affect the velocity at all)
  var velocityScale = 1;

  // Center of the vector field
  var center;
  // Variable to store the vector field
  var vectors = [];

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
      A = gravity / 20;

      // Calculate acceleration
      xAcceleration = A * -x * Math.abs(x/2);
      yAcceleration = A * -y * Math.abs(y/2);

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
    // Find the index of the vector in the vector field array
    return (vx + center) + (center - vy) * grids * precision;
  }

  // Method run once
  function init() {
    console.log('Physics init');

    _createVectorField();

    return this;
  }

  // Metod to call when object should be affected by vector field
  function affect(note) {

    var velocity = note.getVelocity();
    var pos = note.getPosition();
    var vec = _getNearestVector(pos);

    // Mass should affect the velocity of the object
    var density = 1 / note.getMass();
    // Use acceleration (from the nearest vector) to affect the velocity
    velocity.x = velocityScale * velocity.x + vectors[vec].x * density;
    velocity.y = velocityScale * velocity.y + vectors[vec].y * density;
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
    affect: affect,
    render: render
  }
}
