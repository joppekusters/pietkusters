document.addEventListener('DOMContentLoaded', function () {
  var contentContainer = document.getElementById('content-container');

  // Smooth scrolling animation
  function smoothScroll(targetX) {
    var startTime = performance.now();
    var duration = 1200; // Increase duration for longer ease-out animation
    var initialScroll = contentContainer.scrollLeft;

    function step(currentTime) {
      var timeElapsed = currentTime - startTime;
      var scrollAmount = Math.easeOutQuad(timeElapsed, initialScroll, targetX - initialScroll, duration);
      contentContainer.scrollLeft = scrollAmount;
      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        contentContainer.scrollLeft = targetX; // Ensure final position is accurate
      }
    }

    requestAnimationFrame(step);
  }

  // Easing function for smooth scrolling (easeOutQuad)
  Math.easeOutQuad = function (t, b, c, d) {
    t /= d;
    return -c * t*(t-2) + b;
  };

  // Event listener for mouse wheel scrolling
  contentContainer.addEventListener('wheel', function (e) {
    e.preventDefault();
    var delta = e.deltaY * 2; // Increase scrolling speed
    var targetX = contentContainer.scrollLeft + delta;
    smoothScroll(targetX);
  });

  // Event listeners for mouse down, move, and up
  var isMouseDown = false;
  var startX, scrollLeft;

  contentContainer.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    startX = e.pageX - contentContainer.offsetLeft;
    scrollLeft = contentContainer.scrollLeft;

    contentContainer.addEventListener('mousemove', mouseMoveHandler);
  });

  contentContainer.addEventListener('mouseleave', function () {
    if (isMouseDown) {
      isMouseDown = false;
      contentContainer.removeEventListener('mousemove', mouseMoveHandler);
    }
  });

  document.addEventListener('mouseup', function () {
    if (isMouseDown) {
      isMouseDown = false;
      contentContainer.removeEventListener('mousemove', mouseMoveHandler);
    }
  });

  function mouseMoveHandler(e) {
    if (!isMouseDown) return;
    e.preventDefault();
    var x = e.pageX - contentContainer.offsetLeft;
    var walk = (x - startX) * 3; // Increase dragging speed
    var targetX = scrollLeft - walk;
    smoothScroll(targetX);
  }
});

// Function to show overlay
function showOverlay(overlayId) {
  // Hide all overlays
  var overlays = document.querySelectorAll('.overlay');
  overlays.forEach(function(overlay) {
    overlay.style.display = 'none';
  });

  // Show the selected overlay
  var selectedOverlay = document.getElementById(overlayId);
  selectedOverlay.style.display = 'block';

  // Adjust overlay height for mobile devices
  var isMobileDevice = navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
  if (isMobileDevice) {
    var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    var overlayHeight = viewportHeight - 80; // Subtract 80px for the menu buttons
    selectedOverlay.style.height = overlayHeight + 'px';
  }
}

// Function to hide overlay
function hideOverlay(overlayId) {
  var overlay = document.getElementById(overlayId);
  overlay.classList.add('slide-out');
  setTimeout(function() {
    overlay.style.display = 'none';
    overlay.classList.remove('slide-out');
  }, 500); // Adjust timing to match animation duration
}
