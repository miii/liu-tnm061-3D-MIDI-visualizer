var midiObject = new MidiLoader().load('midi/river.mid');
var animator;
var midiRenderer;

var animationStartTime = null;
var playing = false;

window.onload = function() {

	window.map = new THREE.TextureLoader().load('images/glow.png');

	var player = document.createElement('audio');
	player.preload = true;
	player.src = "midi/river2.mp3";

	window.onMidiLoaded = function() {
		// Midi data
		console.log('Tracks: ', midiObject.getTracks());
		console.log('Ticks per beat: ', midiObject.getTicksPerBeat());
		console.log('BPM: ', midiObject.getBPM());

		// Initialize animator, physics and midirenderer
		animator = new Animator().init();
		window.Physics = new Physics().init();
		window.Colors = new Colors();
		midiRenderer = new MidiRenderer().init(midiObject, animator);

		// Start rendering
		animator.renderOnce();

		player.oncanplaythrough = function() {
			window.addEventListener('keydown', function(event) {
				if (event.keyCode != 32)
					return;

				midiRenderer.play(player, function() {
					playing = true;
		    });
			}, false);
		}

		animate(null);

	}

	var frame = 0;
	var deltaFrame;

	function animate(time) {
		if (time == null) {
			requestAnimationFrame(animate);
			return;
		}

		// Request to be called again for next frame
		requestAnimationFrame(animate);

		// Render midi file and Three.js scene
		if (playing) {
			if (animationStartTime == null)
				animationStartTime = time;
			deltaTime = time - animationStartTime;

			midiRenderer.render(deltaTime);
		}

		animator.render(frame);

		frame++;
	}

}
