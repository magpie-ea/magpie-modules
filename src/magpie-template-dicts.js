// The view template dict contains a generator function for every view type we support
// The generator gets the config dict and CT as input and will generate the magpie-view HTML code
// (Some view templates are the same, e.g. forced_choice and sliderRating)
const stimulus_container_generators = {
    basic_stimulus: function (config, CT) {
        return `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
    },
    key_press: function(config, CT) {
        return `<div class="magpie-view">
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <p class='magpie-response-keypress-header'>
                    <strong>${config.data[CT].key1}</strong> = ${config.data[CT][config.data[CT].key1]}, 
                    <strong>${config.data[CT].key2}</strong> = ${config.data[CT][config.data[CT].key2]}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                </div>`;
    },
    fixed_text: function(config, CT) {
        return `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <section class="magpie-text-container">
                        <p class="magpie-view-text">${config.text}</p>
                    </section>
                </div>`;
    },
    post_test: function(config, CT) {
        return `<div class='magpie-view magpie-post-test-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <section class="magpie-text-container">
                        <p class="magpie-view-text">${config.text}</p>
                    </section>
                </div>`;
    },
    empty: function(config, CT) {
        return ``;
    },
    self_paced_reading: function(config, CT) {
        const helpText = config.data[CT].help_text !== undefined ?
            config.data[CT].help_text : "Press the SPACE bar to reveal the words";
        return `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                    <div class='magpie-view-stimulus-container'>
                        <div class='magpie-view-stimulus magpie-nodisplay'></div>
                    </div>
                    <p class='magpie-help-text magpie-nodisplay'>${helpText}</p>
                    <p class='magpie-spr-sentence'></p>
                </div>`;
    }
};

// The answer container dict contains a generator function for every view type we support
// The generator gets the config dict and CT as input and will generate the magpie-view-answer-container HTML code
// (Some answer container elements should be the same, e.g. slider rating and SPR-slider rating)
const answer_container_generators = {
    button_choice: function (config, CT) {
        return `<div class='magpie-view-answer-container'>
                    <p class='magpie-view-question'>${config.data[CT].question}</p>
                    <label for='o1' class='magpie-response-buttons'>${config.data[CT].option1}</label>
                    <input type='radio' name='answer' id='o1' value=${config.data[CT].option1} />
                    <input type='radio' name='answer' id='o2' value=${config.data[CT].option2} />
                    <label for='o2' class='magpie-response-buttons'>${config.data[CT].option2}</label>
                </div>`;
    },
    question: function(config, CT) {
        return `<div class='magpie-view-answer-container'>
                        <p class='magpie-view-question'>${config.data[CT].question}</p>`;
    },
    one_button: function (config, CT) {
        return `<button id="next" class='magpie-view-button' class="magpie-nodisplay">${
            config.button
            }</button>`
    },
    post_test: function(config, CT) {
        const quest = magpieUtils.view.fill_defaults_post_test(config);
        return `<form>
                    <p class='magpie-view-text'>
                        <label for="age">${quest.age.title}:</label>
                        <input type="number" name="age" min="18" max="110" id="age" />
                    </p>
                    <p class='magpie-view-text'>
                        <label for="gender">${quest.gender.title}:</label>
                        <select id="gender" name="gender">
                            <option></option>
                            <option value="${quest.gender.male}">${quest.gender.male}</option>
                            <option value="${quest.gender.female}">${quest.gender.female}</option>
                            <option value="${quest.gender.other}">${quest.gender.other}</option>
                        </select>
                    </p>
                    <p class='magpie-view-text'>
                        <label for="education">${quest.edu.title}:</label>
                        <select id="education" name="education">
                            <option></option>
                            <option value="${quest.edu.graduated_high_school}">${quest.edu.graduated_high_school}</option>
                            <option value="${quest.edu.graduated_college}">${quest.edu.graduated_college}</option>
                            <option value="${quest.edu.higher_degree}">${quest.edu.higher_degree}</option>
                        </select>
                    </p>
                    <p class='magpie-view-text'>
                        <label for="languages" name="languages">${quest.langs.title}:<br /><span>${quest.langs.text}</</span></label>
                        <input type="text" id="languages"/>
                    </p>
                    <p class="magpie-view-text">
                        <label for="comments">${quest.comments.title}</label>
                        <textarea name="comments" id="comments" rows="6" cols="40"></textarea>
                    </p>
                    <button id="next" class='magpie-view-button'>${config.button}</button>
            </form>`
    },
    empty: function(config, CT) {
        return ``;
    },
    slider_rating: function(config, CT) {
        const option1 = config.data[CT].optionLeft;
        const option2 = config.data[CT].optionRight;
        return `<p class='magpie-view-question'>${config.data[CT].question}</p>
                <div class='magpie-view-answer-container'>
                    <span class='magpie-response-slider-option'>${option1}</span>
                    <input type='range' id='response' class='magpie-response-slider' min='0' max='100' value='50'/>
                    <span class='magpie-response-slider-option'>${option2}</span>
                </div>
                <button id="next" class='magpie-view-button magpie-nodisplay'>Next</button>`;
    },
    textbox_input: function(config, CT) {
        return `<p class='magpie-view-question'>${config.data[CT].question}</p>
                    <div class='magpie-view-answer-container'>
                        <textarea name='textbox-input' rows=10 cols=50 class='magpie-response-text' />
                    </div>
                    <button id='next' class='magpie-view-button magpie-nodisplay'>next</button>`;
    },
    dropdown_choice: function(config, CT) {
        const question_left_part =
            config.data[CT].question_left_part === undefined ? "" : config.data[CT].question_left_part;
        const question_right_part =
            config.data[CT].question_right_part === undefined ? "" : config.data[CT].question_right_part;
        const option1 = config.data[CT].option1;
        const option2 = config.data[CT].option2;
        return `<div class='magpie-view-answer-container magpie-response-dropdown'>
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

    },
    rating_scale: function(config, CT) {
        return `<p class='magpie-view-question'>${config.data[CT].question}</p>
                <div class='magpie-view-answer-container'>
                    <strong class='magpie-response-rating-option magpie-view-text'>${config.data[CT].optionLeft}</strong>
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
                    <strong class='magpie-response-rating-option magpie-view-text'>${config.data[CT].optionRight}</strong>
                </div>`;
    },
    sentence_choice: function(config, CT) {
        return `<div class='magpie-view-answer-container'>
                    <p class='magpie-view-question'>${config.data[CT].question}</p>
                    <label for='s1' class='magpie-response-sentence'>${config.data[CT].option1}</label>
                    <input type='radio' name='answer' id='s1' value="${config.data[CT].option1}" />
                    <label for='s2' class='magpie-response-sentence'>${config.data[CT].option2}</label>
                    <input type='radio' name='answer' id='s2' value="${config.data[CT].option2}" />
                </div>`;
    },
    image_selection: function(config, CT) {
        $(".magpie-view-stimulus-container").addClass("magpie-nodisplay");
        return    `<div class='magpie-view-answer-container'>
                        <p class='magpie-view-question'>${config.data[CT].question}</p>
                        <label for="img1" class='magpie-view-picture magpie-response-picture'><img src=${config.data[CT].picture1}></label>
                        <input type="radio" name="answer" id="img1" value="${config.data[CT].option1}" />
                        <input type="radio" name="answer" id="img2" value="${config.data[CT].option2}" />
                        <label for="img2" class='magpie-view-picture magpie-response-picture'><img src=${config.data[CT].picture2}></label>
                    </div>`;
    }
};

