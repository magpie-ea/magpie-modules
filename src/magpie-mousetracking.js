const magpieMousetracking = function (config, data) {
    var $view = $('.magpie-view')
    var listener = function (evt) {
        data.mousetracking.x = evt.originalEvent.clientX
        data.mousetracking.y = evt.originalEvent.clientY
    }
    var interval

    // cleanup function
    data.mousetracking = {
        x: 0,
        y: 0,
        cleanup: function () {
            $view.off('mouseover', listener)
            clearInterval(interval)
            data.mousetrackingDuration = data.mousetrackingTime[data.mousetrackingTime.length - 1]
        },
        start: function (origin) {
            if (!origin || !origin.x || !origin.y) {
                origin = $view.getBoundingClientRect()
            }
            $view.on('mouseover', listener)
            data.mousetrackingX = []
            data.mousetrackingY = []
            data.mousetrackingTime = []
            data.mousetrackingStartTime = Date.now()
            interval = setInterval(function () {
                data.mousetrackingX.push(data.mousetracking.x - origin.x)
                data.mousetrackingY.push(data.mousetracking.y - origin.y)
                data.mousetrackingTime.push(Date.now() - data.mousetrackingStartTime)
            }, 50)
        }
    }

    if (config && config.autostart) {
        data.mousetracking.start()
    }
};
