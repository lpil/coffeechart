class PieChart
  ### Takes an array of objects with name and amount properties ###
  constructor: (data, colours = null) ->
    @colours = ['red', 'limegreen', 'hotpink', 'orange', 'navy'] unless colours

    @total = data.reduce ((a, e) -> e.amount + a), 0
    total  = @total

    @data = data.map (e) ->
      e.ratio = e.amount / total
      e.chartTotal = total
      e

  draw: (canvas, colours) ->
    startAng = 0
    createSlice = (data, colour) ->
      endAng = startAng + Math.PI*(data.amount/data.chartTotal)*2
      slice = new PieSlice(250, 250, 200, startAng, endAng)
      startAng = slice.endAng
      slice.draw canvas, colour
    @slices = @data.map (e, i) ->
      createSlice e, colours[i % colours.length]


class PieSlice
  constructor: (centerX, centerY, @radius, @startAng, @endAng) ->
    @center   = [centerX, centerY]
    @arcStart = getPoint centerX, centerY, @radius, @startAng
    @arcEnd   = getPoint centerX, centerY, @radius, @endAng

  getPoint = (centX, centY, radius, angle) ->
    [centX + Math.cos(angle)*radius, centY + Math.sin(angle)*radius]

  draw: (canvas, colour) ->
    canvas.moveTo @center...
    canvas.beginPath()
    canvas.lineTo @arcStart...
    canvas.arc @center..., @radius, @startAng, @endAng, false
    canvas.lineTo @center...
    canvas.closePath()
    canvas.strokeStyle = colour
    canvas.stroke()
    canvas.fillStyle = colour
    canvas.fill()
    this

  clear: (canvas) ->
    this.draw canvas, '#fff'
    this

canvas  = document.getElementById 'chart'
context = canvas.getContext '2d'

pie = new PieChart [
  { name: 'foo', amount: 3 }
  { name: 'bar', amount: 6 }
  { name: 'bop', amount: 5 }
  { name: 'kip', amount: 8 }
]


colours = ['red', 'limegreen', 'hotpink', 'orange', 'navy']
pie.draw context, colours