// The enable response dict contains a generator function for every view type we support
// The generator gets the config dict, CT, the answer_container_generator and the startingTime as input
const handle_response_functions = {
    button_choice: function(config, CT, magpie, answer_container_generator, startingTime) {
        $(".magpie-view").append(answer_container_generator(config, CT));

        // attaches an event listener to the yes / no radio inputs
        // when an input is selected a response property with a value equal
        // to the answer is added to the trial object
        // as well as a readingTimes property with value
        $("input[name=answer]").on("change", function() {
            const RT = Date.now() - startingTime;
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                response: $("input[name=answer]:checked").val(),
                RT: RT
            };

            trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

            magpie.trial_data.push(trial_data);
            magpie.findNextView();
        });
    },
    key_press: function (config, CT, magpie, answer_container_generator, startingTime) {

        $(".magpie-view").append(answer_container_generator(config, CT));

        const handleKeyPress = function(e) {
            const keyPressed = String.fromCharCode(
                e.which
            ).toLowerCase();

            if (keyPressed === config.data[CT].key1 || keyPressed === config.data[CT].key2) {
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

                let trial_data = {
                    trial_name: config.name,
                    trial_number: CT + 1,
                    key_pressed: keyPressed,
                    correctness: correctness,
                    RT: RT
                };

                trial_data[config.data[CT].key1] =
                    config.data[CT][config.data[CT].key1];
                trial_data[config.data[CT].key2] =
                    config.data[CT][config.data[CT].key2];

                trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

                magpie.trial_data.push(trial_data);
                $("body").off("keydown", handleKeyPress);
                magpie.findNextView();
            }
        };

        $("body").on("keydown", handleKeyPress);
    },
    intro: function(config, CT, magpie, answer_container_generator, startingTime) {

        $(".magpie-view").append(answer_container_generator(config, CT));

        let prolificId;
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
    one_click: function(config, CT, magpie, answer_container_generator, startingTime) {

        $(".magpie-view").append(answer_container_generator(config, CT));

        $("#next").on("click", function() {
            magpie.findNextView();
        });
    },
    post_test: function(config, CT, magpie, answer_container_generator, startingTime) {
        $(".magpie-view").append(answer_container_generator(config, CT));

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
    thanks: function(config, CT, magpie, answer_container_generator, startingTime) {
        const prolificConfirmText = magpieUtils.view.setter.prolificConfirmText(config.prolificConfirmText,
            "Please press the button below to confirm that you completed the experiment with Prolific");
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
                    config.title
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
                    config.title
                    }</h1>
                            <p id='extra-message' class='magpie-view-text magpie-nodisplay'>
                                ${prolificConfirmText}
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
    slider_rating: function(config, CT, magpie, answer_container_generator, startingTime){
        let response;

        $(".magpie-view").append(answer_container_generator(config, CT));

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
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                response: response.val(),
                RT: RT
            };

            trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

            magpie.trial_data.push(trial_data);
            magpie.findNextView();
        });
    },
    textbox_input: function(config, CT, magpie, answer_container_generator, startingTime) {
        let next;
        let textInput;
        const minChars = config.data[CT].min_chars === undefined ? 10 : config.data[CT].min_chars;

        $(".magpie-view").append(answer_container_generator(config, CT));

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
            const RT = Date.now() - startingTime; // measure RT before anything else
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                response: textInput.val().trim(),
                RT: RT
            };

            trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

            magpie.trial_data.push(trial_data);
            magpie.findNextView();
        });
    },
    dropdown_choice: function(config, CT, magpie, answer_container_generator, startingTime){
        let response;

        const question_left_part =
            config.data[CT].question_left_part === undefined ? "" : config.data[CT].question_left_part;
        const question_right_part =
            config.data[CT].question_right_part === undefined ? "" : config.data[CT].question_right_part;

        $(".magpie-view").append(answer_container_generator(config, CT));

        response = $("#response");

        response.on("change", function() {
            $("#next").removeClass("magpie-nodisplay");
        });


        $("#next").on("click", function() {
            const RT = Date.now() - startingTime; // measure RT before anything else
            let trial_data = {
                trial_name: config.name,
                trial_number: CT + 1,
                question: question_left_part.concat("...answer here...").concat(question_right_part),
                response: response.val(),
                RT: RT
            };

            trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

            magpie.trial_data.push(trial_data);
            magpie.findNextView();
        });
    },
    self_paced_reading: function(config, CT, magpie, answer_container_generator, startingTime){

        const sentenceList = config.data[CT].sentence.trim().split(" | ");
        let spaceCounter = 0;
        let wordList;
        let readingTimes = [];
        // wordPos "next" or "same", if "next" words appear next to each other, if "same" all words appear at the same place
        // default: "next"
        let wordPos = config.data[CT].wordPos === undefined ? "next" : config.data[CT].wordPos;
        let showNeighbor = wordPos === "next";
        // underline "words", "sentence" or "none", if "words" every word gets underlined, if "sentence" the sentence gets
        // underlined, if "none" there is no underline
        // default: "words"
        let underline = config.data[CT].underline === undefined ? "words" : config.data[CT].underline;
        let not_underline = underline === "none";
        let one_line = underline === "sentence";

        // shows the sentence word by word on SPACE press
        const handle_key_press = function(e) {

            if (e.which === 32 && spaceCounter < sentenceList.length) {
                if (showNeighbor) {
                    wordList[spaceCounter].classList.remove("spr-word-hidden");
                } else {
                    $(".magpie-spr-sentence").html(`<span class='spr-word'>${sentenceList[spaceCounter]}</span>`);
                    if (not_underline){
                        $('.magpie-spr-sentence .spr-word').addClass('no-line');
                    }
                }

                if (spaceCounter === 0) {
                    $(".magpie-help-text").addClass("magpie-invisible");
                }

                if (spaceCounter > 0 && showNeighbor) {
                    wordList[spaceCounter - 1].classList.add("spr-word-hidden");
                }

                readingTimes.push(Date.now());
                spaceCounter++;
            } else if (e.which === 32 && spaceCounter === sentenceList.length) {
                if (showNeighbor) {
                    wordList[spaceCounter - 1].classList.add("spr-word-hidden");
                } else {
                    $(".magpie-spr-sentence").html("");
                }

                $(".magpie-view").append(answer_container_generator(config, CT));

                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime;
                    let reactionTimes = readingTimes
                    .reduce((result, current, idx) => {
                        return result.concat(
                            readingTimes[idx + 1] - readingTimes[idx]
                        );
                    }, [])
                    .filter((item) => isNaN(item) === false);
                    let trial_data = {
                        trial_name: config.name,
                        trial_number: CT + 1,
                        response: $("input[name=answer]:checked").val(),
                        reaction_times: reactionTimes,
                        time_spent: RT
                    };

                    trial_data = magpieUtils.view.save_config_trial_data(config.data[CT], trial_data);

                    magpie.trial_data.push(trial_data);
                    magpie.findNextView();
                });
                readingTimes.push(Date.now());
                spaceCounter++;
            }
        };
        // shows the help text
        $(".magpie-help-text").removeClass("magpie-nodisplay");

        if (showNeighbor) {
            // creates the sentence
            sentenceList.map((word) => {
                $(".magpie-spr-sentence").append(
                    `<span class='spr-word spr-word-hidden'>${word}</span>`
                );
            });

            // creates an array of spr word elements
            wordList = $(".spr-word").toArray();
        }

        if (not_underline){
            $('.magpie-spr-sentence .spr-word').addClass('no-line');
        }
        if (one_line){
            $('.magpie-spr-sentence .spr-word').addClass('one-line');
        }

        // attaches an eventListener to the body for space
        $("body").on("keydown", handle_key_press);

    }
};

