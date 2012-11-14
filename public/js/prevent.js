function prevent(e) {
  e.preventDefault();
}

// For tablet, prevent browser window moving
// TODO: Add checks to ensure touch device to not interfere w/ desktop
DomReady.ready(function() {
  var aElements = document.getElementsByTagName('a');
  for (i = 0; i < aElements.length; i++)
    aElements[i].addEventListener('touchmove', prevent);

  var buttonElements = document.getElementsByTagName('button');
  for (i = 0; i < buttonElements.length; i++)
    buttonElements[i].addEventListener('touchmove', prevent);

  document.getElementById('canvas').addEventListener('touchmove', prevent);
});
