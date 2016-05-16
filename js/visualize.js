var midiObject = new MidiLoader().load('midi/river.mid');
var animator;
var midiRenderer;

// Preload glow texture
window.map = new THREE.TextureLoader().load('images/glow.png');

window.onload = function() {

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
    midiRenderer.play(player, function() {
      animate(0);
    });

	}

	var frame = 0;

	function animate(time) {
		// Request to be called again for next frame
		requestAnimationFrame(animate);

		// Render midi file and Three.js scene
		midiRenderer.render(time);
		animator.render(frame);

		frame++;
	}

}
