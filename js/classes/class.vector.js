var Vector = function() {
  this.x = 0;
  this.y = 0;

  function create(xx, yy) {
    this.x = xx;
    this.y = yy;

    return this;
  }

  return {
    create: create,
    x: this.x,
    y: this.y
  }
}
