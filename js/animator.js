var Animator = function() {
	var container;
	var camera, scene, renderer;
	var light;

	var mouseX = 0, mouseY = 0;
	var mouseXnorm = 0, mouseYnorm = 0;
	var cameraRotX = 0, cameraRotY = 0;
	var cameraHelper = null;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	// Object3D ("Group") nodes and Mesh nodes
	var sceneRoot = new THREE.Group();
	var viewRotation = new THREE.Group();
	var translationOrbit = new THREE.Group();
	var objectMesh;
	var textMesh;

	var mouseDown = false;

	/////////////////////////////

	var sensitivity = 3;
	var nearestDistance = 3;

	var cameraFOV = 110;

	/////////////////////////////

	var objects = [];

	/////////////////////////////

	var midiRenderActive = true;

	/////////////////////////////

	function _onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render(scene, camera);
	}

	function _onMouseDown(event) {
		mouseDown = true;

		cameraRotX = viewRotation.rotation.x;
		cameraRotY = viewRotation.rotation.y;

		var mousePos = _getMousePos(event);
		mouseXnorm = mousePos.x;
		mouseYnorm = mousePos.y;
	}

	function _onMouseUp() {
		mouseDown = false;

		cameraRotX = viewRotation.rotation.x;
		cameraRotY = viewRotation.rotation.y;
	}

	function _onMouseMove(event) {
		var mousePos = _getMousePos(event);
		mouseX = mousePos.x;
		mouseY = mousePos.y;
	}

	function _onScroll(event) {
		if (event.wheelDeltaY > 0) {
			// User scrolled up
			if (camera.position.z > nearestDistance)
				camera.position.z -= 1;
		} else {
			// User scrolled down
			camera.position.z += 1;
		}
	}

	function _getMousePos(event) {
		// mouseX, mouseY are in the range [-1, 1]
		return {
			x: (event.clientX - windowHalfX) / windowHalfX,
			y: (event.clientY - windowHalfY) / windowHalfY
		}
	}


	function _onKeyDown(event){

		switch(event.keyCode){
			case 38: {
				translationOrbit.position.z+=0.3;
				break;
			}
			case 40: {
				translationOrbit.position.z-=0.3;
				break;
			}
			case 49: {
				cameraHelper.animateTo({
					x: 0,
					y: 0,
					z: 0,
					zoom: 35,
				});
				break;
			}
			case 50: {
				cameraHelper.animateTo({
					x: 0,
					y: -Math.PI/2,
					z: 20,
					zoom: 40,
				});
				break;
			}
			case 51: {
				cameraHelper.animateTo({
					x: Math.PI/4,
					y: -Math.PI/4,
					z: 0,
					zoom: 40,
				});
				break;
			}

			case 32:
				viewRotation.remove(textMesh);
				break;
		}

	}

	function onNoteAdded(note) {
		note.spawn();
		translationOrbit.add(note.getMesh());
		objects.push(note);
		window.Physics.resetSlowdown();
	}

	function onMidiRendererCompleted() {
		midiRenderActive = false;
	}

	///////////////////////////

	function init() {

		container = document.getElementById('container');

		camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 10000);

		scene = new THREE.Scene();

		//scene.fog = new THREE.FogExp2(0x000000, 0.02);
		var amb = new THREE.AmbientLight(0xFFFFFF);
		scene.add(amb);

		// Mesh
		var geometryBox = new THREE.BoxGeometry(1, 1, 1);
		var materialBox = new THREE.MeshBasicMaterial();
		materialBox.wireframe = true;
		objectMesh = new THREE.Mesh(geometryBox, materialBox);

		// Top-level node
		scene.add(sceneRoot);

		// Sun branch
		sceneRoot.add(viewRotation);
		viewRotation.add(translationOrbit);
		//viewRotation.add(objectMesh);

		light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 0, 1);
		light.target.position.set(0, 0, 0);
		light.intensity = 1.5;
		viewRotation.add(light);

		//var stars = new Stars().create().getParticleSystem();
		//viewRotation.add(stars);

		cameraHelper = new CameraHelper();
		cameraHelper.setOrbit(viewRotation).setTransOrbit(translationOrbit).setCamera(camera);

		var radius = 20;
		segments = 64;
		material = new THREE.LineBasicMaterial({color: 0x333333});
		geometry = new THREE.CircleGeometry( radius, segments );

		// Remove center vertex
		geometry.vertices.shift();

		translationOrbit.add( new THREE.Line( geometry, material ) );

		var loader = new THREE.FontLoader();
		loader.load('fonts/roboto_regular.typeface.json', function (font) {
			var textMaterial = new THREE.MeshLambertMaterial({
	      color: 0x888888
	    });
			var textGeometry = new THREE.TextGeometry("Press space to start", {
				font: font,
				size: 2,
				height: 0.1
			});
			textMesh = new THREE.Mesh(textGeometry, textMaterial);
			textMesh.position.x = -12;
			viewRotation.add(textMesh);
		});

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize( window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		window.addEventListener('resize', _onWindowResize, false);
		window.addEventListener('mousedown', _onMouseDown, false);
		window.addEventListener('mouseup', _onMouseUp, false);
		window.addEventListener('mousemove', _onMouseMove, false);
		window.addEventListener('mousewheel', _onScroll, false);
		window.addEventListener('keydown', _onKeyDown, false);

		// Set up the camera
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 30;
		camera.lookAt( scene.position );

		return this;
	}

	function render(frame) {

		// Perform animations
		if (mouseDown) {
			viewRotation.rotation.x = cameraRotX + (mouseY - mouseYnorm) * sensitivity;
			viewRotation.rotation.y = cameraRotY + (mouseX - mouseXnorm) * sensitivity;
		}

		for (i = 0; i < objects.length; i++) {
			objects[i].animate(frame);

			if (midiRenderActive)
				objects[i].getMesh().position.z -= 1/15;
		}

		// Render the scene
		renderer.render(scene, camera);
	}

	function renderOnce() {
		renderer.render(scene, camera);
	}

	return {
		init: init,
		render: render,
		onNoteAdded: onNoteAdded,
		onMidiRendererCompleted: onMidiRendererCompleted,
		renderOnce: renderOnce
	}
}
