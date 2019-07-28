const magpieDrawShapes = function(trialInfo) {
    // applies user's setting if there are such
    const canvasHeight =
        trialInfo.canvasSettings === undefined ||
        trialInfo.canvasSettings.height === undefined
            ? 300
            : trialInfo.canvasSettings.height;
    const canvasWidth =
        trialInfo.canvasSettings === undefined ||
        trialInfo.canvasSettings.width === undefined
            ? 500
            : trialInfo.canvasSettings.width;
    const canvasBg =
        trialInfo.canvasSettings === undefined ||
        trialInfo.canvasSettings.background === undefined
            ? "white"
            : trialInfo.canvasSettings.background;

    const createCanvas = function(height, width, bg) {
        const canvas = {};
        const canvasElem = document.createElement("canvas");
        const context = canvasElem.getContext("2d");
        canvasElem.classList.add("magpie-view-canvas");
        canvasElem.height = height;
        canvasElem.width = width;
        canvasElem.style.backgroundColor = bg;
        $(".magpie-view-stimulus").prepend(canvasElem);

        // draws a SHAPE of SIZE and COLOR in the position X and Y
        canvas.draw = function(shape, size, x, y, color) {
            context.beginPath();
            if (shape === "circle") {
                context.arc(x, y, size / 2, 0, 2 * Math.PI);
            } else if (shape === "square") {
                context.rect(x - size / 2, y - size / 2, size, size);
            } else if (shape === "triangle") {
                var delta = size / (Math.sqrt(3) * 2);
                context.moveTo(x - size / 2, y + delta);
                context.lineTo(x + size / 2, y + delta);
                context.lineTo(x, y - 2 * delta);
            }

            // sets better base colours
            if (color === "blue") {
                context.fillStyle = "#2c89df";
            } else if (color === "green") {
                context.fillStyle = "#22ce59";
            } else if (color === "red") {
                context.fillStyle = "#ff6347";
            } else if (color === "yellow") {
                context.fillStyle = "#ecd70b";
            } else {
                context.fillStyle = color;
            }
            context.closePath();
            context.fill();
        };

        // generates two sided coordinates
        canvas.getTwoSidedCoords = function(
            rows,
            gap,
            number,
            size,
            direction = "row"
        ) {
            // a list of coords
            var coords = [];
            var tempCoords = [];
            // the space between the elems
            var margin = size / 2;
            var columns, xStart, yStart;

            // reset the rows if not passed or more than the total elems
            rows = rows === 0 || rows === undefined ? 1 : rows;
            rows = rows > number ? number : rows;
            // sets a gap if not specified
            gap =
                gap <= size + margin || gap === undefined ? margin + size : gap;
            // calculates the total number of columns per side
            columns = Math.ceil(number / rows);
            // gets the first coordinate so that the elems are centered on the canvas
            xStart =
                (canvasElem.width - (columns * size + (columns - 2) * margin)) /
                    2 +
                margin / 2 -
                gap / 2;
            yStart =
                (canvasElem.height - (rows * size + (rows - 2) * margin)) / 2 +
                margin;

            // expands the canvas if needed
            if (xStart < margin) {
                canvasElem.width += -2 * xStart;
                xStart = margin;
            }

            // expands the canvas if needed
            if (yStart < margin) {
                canvasElem.height += -2 * yStart;
                yStart = margin;
            }

            // generates the coords
            // for each row
            for (var i = 0; i < rows; i++) {
                // for each elem
                for (var j = 0; j < number; j++) {
                    // x position, y position
                    var xPos, yPos;
                    // position on the right
                    if (
                        Math.floor(j / columns) === i &&
                        j % columns >= Math.ceil(columns / 2)
                    ) {
                        xPos =
                            xStart +
                            (j % columns) * size +
                            (j % columns) * margin +
                            gap;
                        yPos = yStart + i * size + i * margin;
                        tempCoords.push({ x: xPos, y: yPos });
                        // position on the left
                    } else if (Math.floor(j / columns) === i) {
                        xPos =
                            xStart +
                            (j % columns) * size +
                            (j % columns) * margin;
                        yPos = yStart + i * size + i * margin;
                        tempCoords.push({ x: xPos, y: yPos });
                    }
                }
            }

            // coords' position on the canvas
            /*
                ----------------
                |              |
                |   000  00x   |
                |   xxx  xxx   |
                |   xxx  xxx   |
                |              |
                ----------------
            */

            if (direction === "row") {
                coords = tempCoords;
                /*
                ----------------
                |              |
                |   000  xxx   |
                |   00x  xxx   |
                |   xxx  xxx   |
                |              |
                ----------------
            */
            } else if (direction === "side_row") {
                var leftPart = [];
                var rightPart = [];
                for (var i = 0; i < tempCoords.length; i++) {
                    if (i % columns < columns / 2) {
                        leftPart.push(tempCoords[i]);
                    } else {
                        rightPart.push(tempCoords[i]);
                    }
                }

                coords = leftPart.concat(rightPart);
                /*
                ----------------
                |              |
                |   00x  xxx   |
                |   00x  xxx   |
                |   0xx  xxx   |
                |              |
                ----------------
            */
            } else if (direction === "column") {
                var idx;

                for (var i = 0; i < tempCoords.length; i++) {
                    idx = (i % rows) * columns + Math.floor(i / rows);
                    coords.push(tempCoords[idx]);
                }
            }

            return coords;
        };

        // generates random coords
        canvas.getRandomCoords = function(number, size) {
            let coords = [];
            const margin = size / 2;

            // increases the canvas if to small to fit all the elems
            (function() {
                // get the default dimetions of the canvas
                let height = canvasElem.height;
                let width = canvasElem.width;
                // calculate the area of the elements
                let elementsArea = size * size * number;
                let stimContainerElem = $(".magpie-view-stimulus-container");

                // keep increasing the canvas until the elementsArea is smaller than 10% of the overall canvas area
                const increaseCanvas = function(height, width) {
                    if ((height * width) / 10 < elementsArea) {
                        return increaseCanvas(
                            height + height / 10,
                            width + width / 10
                        );
                    } else {
                        return [height, width];
                    }
                };

                // get the height and width
                let [newHeight, newWidth] = increaseCanvas(height, width);

                // apply the new height and width to the canvas elem
                canvasElem.height = newHeight;
                canvasElem.width = newWidth;

                // increase the stimulus container as well to fit the canvas
                stimContainerElem.css("height", newHeight + 20);
            })();

            // generates random x and y coordinates on the canvas for one element
            const generateCoords = function() {
                const maxWidth = canvasElem.width - size;
                const maxHeight = canvasElem.height - size;
                const xPos =
                    Math.floor(Math.random() * (maxWidth - size)) + size;
                const yPos =
                    Math.floor(Math.random() * (maxHeight - size)) + size;

                return { x: xPos, y: yPos };
            };

            // ensures no elements overlap or are too close
            const checkCoords = function(xPos, yPos) {
                for (var i = 0; i < coords.length; i++) {
                    if (
                        xPos + size + margin > coords[i]["x"] &&
                        xPos - size - margin < coords[i]["x"] &&
                        yPos + size + margin > coords[i]["y"] &&
                        yPos - size - margin < coords[i]["y"]
                    ) {
                        return false;
                    }
                }
                return true;
            };

            // generates x and y positions on the canvas for one element
            // checks whether the coord is valid
            const findValidCoords = function() {
                let tempCoords = generateCoords();
                if (checkCoords(tempCoords.x, tempCoords.y)) {
                    coords.push(tempCoords);
                } else {
                    findValidCoords();
                }
            };

            // finds valid coordinates for each element
            for (i = 0; i < number; i++) {
                findValidCoords();
            }

            return coords;
        };

        // generates grid coordinates
        canvas.getGridCoords = function(rows, number, size) {
            var coords = [];
            var margin = size / 2;
            var columns, xStart, yStart;

            // sets the rows to 1 if not passed
            if (rows === 0 || rows === undefined) {
                rows = 1;
            } else if (rows > number) {
                rows = number;
            }

            // calculates the number of columns
            columns = Math.ceil(number / rows);

            // finds the starting point for the x axis so that the image ends up centered
            xStart =
                (canvasElem.width - (columns * size + (columns - 2) * margin)) /
                    2 +
                margin / 2;

            // finds the starting point for the y axis so that the image ends up centered
            yStart =
                (canvasElem.height - (rows * size + (rows - 2) * margin)) / 2 +
                margin;

            // increases the canvas's width if needed
            if (xStart < margin) {
                canvasElem.width += -2 * xStart;
                xStart = margin;
            }

            // increases the canvas's height if needed
            if (yStart < margin) {
                canvasElem.height += -2 * yStart;
                yStart = margin;
            }

            // generates all the coords
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < number; j++) {
                    if (Math.floor(j / columns) === i) {
                        coords.push({
                            x:
                                xStart +
                                (j % columns) * size +
                                (j % columns) * margin,
                            y: yStart + i * size + i * margin
                        });
                    } else {
                        continue;
                    }
                }
            }

            return coords;
        };

        return canvas;
    };

    const canvas = createCanvas(canvasHeight, canvasWidth, canvasBg);
    const coords =
        trialInfo.sort == "grid"
            ? canvas.getGridCoords(
                  trialInfo.rows,
                  trialInfo.total,
                  trialInfo.elemSize
              )
            : trialInfo.sort == "split_grid"
                ? canvas.getTwoSidedCoords(
                      trialInfo.rows,
                      trialInfo.gap,
                      trialInfo.total,
                      trialInfo.elemSize,
                      trialInfo.direction
                  )
                : canvas.getRandomCoords(trialInfo.total, trialInfo.elemSize);

    if (trialInfo.start_with === "other") {
        for (let i = 0; i < trialInfo.total; i++) {
            if (i < trialInfo.total - trialInfo.focalNumber) {
                canvas.draw(
                    trialInfo.otherShape,
                    trialInfo.elemSize,
                    coords[i].x,
                    coords[i].y,
                    trialInfo.otherColor
                );
            } else {
                canvas.draw(
                    trialInfo.focalShape,
                    trialInfo.elemSize,
                    coords[i].x,
                    coords[i].y,
                    trialInfo.focalColor
                );
            }
        }
    } else {
        for (let i = 0; i < trialInfo.total; i++) {
            if (i < trialInfo.focalNumber) {
                canvas.draw(
                    trialInfo.focalShape,
                    trialInfo.elemSize,
                    coords[i].x,
                    coords[i].y,
                    trialInfo.focalColor
                );
            } else {
                canvas.draw(
                    trialInfo.otherShape,
                    trialInfo.elemSize,
                    coords[i].x,
                    coords[i].y,
                    trialInfo.otherColor
                );
            }
        }
    }
};

