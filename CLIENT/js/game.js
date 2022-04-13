var pressedKeys = {}
window.onkeyup = function(e) { pressedKeys[e.key] = false }
window.onkeydown = function(e) { pressedKeys[e.key] = true }