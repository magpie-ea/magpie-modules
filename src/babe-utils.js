const babeUtils = {
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
                    throw new Error(errors.notAnArray.concat(this.findFile(view)));
                }

                if (config.trial_type === undefined || config.trial_type === "") {
                    throw new Error(errors.noTrialType.concat(this.findFile(view)));
                }
            },

            // finds in which type of view the error occurs
            findFile: function(view) {
                return `The problem is in ${view} view type.`;
            }
        },
        setter: {
            // sets a default title for the views that are not given a title
            title: function(title, dflt) {
                return title === undefined || title === "" ? dflt : title;
            },

            // sets a default prolificConfirmText to the thanks view if not given
            prolificConfirmText: function(text, dflt) {
                return text === undefined || text === "" ? dflt : text;
            },

            // sets default button text for the views that are not given button text
            buttonText: function(buttonText) {
                return buttonText === undefined || buttonText === "" ? "Next" : buttonText;
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
            },
        },
        createTrialDOM: function(config, enableResponse) {
            const pause = config.pause;
            const fix_duration = config.fix_duration;
            const stim_duration = config.stim_duration;
            const data = config.data;
            const view = config.view;
            const evts = config.evts !== undefined ? config.evts : {};

            // checks if there is a pause and shows the pause screen
            const showPause = function(resolve, reject) {
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
            const showFixPoint = function(resolve, reject) {
                if (
                    fix_duration !== undefined &&
                    typeof fix_duration === "number" &&
                    isNaN(fix_duration) === false
                ) {
                    const fixPoint = jQuery("<div/>", {
                        class: "babe-view-fix-point"
                    });
                    $(".babe-view-stimulus-container").prepend(fixPoint);

                    setTimeout(() => {
                        fixPoint.remove();
                        resolve();
                    }, fix_duration);
                } else {
                    resolve();
                }
            };

            // checks if there is a stimulus and shows it
            const showStim = function(resolve, reject) {
                $('.babe-view-stimulus').removeClass('babe-nodisplay');

                if (data.picture !== undefined) {
                    $(".babe-view-stimulus").prepend(
                        `<div class='babe-view-picture'>
                    <img src=${data.picture}>
                </div>`
                    );
                }

                if (data.canvas) {
                    babeDrawShapes(data.canvas);
                }
                resolve(evts.after_stim_shown);
            };

            // hides the stimulus
            const hideStim = function(resolve, reject) {
                const spacePressed = function(e, resolve) {
                    if (e.which === 32) {
                        $(".babe-view-stimulus").addClass("babe-invisible");
                        $("body").off("keydown", spacePressed);
                        resolve(evts.after_stim_hidden);
                    }
                };

                if (view === 'imageSelection') {
                    $('.babe-view-stimulus-container').addClass('babe-nodisplay');
                    resolve(evts.after_stim_hidden);
                }

                if (
                    stim_duration !== undefined &&
                    typeof stim_duration === "number" &&
                    isNaN(stim_duration) === false
                ) {
                    setTimeout(() => {
                        $(".babe-view-stimulus").addClass("babe-invisible");
                        resolve(evts.after_stim_hidden);
                    }, stim_duration);
                // } else if (stim_duration === undefined) {
                //     resolve('resolves: no stim duration');
                } else {
                     $("body").on("keydown", e => {
                        spacePressed(e, resolve);
                    });
                }
            };

            // 1. shows a blank screen (optional) 
            // 2. then shows a fixation point (optional)
            // 3. then shows the stimulus (obligatory)
            // 4. then hides the stimulus (optional)
            // 5. then enables the interations from the participant (obligatory)
            new Promise((resolve, reject) => {
                showPause(resolve, reject);
            }).then(() => {
                if (evts.after_pause) {
                    evts.after_pause(data);
                }

                return new Promise((resolve, reject) => {
                    showFixPoint(resolve, reject);
                });
            }).then(() => {
                if (evts.after_fix_point) {
                    evts.after_fix_point(data);
                }

                return new Promise((resolve, reject) => {
                    showStim(resolve, reject);
                });
            }).then(() => {
                if (evts.after_stim_shown) {
                    evts.after_stim_shown(data);
                }

                return new Promise((resolve, reject) => {
                    hideStim(resolve, reject);
                });
            }).then(() => {
                if (evts.after_stim_hidden) {
                    evts.after_stim_hidden(data);
                }

                enableResponse();

                if (evts.after_response_enabled) {
                    evts.after_response_enabled(data);
                }
            });
        }
    },
    views_seq: {
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