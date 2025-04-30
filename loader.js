// loader.js
(function(){
  var s = document.createElement('script');
  // bust cache on the real script
  s.src = 'https://cdn.jsdelivr.net/gh/Cookieemonsterr/auto-zones@latest/auto-zones.js?t=' + Date.now();
  document.body.appendChild(s);
})();
