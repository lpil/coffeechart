(function() {
  var coffeechart = {};

  coffeechart.utils = (function() {
    function utils() {}

    utils.colours = [
      '#ac4141', '#d28445', '#f4bf75', '#90a959', '#75b5aa', '#6a9fb5',
      '#aa759f', '#8f5536'
    ];

    utils.defalt = function defalt(variable, value) {
      return (variable === undefined) ? value : variable;
    };


    // Takes 2 objects, and compared them based upon a given property
    // For use with the array sort method
    // @param Object a
    // @param Object b
    // @param String Property to compare
    // @return Num 1 if a.p > b.p, 0 if equal, -1 otherwise
    utils.compareObjProp = function(a, b, prop) {
      if (a[prop] < b[prop]) {
        return -1;
      } else if (a[prop] > b[prop]) {
        return 1;
      } else {
        return 0;
      }
    };


    // Calculates the co-ords of a point from a point, distance, and angle
    // @param Num X axis coordinate
    // @param Num Y axis coordinate
    // @param Num Distance from given point
    // @param Num Direction from given point in radians
    // @return Array [x,y] Coordinates of new point
    utils.offsetPoint = function(startX, startY, distance, angle) {
      return [
        startX + Math.cos(angle) * distance,
        startY + Math.sin(angle) * distance
      ];
    };

    return utils;
  })();

  coffeechart.pieChart = (function() {

    // A Pie chart!
    // @param Array Containing objects with name and amount properties
    // @param Canvas The HTML5 canvas to draw to
    // @param Object pieChart Options
    // @return Array Data suitable for building a HTML legend
    function pieChart(data, canvas, ops) {
      var vals = [],
          defalt = coffeechart.utils.defalt,
          total;

      ops = defalt(ops,  {});

      ops.rotationalOffset  = defalt(ops.rotationalOffset, 0);
      ops.centerX           = defalt(ops.centerX,          200);
      ops.centerY           = defalt(ops.centerY,          200);
      ops.radius            = defalt(ops.radius,           180);
      ops.lineColour        = defalt(ops.lineColour,       'white');
      ops.legend            = defalt(ops.legend,           false);

      ops.legendY = defalt(ops.legendY,
          (ops.centerY - ops.radius) * 2);
      ops.legendX = defalt(ops.legendX,
          (ops.centerX * 2 + ops.legendY / 2));

      ops.colours = defalt(ops.colours, coffeechart.utils.colours);
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
        return coffeechart.utils.compareObjProp(a, b, 'ratio');
      });

      this.canvas = canvas;
      this.data = data;
      this.ops = ops;
    }


    // Draw the Pie chart with the canvas context supplied
    // @param Canvas HTML canvas to draw on
    pieChart.prototype.draw = function() {
      var results = [],
          data,
          arcEnd,
          arcStart,
          c,
          center,
          colour,
          colours,
          e,
          endAng,
          legendY,
          offsetPoint,
          ops,
          startAng;

      // Blank the canvas
      this.canvas.width = this.canvas.width;

      ops      = this.ops;
      c        = this.canvas.getContext('2d');
      data     = this.data;
      center   = [ops.centerX, ops.centerY];
      colours  = ops.drawColours || this.ops.colours;
      startAng = ops.rotationalOffset;

      for (var i = 0, l = data.length; i < l; i ++) {
        e = data[i];

        colour = colours[i % colours.length];
        endAng = startAng + Math.PI * (e.amount / e.chartTotal) * 2;
        offsetPoint = coffeechart.utils.offsetPoint;

        arcStart = offsetPoint(
            center[0],
            center[1],
            ops.radius,
            startAng
            );
        arcEnd = offsetPoint(
            center[0],
            center[1],
            ops.radius,
            endAng
            );

        c.moveTo(center[0], center[1]);
        c.beginPath();
        c.fillStyle = colour;

        c.lineTo(arcStart[0], arcStart[1]);
        c.arc(
            center[0],
            center[1],
            ops.radius,
            startAng,
            endAng,
            false);
        c.lineTo(center[0], center[1]);

        c.closePath();
        c.fill();

        // If there is more than once slice, draw divider lines
        if (data.length > 1) {
          c.beginPath();
          c.lineWidth = 2;
          c.strokeStyle = ops.lineColour;

          c.moveTo(center[0], center[1]);
          c.lineTo(arcStart[0], arcStart[1]);
          c.moveTo(center[0], center[1]);
          c.lineTo(arcEnd[0], arcEnd[1]);

          c.closePath();
          c.stroke();
        }
        startAng = endAng;
      }

      // Draw legend
      (function() {
        if (ops.legend) {
          legendY = ops.legendY;
          c.textBaseline = 'middle';
          c.font = 'normal 14px arial';
          for (var i = 0, l = data.length; i < l; i ++) {
            e = data[i];
            colour = colours[i % colours.length];
            c.fillStyle = colour;
            c.fillRect(ops.legendX, legendY, 20, 20);
            c.fillStyle = 'black';
            c.textAlign = 'left';
            c.fillText(e.name, ops.legendX + 30, legendY + 10);
            legendY += 30;
          }
        }
      }());

      (function() {
        // Return useful info
        for (var i = 0, l = data.length; i < l; i ++) {
          e = data[i];
          results.push({
            name:   e.name,
            amount: e.amount,
            ratio:  e.ratio,
            colour: colour
          });
        }
      }());
      return results;
    };

    return pieChart;
  })();

  window.coffeechart = coffeechart;
}).call(this);