const errors = {
    contactEmail: `There is no contact_email given. Please give a contact_email to the magpieInit function,

for example:

magpieInit({
    ...
    deploy: {
        ...
        contact_email: 'yourcontactemail@email.sample',
        ...
    },
    ...
});`,

    prolificURL: `There is no prolificURL given. Please give a prolificURL to the magpieInit function,

for example:

magpieInit({
    ...
    deploy: {
        ...
        prolificURL: 'https://app.prolific.ac/submissions/complete?cc=SAMPLE',
        ...
    },
    ...
});`,

    noTrials: `No trials given. Each _magpie view takes an object with an obligatory 'trial' property.

for example:

const introView = intro({
    ...
    trials: 1,
    ...
});

You can find more information at https://github.com/magpie-project/magpie-base#views-in-_magpie`,

    noName: `No name given. Each _magpie view takes an object with an obligatory 'name' property

for example:

const introView = intro({
    ...
    name: 'introView',
    ...
});

You can find more information at https://github.com/magpie-project/magpie-base#views-in-_magpie`,

    noData: `No data given. Each _magpie view takes an object with an obligatory 'data' property

for example:

const mainTrials = forcedChoice({
    ...
    data: my_main_trials,
    ...
});

The data is a list of objects defined in your local js file.

_magpie's trial views expect each trial object to have specific properties. Here is an example of a forcedCoice view trial:

{
    question: 'How are you today?',
    option1: 'fine',
    option2: 'good'
}

You can find more information at https://github.com/magpie-project/magpie-base#views-in-_magpie`,

    noTrialType: `No trial_type given. Each _magpie view takes an object with an obligatory 'trial_type' property

for example:

const mainTrials = forcedChoice({
    ...
    trial_type: 'main trials',
    ...
});

The trial type is needed for recording the results of your experiment.

You can find more information at https://github.com/magpie-project/magpie-base#views-in-_magpie`,

    notAnArray: `The data is not an array. Trial views get an array of objects.

for example:

const mainTrials = forcedChoice({
    ...
    data: [
        {
            prop: val,
            prop: val
        },
        {
            prop: val,
            prop:val
        }
    ],
    ...
});`,
    noSuchViewName: `The view name listed in progress_bar.in does not exist. Use the view names to reference the views in progress_bar.in.

for example:

const mainView = forcedChoice({
    ...
    name: 'myMainView',
    ...
});

const introView = intro({
    ...
    name: 'intro',
    ...
});

magpieInit({
    ...
    progress_bar: {
        in: [
            "myMainView"
        ],
        style: "chunks"
        width: 100
    },
    ...
});
`,
    canvasSort: `No such 'canvas.sort' value. canvas.sort can be 'grid', 'split_grid' or 'random'.

for example:

const myTrials = [
    {
        question: 'Are there circles on the picture',
        option1: 'yes',
        option2: 'yes',
        canvas: {
            ...
            sort: 'split_grid'
            ...
        }
    }
];`
};

const info = {
    canvasTooSmall: `The canvas size was increased because the default canvas size was too small to fit all the elements.
Btw, you can manually change the canvas size by passing 'canvasSettings' to the canvas object,
however, your canvas settings might be overridden if needed. 

For example:

const myTrials = [
    ...
    {
        question: 'Are there circles on the picture',
        option1: 'yes',
        option2: 'no',
        canvas: {
            canvasSettings: {
                height: int,
                width: int
            },
            ...
        }
    },
    ...
];

See https://github.com/magpie-project/magpie-project/blob/master/docs/canvas.md for more information.
`
};

const magpieInit = function(config) {
    const magpie = {};

    // views handler
    magpie.views_seq = _.flatten(config.views_seq);
    magpie.currentViewCounter = 0;
    magpie.currentTrialCounter = 0;
    magpie.currentTrialInViewCounter = 0;

    // progress bar information
    magpie.progress_bar = config.progress_bar;

    // results collection
    // --
    // general data
    magpie.global_data = {
        startDate: Date(),
        startTime: Date.now()
    };
    // data from trial views
    magpie.trial_data = [];

    // more deploy information added
    magpie.deploy = config.deploy;
    magpie.deploy.MTurk_server =
        magpie.deploy.deployMethod == "MTurkSandbox"
            ? "https://workersandbox.mturk.com/mturk/externalSubmit" // URL for MTurk sandbox
            : magpie.deploy.deployMethod == "MTurk"
                ? "https://www.mturk.com/mturk/externalSubmit" // URL for live HITs on MTurk
                : ""; // blank if deployment is not via MTurk
    // if the config_deploy.deployMethod is not debug, then liveExperiment is true
    magpie.deploy.liveExperiment = magpie.deploy.deployMethod !== "debug";
    magpie.deploy.is_MTurk = magpie.deploy.MTurk_server !== "";
    magpie.deploy.submissionURL =
        magpie.deploy.deployMethod == "localServer"
            ? "http://localhost:4000/api/submit_experiment/" +
              magpie.deploy.experimentID
            : magpie.deploy.serverAppURL + magpie.deploy.experimentID;

    // This is not ideal. Should have specified the "serverAppURL" as the base URL, instead of the full URL including "submit_experiment". That naming can be misleading.
    const regex = "/submit_experiment/";
    magpie.deploy.checkExperimentURL = magpie.deploy.submissionURL.replace(
        regex,
        "/check_experiment/"
    );

    if (typeof config.timer === 'undefined') {
        magpie.timer = "";
    } else {
        magpie.timer = config.timer;
        magpieTimer(magpie);
    }

    // adds progress bars to the views
    magpie.progress = magpieProgress(magpie);
    // makes the submit available
    magpie.submission = magpieSubmit(magpie);

    // handles the views rendering
    magpie.findNextView = function() {
        let currentView = magpie.views_seq[magpie.currentViewCounter];

        if (magpie.currentTrialInViewCounter < currentView.trials) {
            currentView.render(currentView.CT, magpie);
        } else {
            magpie.currentViewCounter++;
            currentView = magpie.views_seq[magpie.currentViewCounter];
            magpie.currentTrialInViewCounter = 0;
            if (currentView !== undefined) {
                currentView.render(currentView.CT, magpie);
            } else {
                $("#main").html(
                    `<div class='magpie-view'>
                        <h1 class="title">Nothing more to show</h1>
                    </div>`
                );
                return;
            }
        }
        // increment counter for how many trials we have seen of THIS view during THIS occurrence of it
        magpie.currentTrialInViewCounter++;
        // increment counter for how many trials we have seen in the whole experiment
        magpie.currentTrialCounter++;
        // increment counter for how many trials we have seen of THIS view during the whole experiment
        currentView.CT++;

        // updates the progress bar if the view has one
        if (currentView.hasProgressBar) {
            magpie.progress.update();
        }
    };

    // checks the deployMethod
    (function() {
        if (
            magpie.deploy.deployMethod === "MTurk" ||
            magpie.deploy.deployMethod === "MTurkSandbox"
        ) {
            console.info(
                `The experiment runs on MTurk (or MTurk's sandbox)
----------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted ${magpie.deploy.submissionURL}

and

MTurk's server: ${magpie.deploy.MTurk_server}`
            );
        } else if (magpie.deploy.deployMethod === "Prolific") {
            console.info(
                `The experiment runs on Prolific
-------------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted to ${magpie.deploy.submissionURL}

with

Prolific URL (must be the same as in the website): ${magpie.deploy.prolificURL}`
            );
        } else if (magpie.deploy.deployMethod === "directLink") {
            console.info(
                `The experiment uses Direct Link
-------------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted to ${magpie.deploy.submissionURL}`
            );
        } else if (magpie.deploy.deployMethod === "debug") {
            console.info(
                `The experiment is in Debug Mode
-------------------------------

The results will be displayed in a table at the end of the experiment and available to download in CSV format.`
            );
        } else if (magpie.deploy.deployMethod !== "localServer") {
            throw new Error(
                `There is no such deployMethod.

Please use 'debug', 'directLink', 'Mturk', 'MTurkSandbox', 'localServer' or 'Prolific'.

The deploy method you provided is '${magpie.deploy.deployMethod}'.

You can find more information at https://github.com/magpie-project/magpie-base`
            );
        }

        if (
            magpie.deploy.deployMethod === "Prolific" &&
            (magpie.deploy.prolificURL === undefined ||
                magpie.deploy.prolificURL === "")
        ) {
            throw new Error(errors.prolificURL);
        }

        if (
            magpie.deploy.contact_email === undefined ||
            magpie.deploy.contact_email === ""
        ) {
            throw new Error(errors.contactEmail);
        }
    })();

    // Checks whether the experiment is valid and reachable on the server before proceeding.

    if (magpie.deploy.deployMethod !== "debug") {
        $.ajax({
            type: "GET",
            url: magpie.deploy.checkExperimentURL,
            crossDomain: true,
            success: function(responseData, textStatus, jqXHR) {
                // adds progress bars
                magpie.progress.add();

                // renders the first view
                magpie.findNextView();
            },
            error: function(jqXHR, textStatus, error) {
                alert(
                    `Sorry, there is an error communicating with our server and the experiment cannot proceed. Please return the HIT immediately and contact the author at ${
                        magpie.deploy.contact_email
                    }. Please include the following error message: "${
                        jqXHR.responseText
                    }". Thank you for your understanding.`
                );
            }
        });
    } else {
        // adds progress bars
        magpie.progress.add();

        // renders the first view
        magpie.findNextView();
    }

    // return the magpie-object in debug mode to make debugging easier
    if (magpie.deploy.deployMethod === 'debug'){
        return magpie;
    } else {
        return null;
    }
};

