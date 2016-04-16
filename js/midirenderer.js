var MidiRenderer = function() {

  var animator = null;
  var midi;
  var notes;

  var offsetDelay = 100; // add delay to fix animation bug (ms)

  function _addNote(noteID) {
  	var note = new Note().setNoteID(noteID);
  	animator.onNoteAdded(note);
  }

  function _timeToTicks(time) {
    var sec = (time / 1000);
    var bps = midi.getBPM() / 60;
    var currentBeat = bps * sec;

    var tick = midi.getTicksPerBeat() * currentBeat;

    return tick;
  }

  function render(time) {
    var tick = _timeToTicks(time);

    var nArray = notes;
    for (i = 0; i < nArray.length; i++) {
      if (nArray[i].start + offsetDelay > tick)
        break;

      //console.log(tick, time);
      console.log(nArray[i].note, nArray[i].start, tick);
      _addNote(nArray[i].note);
      notes.splice(i, 1);
    }
  }

  function init(midiObject, anim) {
    midi = midiObject;
    animator = anim;

    var tracks = midiObject.getTracks();
    notes = tracks[0].notes;

    return this;
  }

  return {
    init: init,
    render: render
  }

}
