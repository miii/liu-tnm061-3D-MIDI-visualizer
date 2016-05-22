var Stars = function(){

	var particleSystem = null;

	function create() {
		var particleCount = 1800;
		var particleMap = new THREE.TextureLoader().load("images/particle.png");

		particles = new THREE.Geometry();
		pMaterial = new THREE.PointsMaterial({
			map: particleMap,
			color: 0xFFFFFF,
			size: 20,
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		// now create the individual particles
		for(var p = 0; p < particleCount; p++) {

			// create a particle with random
			// position values, -250 -> 250
			var pX = Math.random() * 10 - 5;
			pY = Math.random() * 10 - 5;
			pZ = Math.random() * 10 - 5;
		  particle = new THREE.Vertex(
				new THREE.Vector3(pX, pY, pZ)
			);
			// create a velocity vector
			particle.velocity = new THREE.Vector3(
				0,				// x
				-Math.random(),	// y
				0);				// z

			// add it to the geometry
			particles.vertices.push(particle);

		}

		// create the particle system
		particleSystem = new THREE.Points(particles, pMaterial);
		particleSystem.sortParticles = true;

		return this;
	}

	function getParticleSystem(){
		return particleSystem;
	}

	function animate(frame) {
		// add some rotation to the system
		particleSystem.rotation.y += 0.001;

		var pCount = particleCount;
		while(pCount--) {
			// get the particle
			var particle = particles.vertices[pCount];

			// check if we need to reset
			if(particle.position.y < -200) {
				particle.position.y = 200;
				particle.velocity.y = 0;
			}

			// update the velocity
			particle.velocity.y += Math.random() * .0001;

			// and the position
			particle.position.addSelf(
				particle.velocity);
		}

	}

	return {
		getParticleSystem: getParticleSystem,
		create: create,
		animate: animate,
	}

}
