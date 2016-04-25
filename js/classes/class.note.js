var Note = function() {

  var mesh;

  var startFrame = null;
  var noteID = null;

  var mass = null;
  var velocity = null;

  function spawn() {
    console.log('Note spawned', noteID);

    // Create sphere, colors should be defined here
    var sphere = new THREE.SphereGeometry(0.2);
    var material = new THREE.MeshBasicMaterial();
    material.wireframe = true;

		mesh = new THREE.Mesh(sphere, material);

    var x = Math.random() * 5; // To be deleted?
    console.log(x); // To be deleted?

    // Object mass (atm: random values between 0-5)
    mass = x;

    // Initial velocity
    velocity = new Vector().create(-10, 4);

    // Object start position
    mesh.position.x = 3;
    mesh.position.y = 3;

    return this;
  }

  // Used by midirender.js
  function setNoteID(id) {
    noteID = id;

    return this;
  }

  // Used by animator.js
  function getMesh() {
    return mesh;
  }

  // Used by physics.js
  function getPosition() {
    return mesh.position;
  }

    // Used by physics.js
  function getVelocity() {
    return velocity;
  }

  // Used by physics.js
  function getMass() {
    return mass;
  }

  // Used by animator.js
  function animate(frame) {

    // Calculate acceleration and new velocity
    window.Physics.affect(this);

    // Translate the object
    window.Physics.render(this);

  }

  return {
    spawn: spawn,
    setNoteID, setNoteID,
    getMesh: getMesh,
    getPosition: getPosition,
    getVelocity: getVelocity,
    getMass: getMass,
    animate: animate
  }

}
