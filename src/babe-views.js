// sets a default title for the views that are not given a title
const setTitle = function(title, dflt) {
    return (title === undefined || title === '') ? dflt : title;
};

// sets default button text for the views that are not given button text
const setButtonText = function(buttonText) {
    return (buttonText === undefined || buttonText === '') ? 'Next' : buttonText;
};

const checkQuestion = function(question) {
    if (question === undefined || question === '') {
        console.warn("this trial has no 'question'");
        return '';
    } else {
        return question;
    }
};

const babeViews = {
    intro: function(config) {
        paramsChecker(config, "intro");
        const intro = {
            name: config.name,
            title: setTitle(config.title, 'Welcome!'),
            text: config.text,
            button: setButtonText(config.buttonText),
            render: function(CT, babe) {
                const viewTemplate =
                `<div class='babe-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class="babe-text-container">
                    <p class="babe-view-text">${this.text}</p>
                    </section>
                    <p id="prolific-id-form">
                        <label for="prolific-id">Please, enter your Prolific ID</label>
                        <input type="text" id="prolific-id" />
                    </p>
                    <button id="next" class='babe-view-button' class="babe-nodisplay">${this.button}</button>
                </div>`;

                $("#main").html(viewTemplate);

                const prolificId = $("#prolific-id");
                const IDform = $("#prolific-id-form");
                const next = $("#next");

                function showNextBtn() {
                    if (prolificId.val().trim() !== "") {
                        next.removeClass("babe-nodisplay");
                    } else {
                        next.addClass("babe-nodisplay");
                    }
                }

                if (babe.deploy.deployMethod !== "Prolific") {
                    IDform.addClass("babe-nodisplay");
                    next.removeClass("babe-nodisplay");
                }

                prolificId.on("keyup", function() {
                    showNextBtn();
                });

                prolificId.on("focus", function() {
                    showNextBtn();
                });

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
        paramsChecker(config, "instructions");
        const instructions = {
            name: config.name,
            title: setTitle(config.title, 'Instructions'),
            text: config.text,
            button: setButtonText(config.buttonText),
            render: function(CT, babe) {
                const viewTemplate =
                `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class="babe-text-container">
                        <p class="babe-view-text">${this.text}</p>
                    </section>
                    <button id="next" class='babe-view-button'>${this.button}</button>
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
        paramsChecker(config, "begin experiment");
        const begin = {
            name: config.name,
            title: setTitle(config.title, 'Begin'),
            text: config.text,
            button: setButtonText(config.buttonText),
            // render function renders the view
            render: function(CT, babe) {
                const viewTemplate =
                `<div class="babe-view">
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class='babe-text-container'>
                        <p class='babe-view-text'>${this.text}</p>
                    </section>
                    <button id='next' class='babe-view-button'>${this.button}</button>
                </div>`;

                $("#main").html(viewTemplate);

                // moves to the next view
                $("#next").on("click", function(e) {
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return begin;
    },

    forcedChoice: function(config) {
        checkTrialView(config, "forced choice");
        paramsChecker(config, "forced choice");
        const forcedChoice = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate =
                `<div class='babe-view'>
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
                        <label for='o1' class='babe-response-buttons'>${option1}</label>
                        <input type='radio' name='answer' id='o1' value=${option1} />
                        <input type='radio' name='answer' id='o2' value=${option2} />
                        <label for='o2' class='babe-response-buttons'>${option2}</label>
                    </p>
                </div>`
                ;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const startingTime = Date.now();

                // attaches an event listener to the yes / no radio inputs
                // when an input is selected a response property with a value equal
                // to the answer is added to the trial object
                // as well as a readingTimes property with value
                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        response: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return forcedChoice;
    },

    sliderRating: function(config) {
        checkTrialView(config, "slider rating");
        paramsChecker(config, "slider rating");
        const sliderRating = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                let response;
                const viewTemplate =
                `<div class='babe-view'>
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
                        <span class='babe-response-slider-option'>${option1}</span>
                        <input type='range' id='response' class='babe-response-slider' min='0' max='100' value='50'/>
                        <span class='babe-response-slider-option'>${option2}</span>
                    </p>
                    <button id="next" class='babe-view-button babe-nodisplay'>Next</button>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const startingTime = Date.now();
                response = $('#response');

                // checks if the slider has been changed
                response.on('change', function() {
                    $('#next').removeClass('babe-nodisplay');
                });
                response.on('click', function() {
                    $('#next').removeClass('babe-nodisplay');
                });

                $('#next').on('click', function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        response: response.val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return sliderRating;
    },

    textboxInput: function(config) {
        checkTrialView(config, "textbox input");
        paramsChecker(config, "textbox input");
        const textboxInput = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const minChars = (config.data[CT].minChars === undefined) ? 10 : config.data[CT].minChars;
                const viewTemplate = 
                `<div class='babe-view'>
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
                        <textarea name='textbox-input' rows=10 cols=50 class='babe-response-text' />
                    </p>
                    <button id='next' class='babe-view-button babe-nodisplay'>next</button>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const next = $('#next');
                const textInput = $('textarea');
                const startingTime = Date.now();

                // attaches an event listener to the textbox input
                textInput.on('keyup', function() {
                    // if the text is longer than (in this case) 10 characters without the spaces
                    // the 'next' button appears
                    if (textInput.val().trim().length > minChars) {
                        next.removeClass('babe-nodisplay');
                    } else {
                        next.addClass('babe-nodisplay');
                    }
                });

                // the trial data gets added to the trial object
                next.on("click", function() {
                    var RT = Date.now() - startingTime; // measure RT before anything else
                    var trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        minimum_characters: config.data[CT].minChars,
                        response: textInput.val().trim(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return textboxInput;
    },

    dropdownChoice: function(config) {
        checkTrialView(config, "dropdown choice");
        paramsChecker(config, "dropdown choice");
        const dropdownChoice = {
            name: config.name,
            render: function(CT, babe) {
                let response;
                const question_left_part = config.data[CT].question_left_part;
                const question_right_part = (config.data[CT].question_right_part === undefined) ? '' : config.data[CT].question_right_part;
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate = 
                `<div class='babe-view'>
                    <p class='babe-view-answer-container babe-response-dropdown'>
                        ${question_left_part}
                        <select id='response' name='answer'>
                            <option disabled selected></option>
                            <option value=${option1}>${option1}</option>
                            <option value=${option2}>${option2}</option>
                        </select>
                        ${question_right_part}
                        </p>
                        <button id='next' class='babe-view-button babe-nodisplay'>Next</button>
                    </p>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const startingTime = Date.now();
                response = $("#response");

                response.on('change', function() {
                    $('#next').removeClass('babe-nodisplay');
                });

                $('#next').on('click', function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: question_left_part.concat('...answer here...').concat(question_right_part),
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        response: $(response).val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return dropdownChoice;
    },

    ratingScale: function(config) {
        checkTrialView(config, "rating scale");
        paramsChecker(config, "rating scale");
        const ratingScale = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate =
                `<div class='babe-view'>
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
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
                    </p>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const startingTime = Date.now();

                // attaches an event listener to the yes / no radio inputs
                // when an input is selected a response property with a value equal
                // to the answer is added to the trial object
                // as well as a readingTimes property with value
                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        response: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return ratingScale;
    },

    sentenceChoice: function(config) {
        checkTrialView(config, "sentence choice");
        paramsChecker(config, "sentence choice");
        const sentenceChoice = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate =
                `<div class='babe-view'>
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
                        <label for='s1' class='babe-response-sentence'>${option1}</label>
                        <input type='radio' name='answer' id='s1' value=${option1}'/>
                        <label for='s2' class='babe-response-sentence'>${option2}</label>
                        <input type='radio' name='answer' id='s2' value=${option2}"/>
                    </p>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').prepend(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                var startingTime = Date.now();

                $("input[name=answer]").on("change", function() {
                    var RT = Date.now() - startingTime; // measure RT before anything else
                    var trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        response: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return sentenceChoice;
    },

    imageSelection: function(config) {
        checkTrialView(config, "image selection");
        paramsChecker(config, "image selection");
        const imageSelection = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture1 = config.data[CT].picture1;
                const picture2 = config.data[CT].picture2;
                const option1 = config.data[CT].option1;
                const option2 = config.data[CT].option2;
                const viewTemplate =
                `<div class="view">
                    <p class='babe-view-question'>${question}</p>
                    <p class='babe-view-answer-container'>
                        <label for="img1" class='babe-view-picture babe-response-picture'><img src=${picture1}></label>
                        <input type="radio" name="answer" id="img1" value=${option1} />
                        <input type="radio" name="answer" id="img2" value=${option2} />
                        <label for="img2" class='babe-view-picture babe-response-picture'><img src=${picture2}></label>
                    </p>
                </div>`;

                $("#main").html(viewTemplate);

                const startingTime = Date.now();

                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question: config.data[CT].question,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        picture1: config.data[CT].picture1,
                        picture2: config.data[CT].picture2,
                        response: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    babe.trial_data.push(trial_data);
                    babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return imageSelection;
    },

    keyPress: function(config) {
        checkTrialView(config, "key press");
        paramsChecker(config, "key press");
        const keyPress = {
            name: config.name,
            render: function(CT, babe) {
                const question = checkQuestion(config.data[CT].question);
                const picture = config.data[CT].picture;
                const key1 = config.data[CT].key1;
                const key2 = config.data[CT].key2;
                const value1 = config.data[CT][key1];
                const value2 = config.data[CT][key2];
                const viewTemplate =
                `<div class="view">
                    <p class='babe-response-keypress-header'><strong>${key1}</strong> = ${value1}, <strong>${key2}</strong> = ${value2}</p>
                    <p class='babe-view-question'>${question}</p>
                </div>`;

                $("#main").html(viewTemplate);

                if (picture !== undefined) {
                    $('.babe-view').append(
                    `<div class='babe-view-picture'>
                        <img src=${picture}>
                    </div>`)
                };

                const startingTime = Date.now();

                function handleKeyPress(e) {
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
                            question: config.data[CT].question,
                            picture: (config.data[CT].picture === undefined) ? 'NA' : config.data[CT].picture,
                            expected: config.data[CT].expected,
                            key_pressed: keyPressed,
                            correctness: correctness,
                            RT: RT
                        };

                        trial_data[config.data[CT].key1] = config.data[CT][key1];
                        trial_data[config.data[CT].key2] = config.data[CT][key2];

                        babe.trial_data.push(trial_data);
                        $("body").off("keydown", handleKeyPress);
                        babe.findNextView();
                    }
                }

                $("body").on("keydown", handleKeyPress);
            },
            CT: 0,
            trials: config.trials
        };

        return keyPress;
    },

    postTest: function(config) {
        paramsChecker(config, "post test");
        const postTest = {
            name: config.name,
            title: setTitle(config.title, 'Additional Information'),
            text: config.text,
            button: setButtonText(config.buttonText),
            render: function(CT, babe) {
                const viewTemplate = `<div class='babe-view babe-post-test-view'>
                    <h1 class='babe-view-title'>${this.title}</h1>
                    <section class='babe-text-container'>
                        <p class='babe-view-text'>${this.text}</p>
                    </section>
                    <form>
                        <p class='babe-view-text'>
                            <label for="age">Age:</label>
                            <input type="number" name="age" min="18" max="110" id="age" />
                        </p>
                        <p class='babe-view-text'>
                            <label for="gender">Gender:</label>
                            <select id="gender" name="gender">
                                <option></option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>
                        </p>
                        <p class='babe-view-text'>
                            <label for="education">Level of Education:</label>
                            <select id="education" name="education">
                                <option></option>
                                <option value="graduated_high_school">Graduated High School</option>
                                <option value="graduated_college">Graduated College</option>
                                <option value="higher_degree">Higher Degree</option>
                            </select>
                        </p>
                        <p class='babe-view-text'>
                            <label for="languages" name="languages">Native Languages: <br /><span>(i.e. the language(s) spoken at home when you were a child)</</span></label>
                            <input type="text" id="languages"/>
                        </p>
                        <p class="babe-view-text">
                            <label for="comments">Further comments</label>
                            <textarea name="comments" id="comments"
                            rows="6" cols="40"></textarea>
                        </p>
                        <button id="next" class='babe-view-button'>${this.button}</button>
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
        paramsChecker(config, "thanks");
        const thanks = {
            name: config.name,
            title: setTitle(config.title, 'Thank you for taking part in this experiment!'),
            render: function(CT, babe) {

                if (babe.deploy.is_MTurk || babe.deploy.deployMethod === "directLink") {
                    // updates the fields in the hidden form with info for the MTurk's server
                    $("#main").html(
                        `<div class='babe-view babe-thanks-view'>
                            <h2 id='warning-message' class='babe-warning'>Submitting the data
                                <p class='babe-view-text'>please do not close the tab</p>
                                <div class='babe-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='babe-thanks babe-nodisplay'>${this.title}</h1>
                        </div>`
                        );
                } else if (babe.deploy.deployMethod === "Prolific") {
                    $("#main").html(
                        `<div class='babe-view babe-thanks-view'>
                            <h2 id='warning-message' class='babe-warning'>Submitting the data
                                <p class='babe-view-text'>please do not close the tab</p>
                                <div class='babe-loader'></div>
                            </h2>
                            <h1 id='thanks-message' class='babe-thanks babe-nodisplay'>${this.title}</h1>
                            <p id='extra-message' class='babe-view-text babe-nodisplay'>
                                Please press the button below to confirm that you completed the experiment with Prolific
                                <a href="babe.deploy.prolificURL" class="babe-view-button prolific-url">Confirm</a>
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

function paramsChecker(config, view) {
    if (config.trials === undefined || config.trials === "") {
        throw new Error(errors.noTrials.concat(findFile(view)));
    }

    if (config.name === undefined || config.name === "") {
        throw new Error(errors.noName.concat(findFile(view)));
    }
}

function checkTrialView(config, view) {
    if (config.data === undefined || config.data === null) {
        throw new Error(errors.noData.concat(findFile(view)));
    }

    if (config.data instanceof Array === false) {
        throw new Error(errors.notAnArray.concat(findFile(view)));
    }

    if (config.trial_type === undefined || config.trial_type === "") {
        throw new Error(errors.noTrialType.concat(findFile(view)));
    }
}

function findFile(view) {
    return `

The problem is in ${view} view.`;
}
