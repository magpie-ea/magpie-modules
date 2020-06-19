const magpieMousetracking = function (config, data) {
    var $view = $('.magpie-view')
    var listener = function (evt) {
        data.mousetrackingX.push(evt.originalEvent.clientX - data.mousetracking.x)
        data.mousetrackingY.push(evt.originalEvent.clientY - data.mousetracking.y)
        data.mousetrackingTime.push(Date.now() - data.mousetrackingStartTime)
    }
    var rate = config && config.rate ? config.rate : 15

    // cleanup function
    data.mousetracking = {
        x: 0,
        y: 0,
        cleanup: function () {
            $view.off('mouseover', listener)
            data.mousetrackingDuration = data.mousetrackingTime[data.mousetrackingTime.length - 1]
            interpolate(rate)
        },
        start: function (origin) {
            if (!origin || !origin.x || !origin.y) {
                origin = $view.getBoundingClientRect()
            }
            $view.on('mouseover', listener)
            data.mousetrackingStartTime = Date.now()
            data.mousetracking.x = origin.x
            data.mousetracking.y = origin.y
            data.mousetrackingX = [0]
            data.mousetrackingY = [0]
            data.mousetrackingTime = [0]

        }
    }

    if (config && config.autostart) {
        data.mousetracking.start()
    }

    function interpolate(rate) {
        const interpolated = {time: [], x: [], y: []}
        for (let i = 0; i < data.mousetrackingTime.length; i++) {
            interpolated.time.push(data.mousetrackingTime[i])
            interpolated.x.push(data.mousetrackingX[i])
            interpolated.y.push(data.mousetrackingY[i])
            if (i < data.mousetrackingTime.length - 1 &&
                data.mousetrackingTime[i + 1] - data.mousetrackingTime[i] > rate) {
                const steps = ((data.mousetrackingTime[i + 1] - data.mousetrackingTime[i]) / rate) - 1;
                const xDelta = (data.mousetrackingX[i + 1] - data.mousetrackingX[i]) / (steps + 1)
                const yDelta = (data.mousetrackingY[i + 1] - data.mousetrackingY[i]) / (steps + 1)
                const index = interpolated.time.length-1
                for (let j = 0; j < steps; j++) {
                    interpolated.time.push(interpolated.time[index + j] + rate)
                    interpolated.x.push(Math.round(interpolated.x[index + j] + xDelta))
                    interpolated.y.push(Math.round(interpolated.y[index + j] + yDelta))
                }
            }
        }
        data.mousetrackingTime = interpolated.time
        data.mousetrackingX = interpolated.x
        data.mousetrackingY = interpolated.y
    }
};