const view_info_dict = {
    intro: {
        type: "wrapping",
        default_title: "Welcome!",
        default_button_text: "Next",
        default_view_temp: stimulus_container_generators.fixed_text,
        default_answer_temp: answer_container_generators.one_button,
        default_handle_response: handle_response_functions.intro
    },
    instructions: {
        type: "wrapping",
        default_title: "Instructions",
        default_button_text: "Next",
        default_view_temp: stimulus_container_generators.fixed_text,
        default_answer_temp: answer_container_generators.one_button,
        default_handle_response: handle_response_functions.one_click
    },
    begin: {
        type: "wrapping",
        default_title: "Begin",
        default_button_text: "Next",
        default_view_temp: stimulus_container_generators.fixed_text,
        default_answer_temp: answer_container_generators.one_button,
        default_handle_response: handle_response_functions.one_click
    },
    post_test: {
        type: "wrapping",
        default_title: "Additional Information",
        default_button_text: "Next",
        default_view_temp: stimulus_container_generators.post_test,
        default_answer_temp: answer_container_generators.post_test,
        default_handle_response: handle_response_functions.post_test
    },
    thanks: {
        type: "wrapping",
        default_title: "Thank you for taking part in this experiment!",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.empty,
        default_answer_temp: answer_container_generators.empty,
        default_handle_response: handle_response_functions.thanks
    },
    forced_choice: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.button_choice,
        default_handle_response: handle_response_functions.button_choice
    },
    key_press: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.key_press,
        default_answer_temp: answer_container_generators.question,
        default_handle_response: handle_response_functions.key_press
    },
    slider_rating: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.slider_rating,
        default_handle_response: handle_response_functions.slider_rating
    },
    textbox_input: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.textbox_input,
        default_handle_response: handle_response_functions.textbox_input
    },
    dropdown_choice: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.dropdown_choice,
        default_handle_response: handle_response_functions.dropdown_choice
    },
    rating_scale: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.rating_scale,
        default_handle_response: handle_response_functions.button_choice
    },
    sentence_choice: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.sentence_choice,
        default_handle_response: handle_response_functions.button_choice
    },
    image_selection: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.basic_stimulus,
        default_answer_temp: answer_container_generators.image_selection,
        default_handle_response: handle_response_functions.button_choice
    },
    self_paced_reading: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.self_paced_reading,
        default_answer_temp: answer_container_generators.button_choice,
        default_handle_response: handle_response_functions.self_paced_reading
    },
    self_paced_reading_rating_scale: {
        type: "trial",
        default_title: "",
        default_button_text: "",
        default_view_temp: stimulus_container_generators.self_paced_reading,
        default_answer_temp: answer_container_generators.rating_scale,
        default_handle_response: handle_response_functions.self_paced_reading
    }
};