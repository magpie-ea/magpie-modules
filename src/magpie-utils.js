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
        save_config_trial_data: function(config_info, trial_data) {
            for (let prop in config_info) {
                if (config_info.hasOwnProperty(prop)) {
                    trial_data[prop] = config_info[prop];
                }
            }

            if (config_info.canvas !== undefined) {
                if (config_info.canvas.canvasSettings !== undefined) {
                    for (let prop in config_info.canvas.canvasSettings) {
                        if (config_info.canvas.canvasSettings.hasOwnProperty(prop)) {
                            trial_data[prop] = config_info.canvas.canvasSettings[prop];
                        }
                    }
                    delete trial_data.canvas.canvasSettings;
                }
                for (let prop in config_info.canvas) {
                    if (config_info.canvas.hasOwnProperty(prop)) {
                        trial_data[prop] = config_info.canvas[prop];
                    }
                }
                delete trial_data.canvas;
            }

            return trial_data;
        },
        fill_defaults_post_test: function(config) {
            return {
                age: {
                    title: magpieUtils.view.setter.prop(config.age_question, "Age")
                },
                gender: {
                    title: magpieUtils.view.setter.prop(config.gender_question, "Gender"),
                    male: magpieUtils.view.setter.prop(config.gender_male, "male"),
                    female: magpieUtils.view.setter.prop(config.gender_female, "female"),
                    other: magpieUtils.view.setter.prop(config.gender_other, "other")
                },
                edu: {
                    title: magpieUtils.view.setter.prop(config.edu_question, "Level of Education"),
                    graduated_high_school: magpieUtils.view.setter.prop(config.edu_graduated_high_school,
                        "Graduated High School"),
                    graduated_college: magpieUtils.view.setter.prop(config.edu_graduated_college, "Graduated College"),
                    higher_degree: magpieUtils.view.setter.prop(config.edu_higher_degree, "Higher Degree")
                },
                langs: {
                    title: magpieUtils.view.setter.prop(config.languages_question, "Native Languages"),
                    text: magpieUtils.view.setter.prop(config.languages_more,
                        "(i.e. the language(s) spoken at home when you were a child)")
                },
                comments: {
                    title: magpieUtils.view.setter.prop(config.comments_question, "Further Comments")
                }
            };
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

                if (view === "image_selection") {
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
