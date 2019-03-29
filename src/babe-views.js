const babeViews = {
    intro: function(config) {
        babeUtils.view.inspector.params(config, "intro");
        const intro = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, "Welcome!"),
            text: config.text,
            button: babeUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, babe) {
                let prolificId;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class="babe-text-container">
                        <p class="babe-view-text">${this.text}</p>
                    </section>
                    <button id="next" class='babe-view-button' class="babe-nodisplay">${
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
                        next.removeClass("babe-nodisplay");
                    } else {
                        next.addClass("babe-nodisplay");
                    }
                }

                if (babe.deploy.deployMethod === "Prolific") {
                    $(".babe-text-container").append(prolificForm);
                    next.addClass("babe-nodisplay");
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
                    if (babe.deploy.deployMethod === "Prolific") {
                        babe.global_data.prolific_id = prolificId.val().trim();
                    }

                    babe.findNextView();
                });
            },
            CT: 0,
            // for how many trials should this view be repeated?
            trials: config.trials
        };

        return intro;
    },

    instructions: function(config) {
        babeUtils.view.inspector.params(config, "instructions");
        const instructions = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, "Instructions"),
            text: config.text,
            button: babeUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, babe) {
                const viewTemplate = `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class="babe-text-container">
                        <p class="babe-view-text">${this.text}</p>
                    </section>
                    <button id="next" class='babe-view-button'>${
                        this.button
                    }</button>
                </div>`;

                $("#main").html(viewTemplate);

                // moves to the next view
                $("#next").on("click", function() {
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return instructions;
    },

    begin: function(config) {
        babeUtils.view.inspector.params(config, "begin experiment");
        const begin = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, "Begin"),
            text: config.text,
            button: babeUtils.view.setter.buttonText(config.buttonText),
            // render function renders the view
            render: function(CT, babe) {
                const viewTemplate = `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class='babe-text-container'>
                        <p class='babe-view-text'>${this.text}</p>
                    </section>
                    <button id='next' class='babe-view-button'>${
                        this.button
                    }</button>
                </div>`;

                $("#main").html(viewTemplate);

                // moves to the next view
                $("#next").on("click", function() {
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return begin;
    },

    forcedChoice: function(config) {
        babeUtils.view.inspector.missingData(config, "forced choice");
        babeUtils.view.inspector.params(config, "forced choice");
        const forcedChoice = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;

                $("#main").html(viewTemplate);

                const answerContainerElem = `<div class='babe-view-answer-container'>
                    <p class='babe-view-question'>${question}</p>
                    <label for='o1' class='babe-response-buttons'>${option1}</label>
                    <input type='radio' name='answer' id='o1' value=${option1} />
                    <input type='radio' name='answer' id='o2' value=${option2} />
                    <label for='o2' class='babe-response-buttons'>${option2}</label>
                </div>`;

                const enableResponse = function() {
                    $(".babe-view").append(answerContainerElem);

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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "slider rating");
        babeUtils.view.inspector.params(config, "slider rating");
        const sliderRating = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].optionLeft;
                const option2 = config.data[CT].optionRight;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-QUD'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='babe-view-question'>${question}</p>
                <div class='babe-view-answer-container'>
                    <span class='babe-response-slider-option'>${option1}</span>
                    <input type='range' id='response' class='babe-response-slider' min='0' max='100' value='50'/>
                    <span class='babe-response-slider-option'>${option2}</span>
                </div>
                <button id="next" class='babe-view-button babe-nodisplay'>Next</button>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let response;

                    $(".babe-view").append(answerContainerElem);

                    response = $("#response");
                    // checks if the slider has been changed
                    response.on("change", function() {
                        $("#next").removeClass("babe-nodisplay");
                    });
                    response.on("click", function() {
                        $("#next").removeClass("babe-nodisplay");
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "textbox input");
        babeUtils.view.inspector.params(config, "textbox input");
        const textboxInput = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const minChars =
                    config.data[CT].min_chars === undefined
                        ? 10
                        : config.data[CT].min_chars;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='babe-view-question'>${question}</p>
                    <div class='babe-view-answer-container'>
                        <textarea name='textbox-input' rows=10 cols=50 class='babe-response-text' />
                    </div>
                    <button id='next' class='babe-view-button babe-nodisplay'>next</button>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let next;
                    let textInput;

                    $(".babe-view").append(answerContainerElem);

                    next = $("#next");
                    textInput = $("textarea");

                    // attaches an event listener to the textbox input
                    textInput.on("keyup", function() {
                        // if the text is longer than (in this case) 10 characters without the spaces
                        // the 'next' button appears
                        if (textInput.val().trim().length > minChars) {
                            next.removeClass("babe-nodisplay");
                        } else {
                            next.addClass("babe-nodisplay");
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "dropdown choice");
        babeUtils.view.inspector.params(config, "dropdown choice");
        const dropdownChoice = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
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
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<div class='babe-view-answer-container babe-response-dropdown'>
                    ${question_left_part}
                    <select id='response' name='answer'>
                        <option disabled selected></option>
                        <option value=${option1}>${option1}</option>
                        <option value=${option2}>${option2}</option>
                    </select>
                    ${question_right_part}
                    </p>
                    <button id='next' class='babe-view-button babe-nodisplay'>Next</button>
                </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    let response;

                    $(".babe-view").append(answerContainerElem);

                    response = $("#response");

                    response.on("change", function() {
                        $("#next").removeClass("babe-nodisplay");
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "rating scale");
        babeUtils.view.inspector.params(config, "rating scale");
        const ratingScale = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].optionLeft;
                const option2 = config.data[CT].optionRight;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;

                const answerContainerElem = `<p class='babe-view-question'>${question}</p>
                    <div class='babe-view-answer-container'>
                        <strong class='babe-response-rating-option babe-view-text'>${option1}</strong>
                        <label for="1" class='babe-response-rating'>1</label>
                        <input type="radio" name="answer" id="1" value="1" />
                        <label for="2" class='babe-response-rating'>2</label>
                        <input type="radio" name="answer" id="2" value="2" />
                        <label for="3" class='babe-response-rating'>3</label>
                        <input type="radio" name="answer" id="3" value="3" />
                        <label for="4" class='babe-response-rating'>4</label>
                        <input type="radio" name="answer" id="4" value="4" />
                        <label for="5" class='babe-response-rating'>5</label>
                        <input type="radio" name="answer" id="5" value="5" />
                        <label for="6" class='babe-response-rating'>6</label>
                        <input type="radio" name="answer" id="6" value="6" />
                        <label for="7" class='babe-response-rating'>7</label>
                        <input type="radio" name="answer" id="7" value="7" />
                        <strong class='babe-response-rating-option babe-view-text'>${option2}</strong>
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".babe-view").append(answerContainerElem);
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "sentence choice");
        babeUtils.view.inspector.params(config, "sentence choice");
        const sentenceChoice = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `
                    <div class='babe-view-answer-container'>
                        <p class='babe-view-question'>${question}</p>
                        <label for='s1' class='babe-response-sentence'>${option1}</label>
                        <input type='radio' name='answer' id='s1' value="${option1}" />
                        <label for='s2' class='babe-response-sentence'>${option2}</label>
                        <input type='radio' name='answer' id='s2' value="${option2}" />
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".babe-view").append(answerContainerElem);

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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "image selection");
        babeUtils.view.inspector.params(config, "image selection");
        const imageSelection = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const picture1 = config.data[CT].picture1;
                const picture2 = config.data[CT].picture2;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `<div class='babe-view-answer-container'>
                        <p class='babe-view-question'>${question}</p>
                        <label for="img1" class='babe-view-picture babe-response-picture'><img src=${picture1}></label>
                        <input type="radio" name="answer" id="img1" value="${option1}" />
                        <input type="radio" name="answer" id="img2" value="${option2}" />
                        <label for="img2" class='babe-view-picture babe-response-picture'><img src=${picture2}></label>
                    </div>`;

                $("#main").html(viewTemplate);

                const enableResponse = function() {
                    $(".babe-view").append(answerContainerElem);
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "key press");
        babeUtils.view.inspector.params(config, "key press");
        const keyPress = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const key1 = config.data[CT].key1;
                const key2 = config.data[CT].key2;
                const value1 = config.data[CT][key1];
                const value2 = config.data[CT][key2];
                const viewTemplate = `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-response-keypress-header'><strong>${key1}</strong> = ${value1}, <strong>${key2}</strong> = ${value2}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                </div>`;
                const answerContainerElem = `<div class='babe-view-answer-container'>
                        <p class='babe-view-question'>${question}</p>`;

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

                        babe.trial_data.push(trial_data);
                        $("body").off("keydown", handleKeyPress);
                        babe.findNextView();
                    }
                };

                const enableResponse = function() {
                    $(".babe-view").append(answerContainerElem);
                    $("body").on("keydown", handleKeyPress);
                };

                startingTime = Date.now();

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.missingData(config, "self-paced reading");
        babeUtils.view.inspector.params(config, "self-paced reading");
        const spr = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
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
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                    <p class='babe-help-text babe-nodisplay'>${helpText}</p>
                    <p class='babe-spr-sentence'></p>
                    <div class='babe-view-answer-container babe-nodisplay'>
                        <p class='babe-view-question'>${question}</p>
                        <label for='o1' class='babe-response-buttons'>${option1}</label>
                        <input type='radio' name='answer' id='o1' value="${option1}" />
                        <input type='radio' name='answer' id='o2' value="${option2}" />
                        <label for='o2' class='babe-response-buttons'>${option2}</label>
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
                            $(".babe-help-text").addClass("babe-invisible");
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
                        $(".babe-view-answer-container").removeClass(
                            "babe-nodisplay"
                        );

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    } else {
                        $("body").off("keydown", handleKeyPress);
                    }
                };

                // happens when the stimulus is hidden
                const enableResponse = function() {
                    // shows the help text
                    $(".babe-help-text").removeClass("babe-nodisplay");

                    // creates the sentence
                    sentenceList.map((word) => {
                        $(".babe-spr-sentence").append(
                            `<span class='spr-word spr-word-hidden'>${word}</span>`
                        );
                    });

                    // creates an array of spr word elements
                    wordList = $(".spr-word").toArray();

                    // attaches an eventListener to the body for space
                    $("body").on("keydown", handleKeyPress);
                };

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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

                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return spr;
    },

    selfPacedReading_ratingScale: function(config) {
        babeUtils.view.inspector.missingData(
            config,
            "self-paced reading ratingScale"
        );
        babeUtils.view.inspector.params(
            config,
            "self-paced reading scale ratingScale"
        );
        const spr = {
            name: config.name,
            title: babeUtils.view.setter.title(config.title, ""),
            render: function(CT, babe) {
                let startingTime;
                const question = babeUtils.view.setter.question(
                    config.data[CT].question
                );
                const QUD = babeUtils.view.setter.QUD(config.data[CT].QUD);
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
                const viewTemplate = `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <p class='babe-view-question babe-view-qud'>${QUD}</p>
                    <div class='babe-view-stimulus-container'>
                        <div class='babe-view-stimulus babe-nodisplay'></div>
                    </div>
                    <p class='babe-help-text babe-nodisplay'>${helpText}</p>
                    <p class='babe-spr-sentence'></p>
                    <div class='babe-view-answer-container babe-nodisplay'>
                        <p class='babe-view-question'>${question}</p>
                        <strong class='babe-response-rating-option babe-view-text'>${option1}</strong>
                        <label for="1" class='babe-response-rating'>1</label>
                        <input type="radio" name="answer" id="1" value="1" />
                        <label for="2" class='babe-response-rating'>2</label>
                        <input type="radio" name="answer" id="2" value="2" />
                        <label for="3" class='babe-response-rating'>3</label>
                        <input type="radio" name="answer" id="3" value="3" />
                        <label for="4" class='babe-response-rating'>4</label>
                        <input type="radio" name="answer" id="4" value="4" />
                        <label for="5" class='babe-response-rating'>5</label>
                        <input type="radio" name="answer" id="5" value="5" />
                        <label for="6" class='babe-response-rating'>6</label>
                        <input type="radio" name="answer" id="6" value="6" />
                        <label for="7" class='babe-response-rating'>7</label>
                        <input type="radio" name="answer" id="7" value="7" />
                        <strong class='babe-response-rating-option babe-view-text'>${option2}</strong>
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
                            $(".babe-help-text").addClass("babe-invisible");
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
                        $(".babe-view-answer-container").removeClass(
                            "babe-nodisplay"
                        );

                        readingTimes.push(Date.now());
                        spaceCounter++;
                    } else {
                        $("body").off("keydown", handleKeyPress);
                    }
                };

                // happens when the stimulus is hidden
                const enableResponse = function() {
                    // shows the help text
                    $(".babe-help-text").removeClass("babe-nodisplay");

                    // creates the sentence
                    sentenceList.map((word) => {
                        $(".babe-spr-sentence").append(
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

                        babe.trial_data.push(trial_data);
                        babe.findNextView();
                    });
                };

                // creates the DOM of the trial view
                babeUtils.view.createTrialDOM(
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
        babeUtils.view.inspector.params(config, "post test");
        const postTest = {
            name: config.name,
            title: babeUtils.view.setter.title(
                config.title,
                "Additional Information"
            ),
            text: config.text,
            quest: {
                age: {
                    title: babeUtils.view.setter.prop(
                        config.age_question,
                        "Age"
                    )
                },
                gender: {
                    title: babeUtils.view.setter.prop(
                        config.gender_question,
                        "Gender"
                    ),
                    male: babeUtils.view.setter.prop(
                        config.gender_male,
                        "male"
                    ),
                    female: babeUtils.view.setter.prop(
                        config.gender_female,
                        "female"
                    ),
                    other: babeUtils.view.setter.prop(
                        config.gender_other,
                        "other"
                    )
                },
                edu: {
                    title: babeUtils.view.setter.prop(
                        config.edu_question,
                        "Level of Education"
                    ),
                    graduated_high_school: babeUtils.view.setter.prop(
                        config.edu_graduated_high_school,
                        "Graduated High School"
                    ),
                    graduated_college: babeUtils.view.setter.prop(
                        config.edu_graduated_college,
                        "Graduated College"
                    ),
                    higher_degree: babeUtils.view.setter.prop(
                        config.edu_higher_degree,
                        "Higher Degree"
                    )
                },
                langs: {
                    title: babeUtils.view.setter.prop(
                        config.languages_question,
                        "Native Languages"
                    ),
                    text: babeUtils.view.setter.prop(
                        config.languages_more,
                        "(i.e. the language(s) spoken at home when you were a child)"
                    )
                },
                comments: {
                    title: babeUtils.view.setter.prop(
                        config.comments_question,
                        "Further Comments"
                    )
                }
            },
            button: babeUtils.view.setter.buttonText(config.buttonText),
            render: function(CT, babe) {
                const viewTemplate = `<div class='babe-view babe-post-test-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class='babe-text-container'>
                        <p class='babe-view-text'>${this.text}</p>
                    </section>
                    <form>
                        <p class='babe-view-text'>
                            <label for="age">${this.quest.age.title}:</label>
                            <input type="number" name="age" min="18" max="110" id="age" />
                        </p>
                        <p class='babe-view-text'>
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
                        <p class='babe-view-text'>
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
                        <p class='babe-view-text'>
                            <label for="languages" name="languages">${
                                this.quest.langs.title
                            }:<br /><span>${
                    this.quest.langs.text
                }</</span></label>
                            <input type="text" id="languages"/>
                        </p>
                        <p class="babe-view-text">
                            <label for="comments">${
                                this.quest.comments.title
                            }</label>
                            <textarea name="comments" id="comments"
                            rows="6" cols="40"></textarea>
                        </p>
                        <button id="next" class='babe-view-button'>${
                            this.button
                        }</button>
                    </form>
                </div>`;

                $("#main").html(viewTemplate);

                $("#next").on("click", function(e) {
                    // prevents the form from submitting
                    e.preventDefault();

                    // records the post test info
                    babe.global_data.age = $("#age").val();
                    babe.global_data.gender = $("#gender").val();
                    babe.global_data.education = $("#education").val();
                    babe.global_data.languages = $("#languages").val();
                    babe.global_data.comments = $("#comments")
                        .val()
                        .trim();
                    babe.global_data.endTime = Date.now();
                    babe.global_data.timeSpent =
                        (babe.global_data.endTime -
                            babe.global_data.startTime) /
                        60000;

                    // moves to the next view
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return postTest;
    },

    thanks: function(config) {
        babeUtils.view.inspector.params(config, "thanks");
        const thanks = {
            name: config.name,
            title: babeUtils.view.setter.title(
                config.title,
                "Thank you for taking part in this experiment!"
            ),
            prolificConfirmText: babeUtils.view.setter.prolificConfirmText(
                config.prolificConfirmText,
                "Please press the button below to confirm that you completed the experiment with Prolific"
            ),
            render: function(CT, babe) {
                if (
                    babe.deploy.is_MTurk ||
                    babe.deploy.deployMethod === "directLink" ||
                    babe.deploy.deployMethod === "localServer"
                ) {
                    // updates the fields in the hidden form with info for the MTurk's server
                    $("#main").html(
                        `<div class='babe-view babe-thanks-view'>
                            <h2 id='warning-message' class='babe-warning'>Submitting the data
                                <p class='babe-view-text'>please do not close the tab</p>
                                <div class='babe-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='babe-thanks babe-nodisplay'>${
                                this.title
                            }</h1>
                        </div>`
                    );
                } else if (babe.deploy.deployMethod === "Prolific") {
                    $("#main").html(
                        `<div class='babe-view babe-thanks-view'>
                            <h2 id='warning-message' class='babe-warning'>Submitting the data
                                <p class='babe-view-text'>please do not close the tab</p>
                                <div class='babe-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='babe-thanks babe-nodisplay'>${
                                this.title
                            }</h1>
                            <p id='extra-message' class='babe-view-text babe-nodisplay'>
                                ${this.prolificConfirmText}
                                <a href="${
                                    babe.deploy.prolificURL
                                }" class="babe-view-button prolific-url">Confirm</a>
                            </p>
                        </div>`
                    );
                } else if (babe.deploy.deployMethod === "debug") {
                    $("main").html(
                        `<div id='babe-debug-table-container' class='babe-view babe-thanks-view'>
                            <h1 class='babe-view-title'>Debug Mode</h1>
                        </div>`
                    );
                } else {
                    console.error("No such babe.deploy.deployMethod");
                }

                babe.submission.submit(babe);
            },
            CT: 0,
            trials: 1
        };

        return thanks;
    }
};
