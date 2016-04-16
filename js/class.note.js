var Note = function() {

  var orbit; // Rotation orbit
  var mesh;

  var startFrame = null;
  var noteID = null;

  function spawn() {
    console.log('Note spawned', noteID);

	  orbit = new THREE.Group();

    var sphere = new THREE.SphereGeometry(0.2);
    var material = new THREE.MeshBasicMaterial();
    material.wireframe = true;

		mesh = new THREE.Mesh(sphere, material);

    orbit.add(mesh);

    return this;
  }

  function setNoteID(id) {
    noteID = id;

    return this;
  }

  function getOrbit() {
    return orbit;
  }

  function animate(frame) {

    if (startFrame == null)
      startFrame = frame;

    deltaFrame = frame - startFrame;

    mesh.position.x = 2 + 10 * Math.exp(-deltaFrame/30);
    orbit.rotation.z -= 8 * (Math.PI / 180) / (1 + (mesh.position.x/5));

  }

  return {
    spawn: spawn,
    setNoteID, setNoteID,
    getOrbit: getOrbit,
    animate: animate
  }

}
