const magpieMousetracking = function (config, data) {
    data.mousetrackingPath = []
    data.mousetrackingStartTime = Date.now()
    config.internal = {}
    $view = $('.magpie-view')

    if (!config.enabled) {
        return
    }

    var listener = function (evt) {
        var delta = Date.now() - data.mousetrackingStartTime
        data.mousetrackingPath.push({x: evt.originalEvent.layerX, y: evt.originalEvent.layerY, time: delta})
    }

    $view.on('mouseover', listener)

    // cleanup function
    data.mousetracking = {
        cleanup: function () {
            $view.off('mouseover', listener)
        }
    }
};