const magpieProgress = function(magpie) {
    let totalProgressParts = 0;
    let progressTrials = 0;
    // customize.progress_bar_style is "chunks" or "separate" {
    let totalProgressChunks = 0;
    let filledChunks = 0;
    let fillChunk = false;

    const progress = {
        // adds progress bar(s) to the views specified experiment.js
        add: function() {
            magpie.views_seq.map((view) => {
                for (let j = 0; j < magpie.progress_bar.in.length; j++) {
                    if (view.name === magpie.progress_bar.in[j]) {
                        totalProgressChunks++;
                        totalProgressParts += view.trials;
                        view.hasProgressBar = true;
                    }
                }
            });
        },

        // updates the progress of the progress bar
        // creates a new progress bar(s) for each view that has it and updates it
        update: function() {
            try {
                addToDOM();
            } catch (e) {
                console.error(e.message);
            }

            const progressBars = $(".progress-bar");
            let div, filledPart;

            if (magpie.progress_bar.style === "default") {
                div = $(".progress-bar").width() / totalProgressParts;
                filledPart = progressTrials * div;
            } else {
                div =
                    $(".progress-bar").width() /
                    magpie.views_seq[magpie.currentViewCounter].trials;
                filledPart = (
                    (magpie.currentTrialInViewCounter - 1) *
                    div
                ).toFixed(4);
            }

            const filledElem = jQuery("<span/>", {
                id: "filled"
            }).appendTo(progressBars[filledChunks]);

            $("#filled").css("width", filledPart);
            progressTrials++;

            if (magpie.progress_bar.style === "chunks") {
                if (fillChunk === true) {
                    filledChunks++;
                    fillChunk = false;
                }

                if (
                    filledElem.width().toFixed(4) ===
                    ($(".progress-bar").width() - div).toFixed(4)
                ) {
                    fillChunk = true;
                }

                for (var i = 0; i < filledChunks; i++) {
                    progressBars[i].style.backgroundColor = "#5187BA";
                }
            }
        }
    };

    // creates progress bar element(s) and add(s) it(them) to the view
    const addToDOM = function() {
        var bar;
        var i;
        var view = $(".magpie-view");
        var barWidth = magpie.progress_bar.width;
        var clearfix = jQuery("<div/>", {
            class: "clearfix"
        });
        var container = jQuery("<div/>", {
            class: "progress-bar-container"
        });
        view.css("padding-top", 30);
        view.prepend(clearfix);
        view.prepend(container);

        if (magpie.progress_bar.style === "chunks") {
            for (i = 0; i < totalProgressChunks; i++) {
                bar = jQuery("<div/>", {
                    class: "progress-bar"
                });
                bar.css("width", barWidth);
                container.append(bar);
            }
        } else if (magpie.progress_bar.style === "separate") {
            bar = jQuery("<div/>", {
                class: "progress-bar"
            });
            bar.css("width", barWidth);
            container.append(bar);
        } else if (magpie.progress_bar.style === "default") {
            bar = jQuery("<div/>", {
                class: "progress-bar"
            });
            bar.css("width", barWidth);
            container.append(bar);
        } else {
            throw new Error(
                'Progress_bar.style can be set to "default", "separate" or "chunks" in experiment.js'
            );
        }
    };

    return progress;
};

