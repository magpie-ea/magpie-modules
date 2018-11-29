const babeProgress = function(babe) {
    let totalProgressParts = 0;
    let progressTrials = 0;
    // customize.progress_bar_style is "chunks" or "separate" {
    let totalProgressChunks = 0;
    let filledChunks = 0;
    let fillChunk = false;

    const progress = {
        // adds progress bar(s) to the views specified experiment.js
        add: function() {
            babe.views_seq.map((view) => {
                for (let j = 0; j < babe.progress_bar.in.length; j++) {
                    if (view.name === babe.progress_bar.in[j]) {
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

            if (babe.progress_bar.style === "default") {
                div = $(".progress-bar").width() / totalProgressParts;
                filledPart = progressTrials * div;
            } else {
                div =
                    $(".progress-bar").width() /
                    babe.views_seq[babe.currentViewCounter].trials;
                filledPart = (
                    (babe.currentTrialInViewCounter - 1) *
                    div
                ).toFixed(4);
            }

            const filledElem = jQuery("<span/>", {
                id: "filled"
            }).appendTo(progressBars[filledChunks]);

            $("#filled").css("width", filledPart);
            progressTrials++;

            if (babe.progress_bar.style === "chunks") {
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
        var view = $(".babe-view");
        var barWidth = babe.progress_bar.width;
        var clearfix = jQuery("<div/>", {
            class: "clearfix"
        });
        var container = jQuery("<div/>", {
            class: "progress-bar-container"
        });
        view.css("padding-top", 30);
        view.prepend(clearfix);
        view.prepend(container);

        if (babe.progress_bar.style === "chunks") {
            for (i = 0; i < totalProgressChunks; i++) {
                bar = jQuery("<div/>", {
                    class: "progress-bar"
                });
                bar.css("width", barWidth);
                container.append(bar);
            }
        } else if (babe.progress_bar.style === "separate") {
            bar = jQuery("<div/>", {
                class: "progress-bar"
            });
            bar.css("width", barWidth);
            container.append(bar);
        } else if (babe.progress_bar.style === "default") {
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
