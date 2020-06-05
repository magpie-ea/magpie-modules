const magpieMousetracking = function (config, data) {
    var $view = $('.magpie-view')
    var listener = function (evt) {
        data.mousetracking.x = evt.originalEvent.layerX
        data.mousetracking.y = evt.originalEvent.layerY
    }
    var interval

    if (!config.enabled) {
        return
    }

    // cleanup function
    data.mousetracking = {
        x: 0,
        y: 0,
        cleanup: function () {
            $view.off('mouseover', listener)
            clearInterval(interval)
        },
        start: function() {
            $view.on('mouseover', listener)
            data.mousetrackingX = []
            data.mousetrackingY = []
            data.mousetrackingTime = []
            data.mousetrackingStartTime = Date.now()
            interval = setInterval(function() {
                data.mousetrackingX.push(data.mousetracking.x)
                data.mousetrackingY.push(data.mousetracking.y)
                data.mousetrackingTime.push(Date.now() - data.mousetrackingStartTime)
            }, 50)
        }
    }

    if (config.autostart) {
        data.mousetracking.start()
    }
};
