window.Coffeechart = {}

# Utility functions used by multiple charts
class Coffeechart.Utils
  # Thanks to https://github.com/chriskempson/base16
  @colours = ['#ac4141', '#d28445', '#f4bf75', '#90a959',
              '#75b5aa', '#6a9fb5', '#aa759f', '#8f5536']
  ###
  Takes 2 objects, and compared them based upon a given property
  For use with the array sort method
  @param Object a
  @param Object b
  @param String Property to compare
  @return Num 1 if a.p > b.p, 0 if equal, -1 otherwise
  ###
  @compareObjProp = (a, b, prop) ->
    if a[prop] < b[prop]
      -1
    else if a[prop] > b[prop]
      1
    else
      0

  ###
  Calculates the co-ords of a point from a point, distance, and angle
  @param Num X axis coordinate
  @param Num Y axis coordinate
  @param Num Distance from given point
  @param Num Direction from given point in radians
  @return Array [x,y] Coordinates of new point
  ###
  @offsetPoint = (startX, startY, distance, angle) ->
    [
      startX + Math.cos(angle)*distance,
      startY + Math.sin(angle)*distance
    ]


class Coffeechart.PieChart
  ###
  A Pie chart!
  @param Array Containing objects with name and amount properties
  ###
  constructor: (data, @canvas, options) ->
    @options = options || {}
    @options.colours ||= Coffeechart.Utils.colours
    @options.colours.pop() if data.length % @options.colours.length - 1 == 0
    @options.rotationalOffset ||= 0
    @options.centerX ||= 200
    @options.centerY ||= 200
    @options.radius  ||= 180
    @options.lineColour  ||= 'white'

    total = data.reduce ((a, e) -> e.amount + a), 0
    data  = data.filter (e) -> e.amount > 0
    @data = data.map (e) ->
      e.ratio = e.amount / total
      e.chartTotal = total
      e
    if @options.sort == true
      compare = (a, b) ->
        Coffeechart.Utils.compareObjProp(a, b, 'ratio')
      @data = @data.sort(compare)

  ###
  Draw the Pie chart with the canvas context supplied
  @param Canvas HTML canvas to draw on
  ###
  draw: ->
    @canvas.width = @canvas.width
    context = @canvas.getContext '2d'
    slices = @slices
    options = @options

    # Use the drawColours if they exist, otherwise use the set colours
    colours = @options.drawColours || @options.colours
    startAng = @options.rotationalOffset

    @data.map (e, i, arr) ->
      endAng = startAng + Math.PI*(e.amount/e.chartTotal)*2
      colour = colours[i % colours.length]
      center   = [options.centerX, options.centerY]
      arcStart = Coffeechart.Utils.offsetPoint(
        center..., options.radius, startAng)
      arcEnd   = Coffeechart.Utils.offsetPoint(
        center..., options.radius, endAng)
      context.moveTo center...
      context.beginPath()
      context.lineTo arcStart...
      context.arc center..., options.radius, startAng, endAng, false
      context.lineTo center...
      context.closePath()
      context.fillStyle = colour
      context.fill()
      if arr.length > 1
        context.moveTo center...
        context.lineTo arcStart...
        context.strokeStyle = options.lineColour
        context.lineWidth = 2
        context.stroke()
      startAng = endAng
