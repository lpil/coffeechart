(function() {
  var Coffeechart = {};

  Coffeechart.Utils = (function() {
    function Utils() {}

    Utils.colours = [
      '#ac4141', '#d28445', '#f4bf75', '#90a959', '#75b5aa', '#6a9fb5',
      '#aa759f', '#8f5536'
    ];


    /*
    Takes 2 objects, and compared them based upon a given property
    For use with the array sort method
    @param Object a
    @param Object b
    @param String Property to compare
    @return Num 1 if a.p > b.p, 0 if equal, -1 otherwise
     */
    Utils.compareObjProp = function(a, b, prop) {
      if (a[prop] < b[prop]) {
        return -1;
      } else if (a[prop] > b[prop]) {
        return 1;
      } else {
        return 0;
      }
    };


    /*
    Calculates the co-ords of a point from a point, distance, and angle
    @param Num X axis coordinate
    @param Num Y axis coordinate
    @param Num Distance from given point
    @param Num Direction from given point in radians
    @return Array [x,y] Coordinates of new point
     */
    Utils.offsetPoint = function(startX, startY, distance, angle) {
      return [
        startX + Math.cos(angle) * distance, 
        startY + Math.sin(angle) * distance
      ];
    };

    return Utils;
  })();

  Coffeechart.PieChart = (function() {

    /*
    A Pie chart!
    @param Array Containing objects with name and amount properties
    @param Canvas The HTML5 canvas to draw to
    @param Object PieChart Options
    @return Object Self
     */
    function PieChart(data, canvas, ops) {
      var total,
          vals = [];

      ops = (ops === undefined) ? {} : ops;

      ops.rotationalOffset = (ops.rotationalOffset === undefined) ?
        0       : ops.rotationalOffset;
      ops.centerX  = (ops.centerX === undefined) ?
        200     : ops.centerX;
      ops.centerY = (ops.centerY === undefined) ?
        200     : ops.centerY;
      ops.radius = (ops.radius === undefined) ?
        180     : ops.radius;
      ops.lineColour = (ops.lineColour === undefined) ?
        'white' : ops.lineColour;
      ops.legend = (ops.radius === undefined) ?
        180     : ops.radius;

      ops.legendY = (ops.legendY === undefined) ?
        (ops.centerY - ops.radius) * 2 : ops.legendY;
      ops.legendX = (ops.legendX === undefined) ?
        (ops.centerX * 2 + ops.legendY / 2) : ops.legendX;

      ops.colours =
        (ops.colours === undefined) ? Coffeechart.Utils.colours : ops.colours;
      if (data.length % ops.colours.length - 1 === 0) {
        ops.colours.pop();
      }

      if (ops.legend === null) {
        ops.legend = true;
      }

      total = data.reduce(function(a, e) {
        return e.amount + a;
      }, 0);

      (function() {
        var e;
        for (var i = 0, l = data.length; i < l; i ++) {
          e = data[i];

          if (e.amount > 0) {
            e.ratio = e.amount / total;
            e.chartTotal = total;
          }
        }
      }());

      vals = vals.sort(function(a, b) {
        return Coffeechart.Utils.compareObjProp(a, b, 'ratio');
      });

      this.canvas = canvas;
      this.data = data;
      this.ops = ops;
    }


    /*
    Draw the Pie chart with the canvas context supplied
    @param Canvas HTML canvas to draw on
     */

    PieChart.prototype.draw = function() {
      var arcEnd, arcStart, center, colour, colours, context, e, endAng, i, legendY, startAng, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _results;
      this.canvas.width = this.canvas.width;
      context = this.canvas.getContext('2d');
      colours = this.ops.drawColours || this.ops.colours;
      startAng = this.ops.rotationalOffset;
      _ref = this.data;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        endAng = startAng + Math.PI * (e.amount / e.chartTotal) * 2;
        colour = colours[i % colours.length];
        center = [this.ops.centerX, this.ops.centerY];
        arcStart = (_ref1 = Coffeechart.Utils).offsetPoint.apply(_ref1, [].slice.call(center).concat([this.ops.radius], [startAng]));
        arcEnd = (_ref2 = Coffeechart.Utils).offsetPoint.apply(_ref2, [].slice.call(center).concat([this.ops.radius], [endAng]));
        context.moveTo.apply(context, center);
        context.beginPath();
        context.lineTo.apply(context, arcStart);
        context.arc.apply(context, [].slice.call(center).concat([this.ops.radius], [startAng], [endAng], [false]));
        context.lineTo.apply(context, center);
        context.closePath();
        context.fillStyle = colour;
        context.fill();
        if (this.data.length > 1) {
          context.beginPath();
          context.moveTo.apply(context, center);
          context.lineTo.apply(context, arcStart);
          context.moveTo.apply(context, center);
          context.lineTo.apply(context, arcEnd);
          context.closePath();
          context.strokeStyle = this.ops.lineColour;
          context.lineWidth = 2;
          context.stroke();
        }
        startAng = endAng;
      }
      if (this.ops.legend) {
        legendY = this.ops.legendY;
        context.textBaseline = 'middle';
        context.font = 'normal 14px arial';
        _ref3 = this.data;
        _results = [];
        for (i = _j = 0, _len1 = _ref3.length; _j < _len1; i = ++_j) {
          e = _ref3[i];
          colour = colours[i % colours.length];
          context.fillStyle = colour;
          context.fillRect(this.ops.legendX, legendY, 20, 20);
          context.fillStyle = 'black';
          context.textAlign = 'left';
          context.fillText(e.name, this.ops.legendX + 30, legendY + 10);
          _results.push(legendY += 30);
        }
        return _results;
      }
    };

    return PieChart;
  })();

  window.Coffeechart = Coffeechart;
}).call(this);
