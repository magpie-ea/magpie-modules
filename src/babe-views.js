const _babeViews = {
    intro: function(config) {
        paramsChecker(config, 'intro');
        const _intro = {
            name: config.name,
            title: config.title,
            text: config.text,
            buttonText: config.buttonText,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class='view'>
                    {{# title }}
                    <h1 class="title">{{ title }}</h1>
                    {{/ title }}
                    {{# text }}
                    <section class="text-container">
                    <p class="text">{{{ text }}}</p>
                    </section>
                    {{/ text }}
                    <p id="prolific-id-form">
                        <label for="prolific-id">Please, enter your Prolific ID</label>
                        <input type="text" id="prolific-id" />
                    </p>
                    {{# button }}
                    <button id="next" class="nodisplay">{{ button }}</button>
                    {{/ button }}
                    {{^ button }}
                    <button id="next" class="nodisplay">Begin Experiment</button>
                    {{/ button }}
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        title: this.title,
                        text: this.text,
                        button: this.buttonText
                    })
                );

                const prolificId = $("#prolific-id");
                const IDform = $("#prolific-id-form");
                const next = $("#next");

                function showNextBtn() {
                    if (prolificId.val().trim() !== "") {
                        next.removeClass("nodisplay");
                    } else {
                        next.addClass("nodisplay");
                    }
                }

                if (_babe.deploy.deployMethod !== "Prolific") {
                    IDform.addClass("nodisplay");
                    next.removeClass("nodisplay");
                }

                prolificId.on("keyup", function() {
                    showNextBtn();
                });

                prolificId.on("focus", function() {
                    showNextBtn();
                });

                // moves to the next view
                next.on("click", function() {
                    if (_babe.deploy.deployMethod === "Prolific") {
                        _babe.global_data.prolific_id = prolificId.val().trim();
                    }

                    _babe.findNextView();
                });
            },
            CT: 0,
            // for how many trials should this view be repeated?
            trials: config.trials
        };

        return _intro;
    },

    instructions: function(config) {
        paramsChecker(config, 'instructions');
        const _instructions = {
            name: config.name,
            title: config.title,
            text: config.text,
            buttonText: config.buttonText,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    {{# title }}
                    <h1>{{ title }}</h1>
                    {{/ title }}
                    {{# text }}
                    <section class="text-container">
                        <p class="text">{{ text }}</p>
                    </section>
                    {{/ text }}
                    {{# button }}
                    <button id="next">{{ button }}</button>
                    {{/ button }}
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        title: this.title,
                        text: this.text,
                        button: this.buttonText
                    })
                );

                // moves to the next view
                $("#next").on("click", function() {
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _instructions;
    },

    begin: function(config) {
        paramsChecker(config, 'begin experiment');
        const _begin = {
            name: config.name,
            "text": config.text,
            // render function renders the view
            render: function(CT, _babe) {
                const viewTemplate = 
                `<div class="view">
                    {{# text }}
                    <section class="text-container">
                        <p class="text">{{ text }}</p>
                    </section>
                    {{/ text }}
                    <button id="next">Begin Experiment</button>
                </div>`;

                $('#main').html(Mustache.render(viewTemplate, {
                    title: this.title,
                    text: this.text
                }));

                // moves to the next view
                $('#next').on('click', function (e) {
                    _babe.findNextView();
                });

            },
            CT: 0,
            trials: config.trials
        };

        return _begin;
    },

    forcedChoice: function(config) {
        checkTrialView(config, 'forced choice');
        paramsChecker(config, 'forced choice');
        const _forcedChoice = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate = 
                `<div class="view">
                    <div class="picture", align = "center">
                        <img src={{picture}} alt="a picture" height="100" width="100">
                    </div>
                    <p class="question">
                    {{# question }}
                    {{ question }}
                    {{/ question }}
                    </p>
                    <p class="answer-container buttons-container">
                        <label for="yes" class="button-answer">{{ option1 }}</label>
                        <input type="radio" name="answer" id="yes" value={{ option1 }} />
                        <input type="radio" name="answer" id="no" value={{ option2 }} />
                        <label for="no" class="button-answer">{{option2}}</label>
                    </p>
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture:
                            config.data[CT].picture
                    })
                );

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
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        option_chosen: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _forcedChoice;
    },

    sliderRating: function(config) {
        checkTrialView(config, 'slider rating');
        paramsChecker(config, 'slider rating');
        const _sliderRating = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    <div class="picture", align = "center">
                        <img src={{ picture }} alt="a picture" height="100" width="100">
                    </div>
                    <p class="question">
                    {{# question }}
                    {{ question }}
                    {{/ question }}
                    </p>
                    <p class="answer-container slider-container">
                        <span class="unnatural">{{ option1 }}</span>
                        <input type="range" id="response" class="slider-response" min="0" max="100" value="50"/>
                        <span class="natural">{{ option2 }}</span>
                    </p>
                    <button id="next" class="nodisplay">Next</button>
                </div>`;

                let response;
                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture:
                            config.data[CT].picture
                    })
                );
                const startingTime = Date.now();
                response = $("#response");

                // checks if the slider has been changed
                response.on("change", function() {
                    $("#next").removeClass("nodisplay");
                });
                response.on("click", function() {
                    $("#next").removeClass("nodisplay");
                });

                $("#next").on("click", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        rating_slider: response.val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _sliderRating;
    },

    textboxInput: function(config) {
        checkTrialView(config, 'textbox input');
        paramsChecker(config, 'textbox input');
        const _textboxInput = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    <p class="question">
                    {{# question }}
                    {{/ question }}
                    {{ question }}
                    </p>
                    {{# picture }}
                    <div class="picture", align = "center">
                        <img src={{ picture }} alt="picture" height="100" width="100">
                    </div>
                    {{/ picture }}
                    <p class="answer-container">
                        <textarea name="textbox-input" rows=10 cols=50 class="textbox-input" />
                    </p>
                    <button id="next" class="nodisplay">next</button>
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        picture: config.data[CT].picture
                    })
                );
                const next = $("#next");
                const textInput = $("textarea");
                const startingTime = Date.now();

                // attaches an event listener to the textbox input
                textInput.on("keyup", function() {
                    // if the text is longer than (in this case) 10 characters without the spaces
                    // the 'next' button appears
                    if (textInput.val().trim().length > 10) {
                        next.removeClass("nodisplay");
                    } else {
                        next.addClass("nodisplay");
                    }
                });

                // the trial data gets added to the trial object
                next.on("click", function() {
                    var RT = Date.now() - startingTime; // measure RT before anything else
                    var trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question:
                            config.data[CT].question,
                        text_input: textInput.val().trim(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _textboxInput;
    },

    dropdownChoice: function(config) {
        checkTrialView(config, 'dropdown choice');
        paramsChecker(config, 'dropdown choice');
        const _dropdownChoice = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate = 
                `<div class="view">
                    <div class="picture", align = "center">
                        <img src={{ picture }} alt="a picture" height="100" width="100">
                    </div>

                    {{# question }}
                    <p class="answer-container dropdown-container">
                        <p class="question">
                        {{ question }}
                        <select id="response" name="answer">
                            <option disabled selected></option>
                            <option value={{ option1 }}>{{ option1 }}</option>
                            <option value={{ option2 }}>{{ option2 }}</option>
                        </select>
                        </p>
                        <button id="next" class="nodisplay">Next</button>
                    </p>
                    {{/ question }}
                    {{# questionLeftPart }}
                    <p class="answer-container dropdown-container">
                        <p class="question">
                        {{ questionLeftPart }}
                        <select id="response" name="answer">
                            <option disabled selected></option>
                            <option value={{ option1 }}>{{ option1 }}</option>
                            <option value={{ option2 }}>{{ option2 }}</option>
                        </select>
                        {{ questionRightPart }}
                        </p>
                        <button id="next" class="nodisplay">Next</button>
                    </p>
                    {{/ questionLeftPart }}
                </div>`;

                let response;
                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        questionLeftPart:
                            config.data[CT]
                                .questionLeftPart,
                        questionRightPart:
                            config.data[CT]
                                .questionRightPart,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture: config.data[CT].picture
                    })
                );
                const startingTime = Date.now();
                response = $("#response");

                response.on("change", function() {
                    $("#next").removeClass("nodisplay");
                });

                $("#next").on("click", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        dropdown_choice: $(response).val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _dropdownChoice;
    },

    ratingScale: function(config) {
        checkTrialView(config, 'rating scale');
        paramsChecker(config, 'rating scale');
        const _ratingScale = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    {{# picture }}
                    <div class="picture", align = "center">
                        <img src={{ picture }} alt="picture" height="100" width="100">
                    </div>
                    {{/ picture }}

                    <p class="question">
                    {{# question }}
                    {{ question }}
                    {{/ question }}
                    </p>

                    <p class="answer-container buttons-container">
                        <strong>{{ option1 }}</strong>
                        <label for="1" class="rating-answer">1</label>
                        <input type="radio" name="answer" id="1" value="1" />
                        <label for="2" class="rating-answer">2</label>
                        <input type="radio" name="answer" id="2" value="2" />
                        <label for="3" class="rating-answer">3</label>
                        <input type="radio" name="answer" id="3" value="3" />
                        <label for="4" class="rating-answer">4</label>
                        <input type="radio" name="answer" id="4" value="4" />
                        <label for="5" class="rating-answer">5</label>
                        <input type="radio" name="answer" id="5" value="5" />
                        <label for="6" class="rating-answer">6</label>
                        <input type="radio" name="answer" id="6" value="6" />
                        <label for="7" class="rating-answer">7</label>
                        <input type="radio" name="answer" id="7" value="7" />
                        <strong>{{ option2 }}</strong>
                    </p>
                </div>`;
                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question: config.data[CT].question,
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        picture: config.data[CT].picture
                    })
                );
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
                        option1: config.data[CT].option1,
                        option2: config.data[CT].option2,
                        option_chosen: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _ratingScale;
    },

    sentenceChoice: function(config) {
        checkTrialView(config, 'sentence choice');
        paramsChecker(config, 'sentence choice');
        const _sentenceChoice = {
            name: config.name,
            render: function(CT, _babe) {
                var viewTemplate = 
                `<div class="view">
                    {{# picture }}
                    <div class="picture" align = "center">
                        <img src={{ picture }} alt="picture" height="100" width="100">
                    </div>
                    {{/ picture }}

                    <p class="question">
                    {{# question }}
                    {{ question }}
                    {{/ question }}
                    </p>

                    <p class="answer-container buttons-container">
                        <label for="1" class="sentence-selection">{{ option1 }}</label>
                        <input type="radio" name="answer" id="1" value="{{ option1 }}"/>
                        <label for="2" class="sentence-selection">{{ option2 }}</label>
                        <input type="radio" name="answer" id="2" value="{{ option2 }}"/>
                    </p>
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture: config.data[CT].picture
                    })
                );
                var startingTime = Date.now();

                $("input[name=answer]").on("change", function() {
                    var RT = Date.now() - startingTime; // measure RT before anything else
                    var trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        option_chosen: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _sentenceChoice;
    },

    imageSelection: function(config) {
        checkTrialView(config, 'image selection');
        paramsChecker(config, 'image selection');
        const _imageSelection = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    <p class="question">
                    {{# question }}
                    {{ question }}
                    {{/ question }}
                    </p>

                    <p class="answer-container imgs-container">
                        <label for="img1" class="img-answer"><img src={{ picture1 }} alt="picture" height="100" width="100"></label>
                        <input type="radio" name="answer" id="img1" value={{  option1 }} />
                        <input type="radio" name="answer" id="img2" value={{ option2 }} />
                        <label for="img2" class="img-answer"><img src={{ picture2 }} alt="picture" height="100" width="100"></label>
                    </p>
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture1:
                            config.data[CT].picture1,
                        picture2:
                            config.data[CT].picture2
                    })
                );
                const startingTime = Date.now();

                $("input[name=answer]").on("change", function() {
                    const RT = Date.now() - startingTime; // measure RT before anything else
                    const trial_data = {
                        trial_type: config.trial_type,
                        trial_number: CT + 1,
                        question:
                            config.data[CT].question,
                        option1:
                            config.data[CT].option1,
                        option2:
                            config.data[CT].option2,
                        picture1:
                            config.data[CT].picture1,
                        picture2:
                            config.data[CT].picture2,
                        image_selected: $("input[name=answer]:checked").val(),
                        RT: RT
                    };
                    _babe.trial_data.push(trial_data);
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };
     
        return _imageSelection;   
    },

    keyPress: function(config) {
        checkTrialView(config, 'key press');
        paramsChecker(config, 'key press');
        const _keyPress = {
            name: config.name,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view">
                    <h3>{{ key1 }} = {{ value1 }}, {{ key2 }} = {{ value2 }}</h3>
                    <p class="question">
                    {{# question }}
                    {{/ question }}
                    {{ question }}
                    </p>
                    {{# picture }}
                    <div class="picture", align = "center">
                        <img src={{ picture }} alt="picture" height="100" width="100">
                    </div>
                    {{/ picture }}
                </div>`;

                const key1 = config.data[CT].key1;
                const key2 = config.data[CT].key2;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        question: config.data[CT].question,
                        picture: config.data[CT].picture,
                        key1: key1,
                        key2: key2,
                        value1: config.data[CT][key1],
                        value2: config.data[CT][key2]
                    })
                );
                const startingTime = Date.now();

                function handleKeyPress(e) {
                    const keyPressed = String.fromCharCode(e.which).toLowerCase();

                    if (keyPressed === key1 || keyPressed === key2) {
                        let correctness;
                        const RT = Date.now() - startingTime; // measure RT before anything else

                        if (
                            config.data[CT].expected ===
                            config.data[CT][
                                keyPressed.toLowerCase()
                            ]
                        ) {
                            correctness = "correct";
                        } else {
                            correctness = "incorrect";
                        }

                        const trial_data = {
                            trial_type: config.trial_type,
                            trial_number: CT + 1,
                            question:
                                config.data[CT].question,
                            expected:
                                config.data[CT].expected,
                            key_pressed: keyPressed,
                            correctness: correctness,
                            RT: RT
                        };

                        trial_data["key1"] =
                            config.data[CT][key1];
                        trial_data["key2"] =
                            config.data[CT][key2];

                        // question or/and picture are optional
                        if (
                            config.data[CT].picture !==
                            undefined
                        ) {
                            trial_data["picture"] =
                                config.data[CT].picture;
                        }

                        if (
                            config.data[CT].question !==
                            undefined
                        ) {
                            trial_data["question"] =
                                config.data[CT].question;
                        }

                        _babe.trial_data.push(trial_data);
                        $("body").off("keydown", handleKeyPress);
                        _babe.findNextView();
                    }
                }

                $("body").on("keydown", handleKeyPress);
            },
            CT: 0,
            trials: config.trials
        };

        return _keyPress;
    },

    postTest: function(config) {
        paramsChecker(config, 'post test');
        const _postTest = {
            name: config.name,
            title: config.title,
            text: config.text,
            buttonText: config.buttonText,
            render: function(CT, _babe) {
                const viewTemplate =
                `<div class="view post-test-templ">
                    {{# title }}
                    <h1>{{ title }}</h1>
                    {{/ title }}
                    {{# text }}
                    <section class="text-container">
                        <p class="text">{{ text }}</p>
                    </section>
                    {{/ text }}
                    <form>
                        <p>
                            <label for="age">Age:</label>
                            <input type="number" name="age" min="18" max="110" id="age" />
                        </p>
                        <p>
                            <label for="gender">Gender:</label>
                            <select id="gender" name="gender">
                                <option></option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>
                        </p>
                        <p>
                            <label for="education">Level of Education:</label>
                            <select id="education" name="education">
                                <option></option>
                                <option value="graduated_high_school">Graduated High School</option>
                                <option value="graduated_college">Graduated College</option>
                                <option value="higher_degree">Higher Degree</option>
                            </select>
                        </p>
                        <p>
                            <label for="languages" name="languages">Native Languages: <br /><span>(i.e. the language(s) spoken at home when you were a child)</</span></label>
                            <input type="text" id="languages"/>
                        </p>
                        <p class="comment-sect">
                            <label for="comments">Further comments</label>
                            <textarea name="comments" id="comments"
                            rows="6" cols="40"></textarea>
                        </p>
                        {{# buttonText }}
                        <button id="next">{{ buttonText }}</button>
                        {{/ buttonText }}
                        {{^ buttonText }}
                        <button id="next">Next</button>
                        {{/ buttonText }}
                    </form>
                </div>`;

                $("#main").html(
                    Mustache.render(viewTemplate, {
                        title: this.title,
                        text: this.text,
                        buttonText: this.buttonText
                    })
                );

                $("#next").on("click", function(e) {
                    // prevents the form from submitting
                    e.preventDefault();

                    // records the post test info
                    _babe.global_data.age = $("#age").val();
                    _babe.global_data.gender = $("#gender").val();
                    _babe.global_data.education = $("#education").val();
                    _babe.global_data.languages = $("#languages").val();
                    _babe.global_data.comments = $("#comments")
                        .val()
                        .trim();
                    _babe.global_data.endTime = Date.now();
                    _babe.global_data.timeSpent =
                        (_babe.global_data.endTime - _babe.global_data.startTime) /
                        60000;

                    // moves to the next view
                    _babe.findNextView();
                });
            },
            CT: 0,
            trials: config.trials
        };

        return _postTest;
    },

    thanks: function(config) {
        paramsChecker(config, 'thanks');
        const _thanks = {
            name: config.name,
            message: config.title,
            render: function(CT, _babe) {
                var viewTemplate =
                `<div class="view thanks-templ">
                    <h4 class="warning-message">submitting the data
                        <div class="loader"></div>
                    </h4>
                    {{# thanksMessage }}
                    <h1 class="thanks-message nodisplay">{{ thanksMessage }}</h1>
                    {{/ thanksMessage }}
                    {{^ thanksMessage }}
                    <h1 class="thanks-message nodisplay">Thank you for taking part in this experiment!</h1>
                    {{/ thanksMessage }}
                    {{# extraMessage }}
                    <h2 class="extra-message nodisplay">{{{ extraMessage }}}</h2>
                    {{/ extraMessage }}
                </div>`;

                // what is seen on the screen depends on the used deploy method
                //    normally, you do not need to modify this
                if (
                    _babe.deploy.is_MTurk ||
                    _babe.deploy.deployMethod === "directLink"
                ) {
                    // updates the fields in the hidden form with info for the MTurk's server
                    $("#main").html(
                        Mustache.render(viewTemplate, {
                            thanksMessage: this.message
                        })
                    );
                } else if (_babe.deploy.deployMethod === "Prolific") {
                    $("main").html(
                        Mustache.render(viewTemplate, {
                            thanksMessage: this.message,
                            extraMessage: "Please press the button below to confirm that you completed the experiment with Prolific<br />".concat(
                                "<a href=",
                                _babe.deploy.prolificURL,
                                ' class="prolific-url">Confirm</a>'
                            )
                        })
                    );
                } else if (_babe.deploy.deployMethod === "debug") {
                    $("main").html(Mustache.render(viewTemplate, {}));
                } else {
                    console.log("no such _babe.deploy.deployMethod");
                }

                _babe.submission.submit(_babe);
            },
            CT: 0,
            trials: 1
        };
        
        return _thanks;
    }
};

function paramsChecker(config, view) {
    if (config.trials === undefined || config.trials === '') {
        throw new Error (errors.noTrials.concat(findFile(view)));
    }

    if (config.name === undefined || config.name === '') {
        throw new Error (errors.noName.concat(findFile(view)));
    }
};

function checkTrialView(config, view) {
    if (config.data === undefined || config.data === null) {
        throw new Error (errors.noData.concat(findFile(view)));
    }

    if (config.data instanceof Array === false) {
        throw new Error (errors.notAnArray.concat(findFile(view)));
    }

    if (config.trial_type === undefined || config.trial_type === '') {
        throw new Error (errors.noTrialType.concat(findFile(view)));
    }
};

function findFile(view) {
    return `

The problem is in ${view} view.`;
};