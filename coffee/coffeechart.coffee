class PiSlice
  constructor: (centerX, centerY, @radius, @startAng, @endAng) ->
    @center   = [centerX, centerY]
    @arcStart = getPoint centerX, centerY, @radius, @startAng
    @arcEnd   = getPoint centerX, centerY, @radius, @endAng

  getPoint = (centX, centY, radius, angle) ->
    [centX + Math.cos(angle)*radius, centY + Math.sin(angle)*radius]

  draw: (canvas, colour = '#000') ->
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


slice = new PiSlice 200, 200, 200, 0, 0.4*Math.PI

canvas  = document.getElementById 'chart'
context = canvas.getContext '2d'

slice.draw context, 'hotpink'
