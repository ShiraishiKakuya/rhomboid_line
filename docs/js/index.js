'use strict';

var LINE_AMOUNT = 42;
var TAU = Math.PI * 2;
var ISO_ANGLE = TAU * 27 / 360;
var SEGMENTS = 20;
var SEGMENT_LENGTH = 80;

var polylines = [],
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

function nextAngle() {
  var angles = [ISO_ANGLE, -ISO_ANGLE, Math.PI - ISO_ANGLE, Math.PI + ISO_ANGLE];
  var index = Math.floor(Math.random() * angles.length);
  return angles[index];
}

function lineFactory(line) {
  var obj = line || {};
  obj.color = {};
  obj.color.r = Math.floor((Math.random() * 3 + 1) * 64);
  obj.color.g = Math.floor(Math.random() * 3 * 64);
  obj.color.b = Math.floor(Math.random() * 3 * 64);
  obj.points = [];
  return obj;
}

function init() {
  for (var i = 0; i < LINE_AMOUNT; i++) {
    var line = lineFactory();
    polylines.push(line);
  }
  polylines.forEach(initLine);
}

function nextPoint(line, i, point) {
  var nextPoint = point || {};
  line.angle = nextAngle(line.angle);
  nextPoint.x = line.points[i - 1].x + Math.cos(line.angle) * SEGMENT_LENGTH;
  nextPoint.y = line.points[i - 1].y + Math.sin(line.angle) * SEGMENT_LENGTH;
  line.points.push(nextPoint);
}

function shiftPoint(line) {
  var firstPoint = line.points.shift();
  nextPoint(line, line.points.length, firstPoint);
}

function initLine(line) {
  line.points.push({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height)
  });
  for (var i = 1; i < SEGMENTS; i++) {
    nextPoint(line, i);
  }
  return line;
}

function draw(line) {
  context.strokeStyle = 'rgb(' + line.color.r + ',' + line.color.g + ',' + line.color.b + ')';
  for (var i = 1; i < line.points.length; i++) {
    context.beginPath();
    context.moveTo(line.points[i - 1].x, line.points[i - 1].y);
    context.lineTo(line.points[i].x, line.points[i].y);
    context.stroke();
  }
}

function move(line) {
  polylines.forEach(function (line) {
    for (var i = 0; i < line.points.length; i++) {
      line.points[i].y += 0.08;
    }

    var pointsInside = line.points.filter(function (point) {
      return point.y > 0 && point.y < canvas.height && point.x < canvas.width && point.x > 0;
    });

    if (pointsInside.length === 0) {
      var removedLine = polylines.splice(polylines.indexOf(line), 1)[0];
      polylines.push(initLine(lineFactory(removedLine)));
    }
  });
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
var frameCount = 0;

function animate(timestamp) {
  //context.clearRect(0,0,canvas.width,canvas.height);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  polylines.forEach(move);
  polylines.forEach(draw);

  if (frameCount % 10 == 0) {
    polylines.forEach(shiftPoint);
  }
  frameCount++;
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', function (event) {

  resize();
  init();
  animate();

  window.addEventListener('resize', resize);
});