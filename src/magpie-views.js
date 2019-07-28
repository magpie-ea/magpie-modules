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
