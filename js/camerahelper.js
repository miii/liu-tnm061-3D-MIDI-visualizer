var CameraHelper = function() {
  var camera = null;
  var orbit = null;
  var transOrbit = null;

  function setOrbit(orb) {
    orbit = orb;

    return this;
  }

  function setCamera(cam) {
    camera = cam;

    return this;
  }

  function setTransOrbit(orb) {
    transOrbit = orb;

    return this;
  }

  function animateTo(options) {
    x = options.x != null ? options.x : orbit.rotation.x;
    y = options.y != null ? options.y : orbit.rotation.y;
    camz = options.zoom != null ? options.zoom : camera.position.z;
    z = options.z != null ? options.z : transOrbit.position.z;

    var deltaOrbitRotation = {
      x: x - orbit.rotation.x,
      y: y - orbit.rotation.y,
      z: z - transOrbit.position.z
    };
    var deltaCamPosition = {
      z: camz - camera.position.z
    }

    var timevar = 200;
    var steps = {
      x: deltaOrbitRotation.x / timevar,
      y: deltaOrbitRotation.y / timevar,
      z: deltaOrbitRotation.z / timevar,
      camz: deltaCamPosition.z / timevar
    }

    _animate({x: x, y: y, z: z}, {z: camz}, steps);
  }

  function _animate(orbitDest, camDest, steps) {

    orbit.rotation.x += steps.x;
    orbit.rotation.y += steps.y;
    transOrbit.position.z += steps.z;
    camera.position.z += steps.camz;

    var done = {
      x: false,
      y: false,
      z: false,
      camz: false
    }

    if (Math.abs(orbit.rotation.x - orbitDest.x) <= 2 * Math.abs(steps.x)) {
      orbit.rotation.x = orbitDest.x;
      done.x = true;
    }

    if (Math.abs(orbit.rotation.y - orbitDest.y) <= 2 * Math.abs(steps.y)) {
      orbit.rotation.y = orbitDest.y;
      done.y = true;
    }

    if (Math.abs(camera.position.z - camDest.z) <= 2 * Math.abs(steps.camz)) {
      camera.position.z = camDest.z;
      done.camz = true;
    }

    if (Math.abs(transOrbit.position.z - orbitDest.z) <= 2 * Math.abs(steps.z)) {
      transOrbit.position.z = orbitDest.z;
      done.z = true;
    }

    if (!done.x || !done.y || !done.camz || !done.z)
      setTimeout(function() {
        _animate(orbitDest, camDest, steps);
      }, (1/60));
  }

  return {
    setCamera: setCamera,
    setOrbit: setOrbit,
    setTransOrbit: setTransOrbit,
    animateTo: animateTo
  }

}
