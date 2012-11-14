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

  /* 
   * Turn canvas into dataURI. Save to stream later
   */
  document.getElementById('save').addEventListener('click', saveImage);
  document.getElementById('save').addEventListener('touchend', saveImage);
  function saveImage(event)
  {
    var pngURL = document.getElementById('canvas').toDataURL();
    //console.log(pngURL);
  }
});
