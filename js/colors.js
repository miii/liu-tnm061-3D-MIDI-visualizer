var Colors = function() {

  var hasLooped = false;

  function getColorByNoteID(noteID) {
    // Note ID is a number 0-127
    // Most of them are between 60-95

    var periods = 5;
    var freq = periods * 2 * Math.PI / 127;

    var w0 = 0;
    var phase = Math.PI / 2;

    if (!hasLooped) {
      for (i = 0; i < 128; i++) {
        var r = Math.round(Math.sin(w0 + i * freq) * 127 + 128);
        var g = Math.round(Math.sin(w0 + i * freq + phase) * 127 + 128);
        var b = Math.round(Math.sin(w0 + i * freq + 2 * phase) * 127 + 128);
        console.log('%c rgb(' + r + ', ' + g + ', ' + b + ')', 'color: rgb(' + r + ', ' + g + ', ' + b + ')');
      }
      hasLooped = true;
    }

    var r = Math.round(Math.sin(w0 + noteID * freq) * 127 + 128);
    var g = Math.round(Math.sin(w0 + noteID * freq + phase) * 127 + 128);
    var b = Math.round(Math.sin(w0 + noteID * freq + 2 * phase) * 127 + 128);

    var rgbString = 'rgb('+r+', '+g+', '+b+')';
    return rgbString;
  }

  return {
    getColorByNoteID: getColorByNoteID
  }
}