function magpieSubmit(magpie) {
    const submit = {
        // submits the data
        // trials - the data collected from the experiment
        // global_data - other data (start date, user agent, etc.)
        // config - information about the deploy method and URLs
        submit: function(magpie) {
            // construct data object for output
            let data = {
                experiment_id: magpie.deploy.experimentID,
                trials: addEmptyColumns(magpie.trial_data)
            };

            // merge in global_data accummulated so far
            // this could be unsafe if 'global_data' contains keys used in 'trials'!!
            data = _.merge(magpie.global_data, data);

            // add more fields depending on the deploy method
            if (magpie.deploy.is_MTurk) {
                const HITData = getHITData();
                data["assignment_id"] = HITData["assignmentId"];
                data["worker_id"] = HITData["workerId"];
                data["hit_id"] = HITData["hitId"];

                // creates a form with assignmentId input for the submission ot MTurk
                var form = jQuery("<form/>", {
                    id: "mturk-submission-form",
                    action: magpie.deploy.MTurk_server,
                    method: "POST"
                }).appendTo(".magpie-thanks-view");
                jQuery("<input/>", {
                    type: "hidden",
                    name: "trials",
                    value: JSON.stringify(data)
                }).appendTo(form);
                // MTurk expects a key 'assignmentId' for the submission to work,
                // that is why is it not consistent with the snake case that the other keys have
                jQuery("<input/>", {
                    type: "hidden",
                    name: "assignmentId",
                    value: HITData["assignmentId"]
                }).appendTo(form);
            }

            // if the experiment is set to live (see config liveExperiment)
            // the results are sent to the server
            // if it is set to false
            // the results are displayed on the thanks slide
            if (magpie.deploy.liveExperiment) {
                //submitResults(config_deploy.contact_email, config_deploy.submissionURL, data);
                submitResults(
                    magpie.deploy.contact_email,
                    magpie.deploy.submissionURL,
                    flattenData(data),
                    magpie.deploy
                );
            } else {
                const flattenedData = flattenData(data);
                jQuery("<div/>", {
                    class: "magpie-debug-results",
                    html: formatDebugData(flattenedData)
                }).appendTo($("#magpie-debug-table-container"));
                createCSVForDownload(flattenedData);
            }
        }
    };

    // submits data to the server and MTurk's server if the experiment runs on MTurk
    function submitResults(contactEmail, submissionURL, data, config) {
        // set a default contact email
        contactEmail =
            typeof contactEmail !== "undefined" ? contactEmail : "not provided";

        $.ajax({
            type: "POST",
            url: submissionURL,
            crossDomain: true,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(responseData, textStatus, jqXHR) {
                $("#warning-message").addClass("magpie-nodisplay");
                $("#thanks-message").removeClass("magpie-nodisplay");
                $("#extra-message").removeClass("magpie-nodisplay");

                if (config.is_MTurk) {
                    // submits to MTurk's server if isMTurk = true
                    setTimeout(function() {
                        submitToMTurk(data), 500;
                    });
                }
            },
            error: function(responseData, textStatus, errorThrown) {
                // There is this consideration about whether we should still allow such a submission that failed on our side to proceed on submitting to MTurk. Maybe we should after all.
                if (config.is_MTurk) {
                    // submits to MTurk's server if isMTurk = true
                    submitToMTurk(data);

                    // shows a thanks message after the submission
                    $("#thanks-message").removeClass("magpie-nodisplay");
                } else {
                    // It seems that this timeout (waiting for the server) is implemented as a default value in many browsers, e.g. Chrome. However it is really long (1 min) so timing out shouldn't be such a concern.
                    if (textStatus == "timeout") {
                        alert(
                            "Oops, the submission timed out. Please try again. If the problem persists, please contact " +
                                contactEmail +
                                ", including your ID"
                        );
                    } else {
                        alert(
                            "Oops, the submission failed. The server says: " +
                                responseData.responseText +
                                "\nPlease try again. If the problem persists, please contact " +
                                contactEmail +
                                "with this error message, including your ID"
                        );
                    }
                }
            }
        });
    }

    // submits to MTurk's servers
    // and the correct url is given in config.MTurk_server
    const submitToMTurk = function() {
        var form = $("#mturk-submission-form");
        form.submit();
    };

    // adds columns with NA values
    const addEmptyColumns = function(trialData) {
        var columns = [];

        for (var i = 0; i < trialData.length; i++) {
            for (var prop in trialData[i]) {
                if (
                    trialData[i].hasOwnProperty(prop) &&
                    columns.indexOf(prop) === -1
                ) {
                    columns.push(prop);
                }
            }
        }

        for (var j = 0; j < trialData.length; j++) {
            for (var k = 0; k < columns.length; k++) {
                if (!trialData[j].hasOwnProperty(columns[k])) {
                    trialData[j][columns[k]] = "NA";
                }
            }
        }

        return trialData;
    };

    // prepare the data form debug mode
    const formatDebugData = function(flattenedData) {
        var output = "<table id='magpie-debug-table'>";

        var t = flattenedData[0];

        output += "<thead><tr>";

        for (var key in t) {
            if (t.hasOwnProperty(key)) {
                output += "<th>" + key + "</th>";
            }
        }

        output += "</tr></thead>";

        output += "<tbody><tr>";

        var entry = "";

        for (var i = 0; i < flattenedData.length; i++) {
            var currentTrial = flattenedData[i];
            for (var k in t) {
                if (currentTrial.hasOwnProperty(k)) {
                    entry = String(currentTrial[k]);
                    output += "<td>" + entry.replace(/ /g, "&nbsp;") + "</td>";
                }
            }

            output += "</tr>";
        }

        output += "</tbody></table>";

        return output;
    };

    const createCSVForDownload = function(flattenedData) {
        var csvOutput = "";

        var t = flattenedData[0];

        for (var key in t) {
            if (t.hasOwnProperty(key)) {
                csvOutput += '"' + String(key) + '",';
            }
        }
        csvOutput += "\n";
        for (var i = 0; i < flattenedData.length; i++) {
            var currentTrial = flattenedData[i];
            for (var k in t) {
                if (currentTrial.hasOwnProperty(k)) {
                    csvOutput += '"' + String(currentTrial[k]) + '",';
                }
            }
            csvOutput += "\n";
        }

        var blob = new Blob([csvOutput], {
            type: "text/csv"
        });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, "results.csv");
        } else {
            jQuery("<a/>", {
                class: "magpie-view-button",
                html: "Download the results as CSV",
                href: window.URL.createObjectURL(blob),
                download: "results.csv"
            }).appendTo($(".magpie-thanks-view"));
        }
    };

    const flattenData = function(data) {
        var trials = data.trials;
        delete data.trials;

        // The easiest way to avoid name clash is just to check the keys one by one and rename them if necessary.
        // Though I think it's also the user's responsibility to avoid such scenarios...
        var sample_trial = trials[0];
        for (var trial_key in sample_trial) {
            if (sample_trial.hasOwnProperty(trial_key)) {
                if (data.hasOwnProperty(trial_key)) {
                    // Much easier to just operate it once on the data, since if we also want to operate on the trials we'd need to loop through each one of them.
                    var new_data_key = "glb_" + trial_key;
                    data[new_data_key] = data[trial_key];
                    delete data[trial_key];
                }
            }
        }

        var out = _.map(trials, function(t) {
            // Here the data is the general informatoin besides the trials.
            return _.merge(t, data);
        });
        return out;
    };

    // parses the url to get the assignmentId and workerId
    const getHITData = function() {
        const url = window.location.href;
        let qArray = url.split("?");
        let HITData = {};

        if (qArray[1] === undefined) {
            throw new Error(
                "Cannot get participant' s assignmentId from the URL (happens if the experiment does NOT run on MTurk or MTurkSandbox)."
            );
        } else {
            qArray = qArray[1].split("&");

            for (var i = 0; i < qArray.length; i++) {
                HITData[qArray[i].split("=")[0]] = qArray[i].split("=")[1];
            }
        }

        return HITData;
    };

    return submit;
}

const magpieTimer = function(magpie) {
    // idle time in seconds, gets reset as soon as the user does something
    let idle_time = 0;
    // time in seconds a user can spent idle (default: 600)
    const max_time = typeof magpie.timer.minutes !== 'undefined' ? magpie.timer.minutes * 60 : 10 * 60;
    // percentage of timer time left, after which information is displayed, between 0 and 1 (default: 0.2, i.e. last 20% of timer)
    const show_info_time = typeof magpie.timer.show_info_time !== 'undefined'? magpie.timer.show_info_time : 0.2;
    // text displayed on the snackbar, to inform the user that he should do something (default: "Still here?")
    const snack_text = typeof magpie.timer.snack_text!== 'undefined' ? magpie.timer.snack_text : "Still here?";
    // whether to display the remaining time in seconds on the snachbar (default: true)
    const show_info_time_time = typeof magpie.timer.show_info_time_time !== 'undefined' ? magpie.timer.show_info_time_time : true;
    // information needed for blinking of page title
    let is_old_title = true;
    const old_title = document.title;
    // text displayed in the blinking page title (default: "Still here?")
    const new_title = typeof magpie.timer.new_title !== 'undefined' ?  magpie.timer.new_title : "Still here?";
    // function that is called after the timer is finished (default: function() {location.reload(true)}, i.e. page refresh)
    const end_function = typeof magpie.timer.end_function !== 'undefined' ? magpie.timer.end_function : function() {location.reload(true)};

    // function to add the information snackbar to the dom
    const add_timer = function(){
        const view = $("#main");
        const container = jQuery("<div/>", {
            id: "snackbar"
        });
        view.after(container);
    };

    // resets the timer, everytime this function is called
    const reset_timer = function() {
        idle_time = 0;
    };

    // reset the timer, everytime one of the events is triggered, i.e. user did somethign with the keyboard or mouse
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
    events.forEach(function(name) {
        document.addEventListener(name, reset_timer, true);
    });

    // function to increment the timer, display information about the remaining time and execution of the end_function
    function timer_increment() {
        // increment time by 0.5 seconds
        idle_time = idle_time + 0.5;
        // get the snackbar and update the content
        let snackbar = document.getElementById("snackbar");
        snackbar.innerHTML = `${snack_text} <br> ${show_info_time_time? `${max_time - Math.ceil(idle_time)} seconds remaining`: ''}`;
        // timer has still plenty of time left, hide snackbar (or fade it out)
        if (idle_time  < (1-show_info_time) * max_time) {
            snackbar.className = snackbar.className == "show"? "fade" : "hide";
            document.title = old_title;
        // last show_info_time percent of time, show snackbar and blink page title
        } else if (idle_time < max_time ) {
            snackbar.className = "show";
            document.title = is_old_title? old_title : new_title;
            is_old_title = !is_old_title;
        // timer is finished, reset the timer and call the end_function
        } else {
            reset_timer();
            end_function();
        }
    }

    add_timer(); // created the snackbar
    const idle_interval = setInterval(timer_increment, 500); // call the increment function every 500ms
};

