const magpieMousetracking = function (config, data) {
    var $view = $('.magpie-view')
    var listener = function (evt) {
        var delta = Date.now() - data.mousetrackingStartTime
        data.mousetrackingPath.push({x: evt.originalEvent.layerX, y: evt.originalEvent.layerY, time: delta})
    }

    if (!config.enabled) {
        return
    }

    // cleanup function
    data.mousetracking = {
        cleanup: function () {
            $view.off('mouseover', listener)
        },
        start: function() {
            $view.on('mouseover', listener)
            data.mousetrackingPath = []
            data.mousetrackingStartTime = Date.now()
        }
    }

    if (config.autostart) {
        data.mousetracking.start()
    }
};
