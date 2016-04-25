var Note = function() {

  var mesh;

  var startFrame = null;
  var noteID = null;

  var mass = null;
  var velocity = null;

  function spawn() {
    console.log('Note spawned', noteID);

    // Create sphere, colors are defined here
    var sphere = new THREE.SphereGeometry(0.2);
	
	var ColorOfSphere = "#" + note_colours[noteID];	
	var color = new THREE.Color(ColorOfSphere);	
    var material = new THREE.MeshBasicMaterial({color: color.getHex()});
	
    //material.wireframe = true;

		mesh = new THREE.Mesh(sphere, material);
		
    var x = Math.random() * 5; // To be deleted?
    console.log(x); // To be deleted?

    // Object mass (atm: random values between 0-5)
    mass = x;

    // Initial velocity
    velocity = new Vector().create(-10, 4);

    // Object start position
	var posID = noteID%12;
    mesh.position.x = note_positions[posID][0];
    mesh.position.y = note_positions[posID][1];

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


window.note_colours = ['5e0200', '5a1900', '8e5102', '8f5103', 'e59b03', '424e00', '0e3d00', '1a502a', '003f4f', '281151', '4d0151', '51002c', 
					   '5e0200', '5a1900', '8e5102', '8f5103', 'e59b03', '424e00', '0e3d00', '1a502a', '003f4f', '281151', '4d0151', '51002c',
					   '5e0200', '5a1900', '8e5102', '8f5103', 'e59b03', '424e00', '0e3d00', '1a502a', '003f4f', '281151', '4d0151', '51002c',
					   '5e0200', '5a1900', '8e5102', '8f5103', 'e59b03', '424e00', '0e3d00', '1a502a', '003f4f', '281151', '4d0151', '51002c',
					   '6a0201', '6d1e01', '8d2c00', 'a05e0a', 'e8a310', '5c6d01', '145801', '256c3b', '005b6a', '351a6c', '6e0173', '770144',
					   '690401', '8a2a01', 'a13a00', 'bf7b14', 'ecb428', '7e9101', '248302', '3d9758', '018191', '502b94', '910196', 'a20265',
					   '910301', 'b14003', 'c55900', 'd9982a', 'f1c851', 'adc002', '3eb307', '63c383', '03b8c4', '8052c7', 'c105c5', 'c8068a',
					   'dd0c07', 'd6640b', 'e88400', 'edb342', 'fad364', 'c9db0f', '61d614', '8de2ab', '65d6df', 'a678e2', 'd911de', 'e112ac',
					   'f21c03', 'e9820f', 'fbb002', 'f6c458', 'fcdc7f', 'e1ef18', '8ef034', 'acf1c6', '18ebf1', 'c098f1', 'efb2f1', 'f115c6',
					   'fd361c', 'f79d1e', 'ffbe21', 'fbd06d', 'fce090', 'edf826', 'abfa48', 'bef9d5', '00f5fa', 'd1aefa', 'f73bfa', 'fa2ad7',
					   'ff8061', 'fda924', 'ffc447', 'fcd575', 'fde396', 'f3fd2a', 'a5ff44', 'c2fedb', '15fafe', 'd7b3fe', 'fc33fe', 'fe29d8'];
					 
					 
					 
window.note_positions = [[3,3], [0,3], [3,0], [3,-3], [-3,3], [-3,-3], [0, -3], [-3, 0], [4, 4], [4,0], [0,4], [-4,-4]];