const magpieUtils = {
    view: {
        inspector: {
            // checks whether name and trials are present
            params: function(config, view) {
                if (config.trials === undefined || config.trials === "") {
                    throw new Error(errors.noTrials.concat(findFile(view)));
                }

                if (config.name === undefined || config.name === "") {
                    throw new Error(errors.noName.concat(findFile(view)));
                }
            },

            // checks whether data is passed to the trial views and whether it is an array
            missingData: function(config, view) {
                if (config.data === undefined || config.data === null) {
                    throw new Error(errors.noData.concat(this.findFile(view)));
                }

                if (config.data instanceof Array === false) {
                    throw new Error(
                        errors.notAnArray.concat(this.findFile(view))
                    );
                }

                if (
                    config.trial_type === undefined ||
                    config.trial_type === ""
                ) {
                    throw new Error(
                        errors.noTrialType.concat(this.findFile(view))
                    );
                }
            },

            // finds in which type of view the error occurs
            findFile: function(view) {
                return `The problem is in ${view} view type.`;
            }
        },
        setter: {
            prop: function(prop, dflt) {
                return prop === undefined ? dflt : prop;
            },

            // sets a default title for the views that are not given a title
            title: function(title, dflt) {
                return title === undefined ? dflt : title;
            },

            // sets a default prolificConfirmText to the thanks view if not given
            prolificConfirmText: function(text, dflt) {
                return text === undefined || text === "" ? dflt : text;
            },

            // sets default button text for the views that are not given button text
            buttonText: function(buttonText) {
                return buttonText === undefined || buttonText === ""
                    ? "Next"
                    : buttonText;
            },

            question: function(question) {
                if (question === undefined || question === "") {
                    console.warn("this trial has no 'question'");
                    return "";
                } else {
                    return question;
                }
            },

            QUD: function(qud) {
                if (qud === undefined || qud === "") {
                    return "";
                } else {
                    return qud;
                }
            }
        },
        createTrialDOM: function(config, enableResponse) {
            const pause = config.pause;
            const fix_duration = config.fix_duration;
            const stim_duration = config.stim_duration;
            const data = config.data;
            const view = config.view;
            const evts = config.evts !== undefined ? config.evts : {};

            // checks if there is a pause and shows the pause screen
            const showPause = (resolve, reject) => {
                if (
                    pause !== undefined &&
                    typeof pause === "number" &&
                    isNaN(pause) === false
                ) {
                    setTimeout(() => {
                        resolve();
                    }, pause);
                } else {
                    resolve();
                }
            };

            // checks if there is a fixation point and shows the fixation point
            const showFixPoint = (resolve, reject) => {
                if (
                    fix_duration !== undefined &&
                    typeof fix_duration === "number" &&
                    isNaN(fix_duration) === false
                ) {
                    const fixPoint = jQuery("<div/>", {
                        class: "magpie-view-fix-point"
                    });
                    $(".magpie-view-stimulus-container").prepend(fixPoint);

                    setTimeout(() => {
                        fixPoint.remove();
                        resolve();
                    }, fix_duration);
                } else {
                    resolve();
                }
            };

            // checks if there is a stimulus and shows it
            const showStim = (resolve, reject) => {
                $(".magpie-view-stimulus").removeClass("magpie-nodisplay");

                if (data.picture !== undefined) {
                    $(".magpie-view-stimulus").prepend(
                        `<div class='magpie-view-picture'>
                    <img src=${data.picture}>
                </div>`
                    );
                }

                if (data.canvas) {
                    magpieDrawShapes(data.canvas);
                }

                resolve();
            };

            // hides the stimulus
            const hideStim = (resolve, reject) => {
                const spacePressed = function(e, resolve) {
                    if (e.which === 32) {
                        $(".magpie-view-stimulus").addClass("magpie-invisible");
                        $("body").off("keydown", spacePressed);
                        resolve();
                    }
                };

                if (view === "imageSelection") {
                    $(".magpie-view-stimulus-container").addClass(
                        "magpie-nodisplay"
                    );
                    resolve();
                }

                if (
                    stim_duration !== undefined &&
                    typeof stim_duration === "number"
                ) {
                    setTimeout(() => {
                        $(".magpie-view-stimulus").addClass("magpie-invisible");
                        resolve();
                    }, stim_duration);
                } else if (stim_duration === "space") {
                    $("body").on("keydown", (e) => {
                        spacePressed(e, resolve);
                    });
                } else {
                    resolve();
                }
            };

            const hookEvts = function(e) {
                return new Promise((res, rej) => {
                    if (e !== undefined) {
                        e(data, res);
                    } else {
                        res();
                    }
                });
            };

            // 1. shows a blank screen (optional)
            // 2. then shows a fixation point (optional)
            // 3. then shows the stimulus (obligatory)
            // 4. then hides the stimulus (optional)
            // 5. then enables the interations from the participant (obligatory)
            new Promise(showPause)
                .then(() => hookEvts(evts.after_pause))
                .then(() => {
                    return new Promise(showFixPoint);
                })
                .then(() => hookEvts(evts.after_fix_point))
                .then(() => {
                    return new Promise(showStim);
                })
                .then(() => hookEvts(evts.after_stim_shown))
                .then(() => {
                    return new Promise(hideStim);
                })
                .then(() => hookEvts(evts.after_stim_hidden))
                .then(() => {
                    enableResponse();
                })
                .then(() => hookEvts(evts.after_response_enabled));
        }
    },
    views: {
        loop: function(arr, count, shuffleFlag) {
            return _.flatMapDeep(_.range(count), function(i) {
                return arr;
            });
        },
        loopShuffled: function(arr, count) {
            return _.flatMapDeep(_.range(count), function(i) {
                return _.shuffle(arr);
            });
        }
    }
};

