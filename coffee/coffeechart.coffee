window.Coffeechart = {}

# Utility functions used by multiple charts
class Coffeechart.Utils
  @offsetPoint = (startX, startY, distance, angle) ->
    [
      startX + Math.cos(angle)*distance,
      startY + Math.sin(angle)*distance
    ]

# Draw a Pie Chart
class Coffeechart.PieChart
  ### data: an array of objects with name and amount properties ###
  constructor: (data, @options = {}) ->
    @options.colours ||= ['red', 'limegreen', 'hotpink', 'orange', 'navy']
    @options.rotationalOffset ||= 0

    total = data.reduce ((a, e) -> e.amount + a), 0
    data  = data.filter (e) -> e.amount > 0
    @data = data.map (e) ->
      e.ratio = e.amount / total
      e.chartTotal = total
      e

  # Draw the Pie chart with the canvas context supplied
  draw: (canvas, rotationalOffset) ->
    canvas.width = canvas.width
    context = canvas.getContext '2d'

    # Use the drawColours if they exist, otherwise use the set colours
    colours = @options.drawColours || @options.colours
    startAng = @options.rotationalOffset

    createSlice = (data, colour) ->
      endAng = startAng + Math.PI*(data.amount/data.chartTotal)*2
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

  draw: (canvas, colour) ->
    canvas.moveTo @center...
    canvas.beginPath()
    canvas.lineTo @arcStart...
    canvas.arc @center..., @radius, @startAng, @endAng, false
    canvas.lineTo @center...
    canvas.closePath()
    canvas.lineWidth = 3
    canvas.strokeStyle = 'white'
    canvas.stroke()
    canvas.fillStyle = colour
    canvas.fill()
    this
