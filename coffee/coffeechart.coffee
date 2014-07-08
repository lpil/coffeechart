window.Coffeechart = {}

# Utility functions used by multiple charts
class Coffeechart.Utils
  # Thanks to https://github.com/chriskempson/base16
  @colours = ['#ac4141', '#d28445', '#f4bf75', '#90a959',
              '#75b5aa', '#6a9fb5', '#aa759f', '#8f5536']
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
  constructor: (data, @options = {}) ->
    @options.colours ||= Coffeechart.Utils.colours
    @options.colours.pop() if data.length % @options.colours.length - 1 == 0
    @options.rotationalOffset ||= 0

    total = data.reduce ((a, e) -> e.amount + a), 0
    data  = data.filter (e) -> e.amount > 0
    @data = data.map (e) ->
      e.ratio = e.amount / total
      e.chartTotal = total
      e

  ###
  Draw the Pie chart with the canvas context supplied
  @param Canvas HTML canvas to draw on
  ###
  draw: (canvas) ->
    canvas.width = canvas.width
    context = canvas.getContext '2d'

    # Use the drawColours if they exist, otherwise use the set colours
    colours = @options.drawColours || @options.colours
    startAng = @options.rotationalOffset

    createSlice = (data, colour) ->
      endAng = startAng + Math.PI*(data.amount/data.chartTotal)*2
# TODO Replace Move chart size + offset to options
      slice = new PieSlice(250, 250, 200, startAng, endAng)
      startAng = slice.endAng
      slice.draw context, colour

    @slices = @data.map (e, i) ->
      createSlice e, colours[i % colours.length]
    this

class PieSlice
  constructor: (centerX, centerY, @radius, @startAng, @endAng) ->
    @center   = [centerX, centerY]
    @arcStart = Coffeechart.Utils.offsetPoint @center..., @radius, @startAng
    @arcEnd   = Coffeechart.Utils.offsetPoint @center..., @radius, @endAng

  draw: (canvas, colour, lineColour = 'white') ->
    # Draw slice
    canvas.moveTo @center...
    canvas.beginPath()
    canvas.lineTo @arcStart...
    canvas.arc @center..., @radius, @startAng, @endAng, false
    canvas.lineTo @center...
    canvas.closePath()
    canvas.fillStyle = colour
    canvas.fill()
    # Draw slice separator line
    canvas.moveTo @center...
    canvas.lineTo @arcStart...
    canvas.strokeStyle = lineColour
    canvas.lineWidth = 2
    canvas.stroke()
    this