const magpieViews = {
    intro: function(config) {
        magpieUtils.view.inspector.params(config, "intro");
        const intro = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, "Welcome!"),
            text: config.text,
            button: magpieUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, magpie) {
                let prolificId;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <section class="magpie-text-container">
                        <p class="magpie-view-text">${this.text}</p>
                    </section>
                    <button id="next" class='magpie-view-button' class="magpie-nodisplay">${
                        this.button
                    }</button>
                </div>`;

                $("#main").html(viewTemplate);

                const prolificForm = `<p id="prolific-id-form">
                    <label for="prolific-id">Please, enter your Prolific ID</label>
                    <input type="text" id="prolific-id" />
                </p>`;

                const next = $("#next");

                function showNextBtn() {
                    if (prolificId.val().trim() !== "") {
                        next.removeClass("magpie-nodisplay");
                    } else {
                        next.addClass("magpie-nodisplay");
                    }
                }

                if (magpie.deploy.deployMethod === "Prolific") {
                    $(".magpie-text-container").append(prolificForm);
                    next.addClass("magpie-nodisplay");
                    prolificId = $("#prolific-id");

                    prolificId.on("keyup", function() {
                        showNextBtn();
                    });

                    prolificId.on("focus", function() {
                        showNextBtn();
                    });
                }

                // moves to the next view
                next.on("click", function() {
                    if (magpie.deploy.deployMethod === "Prolific") {
                        magpie.global_data.prolific_id = prolificId.val().trim();
                    }

                    magpie.findNextView();
                });
            },
            CT: 0,
            // for how many trials should this view be repeated?
            trials: config.trials
        };

        return intro;
    },

    instructions: function(config) {
        magpieUtils.view.inspector.params(config, "instructions");
        const instructions = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, "Instructions"),
            text: config.text,
            button: magpieUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, magpie) {
                const viewTemplate = `<div class="magpie-view">
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <section class="magpie-text-container">
                        <p class="magpie-view-text">${this.text}</p>
                    </section>
                    <button id="next" class='magpie-view-button'>${
                        this.button
                    }</button>
                </div>`;

                $("#main").html(viewTemplate);

                // moves to the next view
                $("#next").on("click", function() {
                    magpie.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return instructions;
    },

    begin: function(config) {
        magpieUtils.view.inspector.params(config, "begin experiment");
        const begin = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, "Begin"),
            text: config.text,
            button: magpieUtils.view.setter.buttonText(config.buttonText),
            // render function renders the view
            render: function(CT, magpie) {
                const viewTemplate = `<div class="magpie-view">
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <section class='magpie-text-container'>
                        <p class='magpie-view-text'>${this.text}</p>
                    </section>
                    <button id='next' class='magpie-view-button'>${
                        this.button
                    }</button>
                </div>`;

                $("#main").html(viewTemplate);

                // moves to the next view
                $("#next").on("click", function() {
                    magpie.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return begin;
    },

    forcedChoice: function(config) {
        magpieUtils.view.inspector.missingData(config, "forced choice");
        magpieUtils.view.inspector.params(config, "forced choice");
        const forcedChoice = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;

                $("#main").html(viewTemplate);

                const answerContainerElem = `<div class='magpie-view-answer-container'>
                    <p class='magpie-view-question'>${question}</p>
                    <label for='o1' class='magpie-response-buttons'>${option1}</label>
                    <input type='radio' name='answer' id='o1' value=${option1} />
                    <input type='radio' name='answer' id='o2' value=${option2} />
                    <label for='o2' class='magpie-response-buttons'>${option2}</label>
                </div>`;

                const enableResponse = function() {
                    $(".magpie-view").append(answerContainerElem);

                    // attaches an event listener to the yes / no radio inputs
                    // when an input is selected a response property with a value equal
                    // to the answer is added to the trial object
                    // as well as a readingTimes property with value
                    $("input[name=answer]").on("change", function() {
                        const RT = Date.now() - startingTime;
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: $("input[name=answer]:checked").val(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "forcedChoice"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return forcedChoice;
    },

    sliderRating: function(config) {
        magpieUtils.view.inspector.missingData(config, "slider rating");
        magpieUtils.view.inspector.params(config, "slider rating");
        const sliderRating = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].optionLeft;
                const option2 = config.data[CT].optionRight;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-QUD'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='magpie-view-question'>${question}</p>
                <div class='magpie-view-answer-container'>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
                <button id="next" class='magpie-view-button magpie-nodisplay'>Next</button>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let response;

                    $(".magpie-view").append(answerContainerElem);

                    response = $("#response");
                    // checks if the slider has been changed
                    response.on("change", function() {
                        $("#next").removeClass("magpie-nodisplay");
                    });
                    response.on("click", function() {
                        $("#next").removeClass("magpie-nodisplay");
                    });

                    $("#next").on("click", function() {
                        const RT = Date.now() - startingTime; // measure RT before anything else
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: response.val(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "sliderRating"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return sliderRating;
    },

    textboxInput: function(config) {
        magpieUtils.view.inspector.missingData(config, "textbox input");
        magpieUtils.view.inspector.params(config, "textbox input");
        const textboxInput = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const minChars =
                    config.data[CT].min_chars === undefined
                        ? 10
                        : config.data[CT].min_chars;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='magpie-view-question'>${question}</p>
                    <div class='magpie-view-answer-container'>
                        <textarea name='textbox-input' rows=10 cols=50 class='magpie-response-text' />
                    </div>
                    <button id='next' class='magpie-view-button magpie-nodisplay'>next</button>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let next;
                    let textInput;

                    $(".magpie-view").append(answerContainerElem);

                    next = $("#next");
                    textInput = $("textarea");

                    // attaches an event listener to the textbox input
                    textInput.on("keyup", function() {
                        // if the text is longer than (in this case) 10 characters without the spaces
                        // the 'next' button appears
                        if (textInput.val().trim().length > minChars) {
                            next.removeClass("magpie-nodisplay");
                        } else {
                            next.addClass("magpie-nodisplay");
                        }
                    });

                    // the trial data gets added to the trial object
                    next.on("click", function() {
                        var RT = Date.now() - startingTime; // measure RT before anything else
                        var trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: textInput.val().trim(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "textboxInput"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return textboxInput;
    },

    dropdownChoice: function(config) {
        magpieUtils.view.inspector.missingData(config, "dropdown choice");
        magpieUtils.view.inspector.params(config, "dropdown choice");
        const dropdownChoice = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const question_left_part =
                    config.data[CT].question_left_part === undefined
                        ? ""
                        : config.data[CT].question_left_part;
                const question_right_part =
                    config.data[CT].question_right_part === undefined
                        ? ""
                        : config.data[CT].question_right_part;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<div class='magpie-view-answer-container magpie-response-dropdown'>
                    ${question_left_part}
                    <select id='response' name='answer'>
                        <option disabled selected></option>
                        <option value=${option1}>${option1}</option>
                        <option value=${option2}>${option2}</option>
                    </select>
                    ${question_right_part}
                    </p>
                    <button id='next' class='magpie-view-button magpie-nodisplay'>Next</button>
                </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let response;

                    $(".magpie-view").append(answerContainerElem);

                    response = $("#response");

                    response.on("change", function() {
                        $("#next").removeClass("magpie-nodisplay");
                    });

                    $("#next").on("click", function() {
                        const RT = Date.now() - startingTime; // measure RT before anything else
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            question: question_left_part
                                .concat("...answer here...")
                                .concat(question_right_part),
                            response: $(response).val(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "dropdownChoice"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return dropdownChoice;
    },

    ratingScale: function(config) {
        magpieUtils.view.inspector.missingData(config, "rating scale");
        magpieUtils.view.inspector.params(config, "rating scale");
        const ratingScale = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].optionLeft;
                const option2 = config.data[CT].optionRight;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='magpie-view-question'>${question}</p>
                    <div class='magpie-view-answer-container'>
                        <strong class='magpie-response-rating-option magpie-view-text'>${option1}</strong>
                        <label for="1" class='magpie-response-rating'>1</label>
                        <input type="radio" name="answer" id="1" value="1" />
                        <label for="2" class='magpie-response-rating'>2</label>
                        <input type="radio" name="answer" id="2" value="2" />
                        <label for="3" class='magpie-response-rating'>3</label>
                        <input type="radio" name="answer" id="3" value="3" />
                        <label for="4" class='magpie-response-rating'>4</label>
                        <input type="radio" name="answer" id="4" value="4" />
                        <label for="5" class='magpie-response-rating'>5</label>
                        <input type="radio" name="answer" id="5" value="5" />
                        <label for="6" class='magpie-response-rating'>6</label>
                        <input type="radio" name="answer" id="6" value="6" />
                        <label for="7" class='magpie-response-rating'>7</label>
                        <input type="radio" name="answer" id="7" value="7" />
                        <strong class='magpie-response-rating-option magpie-view-text'>${option2}</strong>
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".magpie-view").append(answerContainerElem);
                    // attaches an event listener to the yes / no radio inputs
                    // when an input is selected a response property with a value equal
                    // to the answer is added to the trial object
                    // as well as a readingTimes property with value
                    $("input[name=answer]").on("change", function() {
                        const RT = Date.now() - startingTime; // measure RT before anything else
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: $("input[name=answer]:checked").val(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "ratingScale"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return ratingScale;
    },

    sentenceChoice: function(config) {
        magpieUtils.view.inspector.missingData(config, "sentence choice");
        magpieUtils.view.inspector.params(config, "sentence choice");
        const sentenceChoice = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `
                    <div class='magpie-view-answer-container'>
                        <p class='magpie-view-question'>${question}</p>
                        <label for='s1' class='magpie-response-sentence'>${option1}</label>
                        <input type='radio' name='answer' id='s1' value="${option1}" />
                        <label for='s2' class='magpie-response-sentence'>${option2}</label>
                        <input type='radio' name='answer' id='s2' value="${option2}" />
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".magpie-view").append(answerContainerElem);

                    $("input[name=answer]").on("change", function(e) {
                        var RT = Date.now() - startingTime; // measure RT before anything else
                        var trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: e.target.value,
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "sentenceChoice"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return sentenceChoice;
    },

    imageSelection: function(config) {
        magpieUtils.view.inspector.missingData(config, "image selection");
        magpieUtils.view.inspector.params(config, "image selection");
        const imageSelection = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const picture1 = config.data[CT].picture1;
                const picture2 = config.data[CT].picture2;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class="magpie-view">
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `<div class='magpie-view-answer-container'>
                        <p class='magpie-view-question'>${question}</p>
                        <label for="img1" class='magpie-view-picture magpie-response-picture'><img src=${picture1}></label>
                        <input type="radio" name="answer" id="img1" value="${option1}" />
                        <input type="radio" name="answer" id="img2" value="${option2}" />
                        <label for="img2" class='magpie-view-picture magpie-response-picture'><img src=${picture2}></label>
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".magpie-view").append(answerContainerElem);
                    $("input[name=answer]").on("change", function() {
                        const RT = Date.now() - startingTime; // measure RT before anything else
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: $("input[name=answer]:checked").val(),
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "imageSelection"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return imageSelection;
    },

    keyPress: function(config) {
        magpieUtils.view.inspector.missingData(config, "key press");
        magpieUtils.view.inspector.params(config, "key press");
        const keyPress = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const key1 = config.data[CT].key1;
                const key2 = config.data[CT].key2;
                const value1 = config.data[CT][key1];
                const value2 = config.data[CT][key2];
                const viewTemplate = `<div class="magpie-view">
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-response-keypress-header'><strong>${key1}</strong> = ${value1}, <strong>${key2}</strong> = ${value2}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `<div class='magpie-view-answer-container'>
                        <p class='magpie-view-question'>${question}</p>`;

                $("#main").html(viewTemplate);

                const handleKeyPress = function(e) {
                    const keyPressed = String.fromCharCode(
                        e.which
                    ).toLowerCase();

                    if (keyPressed === key1 || keyPressed === key2) {
                        let correctness;
                        const RT = Date.now() - startingTime; // measure RT before anything else

                        if (
                            config.data[CT].expected ===
                            config.data[CT][keyPressed.toLowerCase()]
                        ) {
                            correctness = "correct";
                        } else {
                            correctness = "incorrect";
                        }

                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            key_pressed: keyPressed,
                            correctness: correctness,
                            RT: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        trial_data[config.data[CT].key1] =
                            config.data[CT][key1];
                        trial_data[config.data[CT].key2] =
                            config.data[CT][key2];

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        $("body").off("keydown", handleKeyPress);
                        magpie.findNextView();
                    }
                };

                const enableResponse = function() {
                    $(".magpie-view").append(answerContainerElem);
                    $("body").on("keydown", handleKeyPress);
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "keyPress"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return keyPress;
    },

    selfPacedReading: function(config) {
        magpieUtils.view.inspector.missingData(config, "self-paced reading");
        magpieUtils.view.inspector.params(config, "self-paced reading");
        const spr = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const helpText =
                    config.data[CT].help_text !== undefined
                        ? config.data[CT].help_text
                        : "Press the SPACE bar to reveal the words";
                const title =
                    config.data[CT].title !== undefined
                        ? config.data[CT].title
                        : "";
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const sentenceList = config.data[CT].sentence
                    .trim()
                    .split(" | ");
                let spaceCounter = 0;
                let wordList;
                let readingTimes = [];
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                    <p class='magpie-help-text magpie-nodisplay'>${helpText}</p>
                    <p class='magpie-spr-sentence'></p>
                    <div class='magpie-view-answer-container magpie-nodisplay'>
                        <p class='magpie-view-question'>${question}</p>
                        <label for='o1' class='magpie-response-buttons'>${option1}</label>
                        <input type='radio' name='answer' id='o1' value="${option1}" />
                        <input type='radio' name='answer' id='o2' value="${option2}" />
                        <label for='o2' class='magpie-response-buttons'>${option2}</label>
                    </div>
                </div>`;

                $("#main").html(viewTemplate);

                // records the starting time
                startingTime = Date.now();

                // shows the sentence word by word on SPACE press
                const handleKeyPress = function(e) {
                    if (e.which === 32 && spaceCounter < wordList.length) {
                        wordList[spaceCounter].classList.remove(
                            "spr-word-hidden"
                        );

                        if (spaceCounter === 0) {
                            $(".magpie-help-text").addClass("magpie-invisible");
                        }

                        if (spaceCounter > 0) {
                            wordList[spaceCounter - 1].classList.add(
                                "spr-word-hidden"
                            );
                        }

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    } else if (
                        e.which === 32 &&
                        spaceCounter === wordList.length
                    ) {
                        wordList[spaceCounter - 1].classList.add(
                            "spr-word-hidden"
                        );
                        $(".magpie-view-answer-container").removeClass(
                            "magpie-nodisplay"
                        );

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    }
                };

                // happens when the stimulus is hidden
                const enableResponse = function() {
                    // shows the help text
                    $(".magpie-help-text").removeClass("magpie-nodisplay");

                    // creates the sentence
                    sentenceList.map((word) => {
                        $(".magpie-spr-sentence").append(
                            `<span class='spr-word spr-word-hidden'>${word}</span>`
                        );
                    });

                    // creates an array of spr word elements
                    wordList = $(".spr-word").toArray();

                    // attaches an eventListener to the body for space
                    $("body").on("keydown", handleKeyPress);
                };

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "spr"
                    },
                    enableResponse
                );

                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime;
                    let reactionTimes = readingTimes
                        .reduce((result, current, idx) => {
                            return result.concat(
                                readingTimes[idx + 1] - readingTimes[idx]
                            );
                        }, [])
                        .filter((item) => isNaN(item) === false);
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        response: $("input[name=answer]:checked").val(),
                        reactionTimes: reactionTimes,
                        time_spent: RT
                    };

                    for (let prop in config.data[CT]) {
                        if (config.data[CT].hasOwnProperty(prop)) {
                            trial_data[prop] = config.data[CT][prop];
                        }
                    }

                    if (config.data[CT].picture !== undefined) {
                        trial_data.picture = config.data[CT].picture;
                    }

                    if (config.data[CT].canvas !== undefined) {
                        if (config.data[CT].canvas.canvasSettings !== undefined) {
                            for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                }
                            }
                            delete trial_data.canvas.canvasSettings;
                        }
                        for (let prop in config.data[CT].canvas) {
                            if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT].canvas[prop];
                            }
                        }
                        delete trial_data.canvas;
                    }

                    magpie.trial_data.push(trial_data);
                    magpie.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return spr;
    },

    selfPacedReading_ratingScale: function(config) {
        magpieUtils.view.inspector.missingData(
            config,
            "self-paced reading ratingScale"
        );
        magpieUtils.view.inspector.params(
            config,
            "self-paced reading scale ratingScale"
        );
        const spr = {
            name: config.name,
            title: magpieUtils.view.setter.title(config.title, ""),
            render: function(CT, magpie) {
                let startingTime;
                const question = magpieUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                const title =
                    config.data[CT].title !== undefined
                        ? config.data[CT].title
                        : "";
                const helpText =
                    config.data[CT].help_text !== undefined
                        ? config.data[CT].help_text
                        : "Press the SPACE bar to reveal the words";
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].optionLeft;
                const option2 = config.data[CT].optionRight;
                const sentenceList = config.data[CT].sentence
                    .trim()
                    .split(" | ");
                let spaceCounter = 0;
                let wordList;
                let readingTimes = [];
                const viewTemplate = `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                    <p class='magpie-help-text magpie-nodisplay'>${helpText}</p>
                    <p class='magpie-spr-sentence'></p>
                    <div class='magpie-view-answer-container magpie-nodisplay'>
                        <p class='magpie-view-question'>${question}</p>
                        <strong class='magpie-response-rating-option magpie-view-text'>${option1}</strong>
                        <label for="1" class='magpie-response-rating'>1</label>
                        <input type="radio" name="answer" id="1" value="1" />
                        <label for="2" class='magpie-response-rating'>2</label>
                        <input type="radio" name="answer" id="2" value="2" />
                        <label for="3" class='magpie-response-rating'>3</label>
                        <input type="radio" name="answer" id="3" value="3" />
                        <label for="4" class='magpie-response-rating'>4</label>
                        <input type="radio" name="answer" id="4" value="4" />
                        <label for="5" class='magpie-response-rating'>5</label>
                        <input type="radio" name="answer" id="5" value="5" />
                        <label for="6" class='magpie-response-rating'>6</label>
                        <input type="radio" name="answer" id="6" value="6" />
                        <label for="7" class='magpie-response-rating'>7</label>
                        <input type="radio" name="answer" id="7" value="7" />
                        <strong class='magpie-response-rating-option magpie-view-text'>${option2}</strong>
                    </div>
                </div>`;

                $("#main").html(viewTemplate);

                // records the starting time
                startingTime = Date.now();

                // shows the sentence word by word on SPACE press
                const handleKeyPress = function(e) {
                    if (e.which === 32 && spaceCounter < wordList.length) {
                        wordList[spaceCounter].classList.remove(
                            "spr-word-hidden"
                        );

                        if (spaceCounter === 0) {
                            $(".magpie-help-text").addClass("magpie-invisible");
                        }

                        if (spaceCounter > 0) {
                            wordList[spaceCounter - 1].classList.add(
                                "spr-word-hidden"
                            );
                        }

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    } else if (
                        e.which === 32 &&
                        spaceCounter === wordList.length
                    ) {
                        wordList[spaceCounter - 1].classList.add(
                            "spr-word-hidden"
                        );
                        $(".magpie-view-answer-container").removeClass(
                            "magpie-nodisplay"
                        );

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    }
                };

                // happens when the stimulus is hidden
                const enableResponse = function() {
                    // shows the help text
                    $(".magpie-help-text").removeClass("magpie-nodisplay");

                    // creates the sentence
                    sentenceList.map((word) => {
                        $(".magpie-spr-sentence").append(
                            `<span class='spr-word spr-word-hidden'>${word}</span>`
                        );
                    });

                    // creates an array of spr word elements
                    wordList = $(".spr-word").toArray();

                    // attaches an eventListener to the body for space
                    $("body").on("keydown", handleKeyPress);

                    $("input[name=answer]").on("change", function() {
                        const RT = Date.now() - startingTime;
                        let reactionTimes = readingTimes
                            .reduce((result, current, idx) => {
                                return result.concat(
                                    readingTimes[idx + 1] - readingTimes[idx]
                                );
                            }, [])
                            .filter((item) => isNaN(item) === false);
                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            response: $("input[name=answer]:checked").val(),
                            reactionTimes: reactionTimes,
                            time_spent: RT
                        };

                        for (let prop in config.data[CT]) {
                            if (config.data[CT].hasOwnProperty(prop)) {
                                trial_data[prop] = config.data[CT][prop];
                            }
                        }

                        if (config.data[CT].picture !== undefined) {
                            trial_data.picture = config.data[CT].picture;
                        }

                        if (config.data[CT].canvas !== undefined) {
                            if (config.data[CT].canvas.canvasSettings !== undefined) {
                                for (let prop in config.data[CT].canvas.canvasSettings) {                                    
                                    if (config.data[CT].canvas.canvasSettings.hasOwnProperty(prop)) {
                                        trial_data[prop] = config.data[CT].canvas.canvasSettings[prop];
                                    }
                                }
                                delete trial_data.canvas.canvasSettings;
                            }
                            for (let prop in config.data[CT].canvas) {
                                if (config.data[CT].canvas.hasOwnProperty(prop)) {
                                    trial_data[prop] = config.data[CT].canvas[prop];
                                }
                            }
                            delete trial_data.canvas;
                        }

                        magpie.trial_data.push(trial_data);
                        magpie.findNextView();
                    });
                };

                // creates the DOM of the trial view
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: "spr"
                    },
                    enableResponse
                );
            },
            CT: 0,
            trials: config.trials
        };

        return spr;
    },

    postTest: function(config) {
        magpieUtils.view.inspector.params(config, "post test");
        const postTest = {
            name: config.name,
            title: magpieUtils.view.setter.title(
                config.title,
                "Additional Information"
            ),
            text: config.text,
            quest: {
                age: {
                    title: magpieUtils.view.setter.prop(
                        config.age_question,
                        "Age"
                    )
                },
                gender: {
                    title: magpieUtils.view.setter.prop(
                        config.gender_question,
                        "Gender"
                    ),
                    male: magpieUtils.view.setter.prop(
                        config.gender_male,
                        "male"
                    ),
                    female: magpieUtils.view.setter.prop(
                        config.gender_female,
                        "female"
                    ),
                    other: magpieUtils.view.setter.prop(
                        config.gender_other,
                        "other"
                    )
                },
                edu: {
                    title: magpieUtils.view.setter.prop(
                        config.edu_question,
                        "Level of Education"
                    ),
                    graduated_high_school: magpieUtils.view.setter.prop(
                        config.edu_graduated_high_school,
                        "Graduated High School"
                    ),
                    graduated_college: magpieUtils.view.setter.prop(
                        config.edu_graduated_college,
                        "Graduated College"
                    ),
                    higher_degree: magpieUtils.view.setter.prop(
                        config.edu_higher_degree,
                        "Higher Degree"
                    )
                },
                langs: {
                    title: magpieUtils.view.setter.prop(
                        config.languages_question,
                        "Native Languages"
                    ),
                    text: magpieUtils.view.setter.prop(
                        config.languages_more,
                        "(i.e. the language(s) spoken at home when you were a child)"
                    )
                },
                comments: {
                    title: magpieUtils.view.setter.prop(
                        config.comments_question,
                        "Further Comments"
                    )
                }
            },
            button: magpieUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, magpie) {
                const viewTemplate = `<div class='magpie-view magpie-post-test-view'>
                    <h1 class='magpie-view-title'>${this.title}</h1>
                    <section class='magpie-text-container'>
                        <p class='magpie-view-text'>${this.text}</p>
                    </section>
                    <form>
                        <p class='magpie-view-text'>
                            <label for="age">${this.quest.age.title}:</label>
                            <input type="number" name="age" min="18" max="110" id="age" />
                        </p>
                        <p class='magpie-view-text'>
                            <label for="gender">${
                                this.quest.gender.title
                            }:</label>
                            <select id="gender" name="gender">
                                <option></option>
                                <option value="${this.quest.gender.male}">${
                    this.quest.gender.male
                }</option>
                                <option value="${this.quest.gender.female}">${
                    this.quest.gender.female
                }</option>
                                <option value="${this.quest.gender.other}">${
                    this.quest.gender.other
                }</option>
                            </select>
                        </p>
                        <p class='magpie-view-text'>
                            <label for="education">${
                                this.quest.edu.title
                            }:</label>
                            <select id="education" name="education">
                                <option></option>
                                <option value="${
                                    this.quest.edu.graduated_high_school
                                }">${
                    this.quest.edu.graduated_high_school
                }</option>
                                <option value="${
                                    this.quest.edu.graduated_college
                                }">${this.quest.edu.graduated_college}</option>
                                <option value="${
                                    this.quest.edu.higher_degree
                                }">${this.quest.edu.higher_degree}</option>
                            </select>
                        </p>
                        <p class='magpie-view-text'>
                            <label for="languages" name="languages">${
                                this.quest.langs.title
                            }:<br /><span>${
                    this.quest.langs.text
                }</</span></label>
                            <input type="text" id="languages"/>
                        </p>
                        <p class="magpie-view-text">
                            <label for="comments">${
                                this.quest.comments.title
                            }</label>
                            <textarea name="comments" id="comments"
                            rows="6" cols="40"></textarea>
                        </p>
                        <button id="next" class='magpie-view-button'>${
                            this.button
                        }</button>
                    </form>
                </div>`;

                $("#main").html(viewTemplate);

                $("#next").on("click", function(e) {
                    // prevents the form from submitting
                    e.preventDefault();

                    // records the post test info
                    magpie.global_data.age = $("#age").val();
                    magpie.global_data.gender = $("#gender").val();
                    magpie.global_data.education = $("#education").val();
                    magpie.global_data.languages = $("#languages").val();
                    magpie.global_data.comments = $("#comments")
                        .val()
                        .trim();
                    magpie.global_data.endTime = Date.now();
                    magpie.global_data.timeSpent =
                        (magpie.global_data.endTime -
                            magpie.global_data.startTime) /
                        60000;

                    // moves to the next view
                    magpie.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return postTest;
    },

    thanks: function(config) {
        magpieUtils.view.inspector.params(config, "thanks");
        const thanks = {
            name: config.name,
            title: magpieUtils.view.setter.title(
                config.title,
                "Thank you for taking part in this experiment!"
            ),
            prolificConfirmText: magpieUtils.view.setter.prolificConfirmText(
                config.prolificConfirmText,
                "Please press the button below to confirm that you completed the experiment with Prolific"
            ),
            render: function(CT, magpie) {
                if (
                    magpie.deploy.is_MTurk ||
                    magpie.deploy.deployMethod === "directLink" ||
                    magpie.deploy.deployMethod === "localServer"
                ) {
                    // updates the fields in the hidden form with info for the MTurk's server
                    $("#main").html(
                        `<div class='magpie-view magpie-thanks-view'>
                            <h2 id='warning-message' class='magpie-warning'>Submitting the data
                                <p class='magpie-view-text'>please do not close the tab</p>
                                <div class='magpie-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='magpie-thanks magpie-nodisplay'>${
                                this.title
                            }</h1>
                        </div>`
                    );
                } else if (magpie.deploy.deployMethod === "Prolific") {
                    $("#main").html(
                        `<div class='magpie-view magpie-thanks-view'>
                            <h2 id='warning-message' class='magpie-warning'>Submitting the data
                                <p class='magpie-view-text'>please do not close the tab</p>
                                <div class='magpie-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='magpie-thanks magpie-nodisplay'>${
                                this.title
                            }</h1>
                            <p id='extra-message' class='magpie-view-text magpie-nodisplay'>
                                ${this.prolificConfirmText}
                                <a href="${
                                    magpie.deploy.prolificURL
                                }" class="magpie-view-button prolific-url">Confirm</a>
                            </p>
                        </div>`
                    );
                } else if (magpie.deploy.deployMethod === "debug") {
                    $("main").html(
                        `<div id='magpie-debug-table-container' class='magpie-view magpie-thanks-view'>
                            <h1 class='magpie-view-title'>Debug Mode</h1>
                        </div>`
                    );
                } else {
                    console.error("No such magpie.deploy.deployMethod");
                }

                magpie.submission.submit(magpie);
            },
            CT: 0,
            trials: 1
        };

        return thanks;
    }
};
