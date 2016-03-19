function MidiLoader() {

	var midi = null;
	var bpm = null;

	function _fetch(url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.overrideMimeType('text\/plain; charset=x-user-defined');
		req.onload = function() {
			_onFetch(req.response);
		}
		req.send(null);
	}

	function _onFetch(filestream) {
		var t = filestream || "" ;
		var ff = [];
		var mx = t.length;
		var scc= String.fromCharCode;

		for (var z = 0; z < mx; z++) {
			ff[z] = scc(t.charCodeAt(z) & 255);
		}

		var data = ff.join("");
		midi = MidiFile(data);

		if (window.onMidiLoaded != undefined)
			window.onMidiLoaded();
	}

	function _findLastEndedNote(notes, currentEndedNote) {
		if (notes.length > currentEndedNote && notes[currentEndedNote].end != null)
			_findLastEndedNote(currentEndedNote++);
		else
			return;
	}

	////////////////////////////

	function load(url) {
		_fetch(url);
		return this;
	}

	function getMidiData() {
		return midi;
	}

	function getTracks() {

		var tracks = [];
		for (k = 0; k < midi.tracks.length; k++) {
			var source = midi.tracks[k];

			var time = 0;
			var trackname = '';
			var notes = [];
			var lastEndedNote = 0;
			var nextPatch = 0;

			for (i = 0; i < source.length; i++) {

				time += source[i].deltaTime;

				if (source[0].microsecondsPerBeat)
					bpm = Math.round(60 / (source[0].microsecondsPerBeat / 1000000));

				if (source[i].subtype == 'programChange')
					nextPatch = source[i].programNumber + 1;

				if (source[i].subtype == 'noteOn') {
					var note = {
						start: time,
						end: null,
						note: source[i].noteNumber,
						velocity: source[i].velocity
					}
					notes.push(note);
				}

				if (source[i].subtype == 'noteOff')
					for (j = lastEndedNote; j < notes.length; j++) {
						if (source[i].noteNumber == notes[j].note) {
							notes[j].end = time;
							_findLastEndedNote(notes, lastEndedNote);
						}
					}

				if (source[i].subtype == 'trackName')
					trackname = source[i].text;

			}

			if (notes.length > 0) {
				tracks.push({
					patchId: nextPatch,
					name: trackname,
					notes: notes
				});
			}
		}

		return tracks;
	}

	function getTicksPerBeat() {
		return midi.header.ticksPerBeat;
	}

	function getBPM() {
		return bpm;
	}

	function getPatch(patch) {
		var patches = ["-", "Acoustic Grand Piano","Bright Acoustic Piano","Electric Grand Piano","Honky-tonk Piano","Electric Piano 1","Electric Piano 2","Harpsichord","Clavi","Celesta","Glockenspiel","Music Box","Vibraphone","Marimba","Xylophone","Tubular Bells","Dulcimer","Drawbar Organ","Percussive Organ","Rock Organ","Church Organ","Reed Organ","Accordion","Harmonica","Tango Accordion","Guitar (nylon)","Acoustic Guitar (steel)","Electric Guitar (jazz)","Electric Guitar (clean)","Electric Guitar (muted)","Overdriven Guitar","Distortion Guitar","Guitar harmonics","Acoustic Bass","Electric Bass (finger)","Electric Bass (pick)","Fretless Bass","Slap Bass 1","Slap Bass 2","Synth Bass 1","Synth Bass 2","Violin","Viola","Cello","Contrabass","Tremolo Strings","Pizzicato Strings","Orchestral Harp","Timpani","String Ensemble 1","String Ensemble 2","SynthStrings 1","SynthStrings 2","Choir Aahs","Voice Oohs","Synth Voice","Orchestra Hit","Trumpet","Trombone","Tuba","Muted Trumpet","French Horn","Brass Section","SynthBrass 1","SynthBrass 2","Soprano Sax","Alto Sax","Tenor Sax","Baritone Sax","Oboe","English Horn","Bassoon","Clarinet","Piccolo","Flute","Recorder","Pan Flute","Blown Bottle","Shakuhachi","Whistle","Ocarina","Lead 1 (square)","Lead 2 (sawtooth)","Lead 3 (calliope)","Lead 4 (chiff)","Lead 5 (charang)","Lead 6 (voice)","Lead 7 (fifths)","Lead 8 (bass+lead)","Pad 1 (new age)","Pad 2 (warm)","Pad 3 (polysynth)","Pad 4 (choir)","Pad 5 (bowed)","Pad 6 (metallic)","Pad 7 (halo)","Pad 8 (sweep)","FX 1 (rain)","FX 2 (soundtrack)","FX 3 (crystal)","FX 4 (atmosphere)","FX 5 (brightness)","FX 6 (goblins)","FX 7 (echoes)","FX 8 (sci-fi)","Sitar","Banjo","Shamisen","Koto","Kalimba","Bag pipe","Fiddle","Shanai","Tinkle Bell","Agogo","Steel Drums","Woodblock","Taiko drum","Melodic Tom","Synth Drum","Reverse Cymbal","Guitar Fret Noise","Breath Noise","Seashore","Bird Tweet","Telephone Ring","Helicopter","Applause","Gunshot"];
		return patches[patch];
	}

	return {
		'load': load,
		'getMidiData': getMidiData,
		'getTracks': getTracks,
		'getTicksPerBeat': getTicksPerBeat,
		'getBPM': getBPM,
		'getPatch': getPatch
	}

}