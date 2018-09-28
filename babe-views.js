import { findNextView, submitResults } from "./babe-main.js";
import {_babe} from "./babe-init.js";

function _intro(config) {
    const _intro = {
        name: "intro",
        title: config.title,
        text: config.text,
        buttonText: config.buttonText,
        render: function() {
            const viewTemplate = $(
                "#intro-view"
            ).html();

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

                findNextView();
            });
        },
        CT: 0,
        // for how many trials should this view be repeated?
        trials: config.trials
    };

    return _intro;
};

function _instructions(config) {
    const _instructions = {
        name: "instructions",
        title: config.title,
        text: config.text,
        buttonText: config.buttonText,
        render: function() {
            const viewTemplate = $("#instructions-view").html();
            $("#main").html(
                Mustache.render(viewTemplate, {
                    title: this.title,
                    text: this.text,
                    button: this.buttonText
                })
            );

            // moves to the next view
            $("#next").on("click", function() {
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _instructions;
};

function _begin(config) {
    const _begin = {
        name: 'beginMainExp',
        "text": config.text,
        // render function renders the view
        render: function () {
            const viewTemplate = $('#begin-exp-view').html();
            $('#main').html(Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text
            }));

            // moves to the next view
            $('#next').on('click', function (e) {
                findNextView();
            });

        },
        CT: 0,
        trials: config.trials
    };

    return _begin;
};

function _forcedChoice(config) {
    const _forcedChoice = {
        name: "forcedChoice",
        render: function(CT) {
            const viewTemplate = $("#trial-view-buttons-response").html();
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
                        config.data.option2,
                    option_chosen: $("input[name=answer]:checked").val(),
                    RT: RT
                };
                _babe.trial_data.push(trial_data);
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _forcedChoice;
};

function _sliderRating(config) {
    const _sliderRating = {
        name: "slider_rating",
        render: function(CT) {
            const viewTemplate = $("#trial-view-slider-response").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _sliderRating;
};

function _textboxInput(config) {
    const _textboxInput = {
        name: "textboxInput",
        render: function(CT) {
            const viewTemplate = $("#trial-view-textbox-input").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _textboxInput;
};

function _dropdownChoice(config) {
    const _dropdownChoice = {
        name: "dropdownChoice",
        render: function(CT) {
            const viewTemplate = $("#trial-view-dropdown-response").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _dropdownChoice;
};

function _ratingScale(config) {
    const _mainRatingScale = {
        name: "ratingScale",
        render: function(CT) {
            const viewTemplate = $("#trial-view-rating-response").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _ratingScale;
};

function _sentenceChoice(config) {
    const _sentenceChoice = {
        name: "sentenceChoice",
        render: function(CT) {
            var viewTemplate = $("#trial-view-sentence-choice").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _sentenceChoice;
};

function _imageSelection(config) {
    const _imageSelection = {
        name: "mainImageSelection",
        render: function(CT) {
            const viewTemplate = $("#trial-view-image-selection").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };
 
    return _imageSelection;   
};

function _keyPress(config) {
    const _keyPress = {
        name: "mainKeyPress",
        render: function(CT) {
            const viewTemplate = $("#trial-view-key-press").html();
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
                    findNextView();
                }
            }

            $("body").on("keydown", handleKeyPress);
        },
        CT: 0,
        trials: config.trials
    };

    return _keyPress;
}

function _postTest(config) {
    const _postTest = {
        name: "postTest",
        title: config.title,
        text: config.text,
        buttonText: config.buttonText,
        render: function() {
            const viewTemplate = $("#post-test-view").html();
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
                findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _postTest;
};

function _thanks(config) {
    const _thanks = {
        name: "thanks",
        message: config.title,
        render: function() {
            var viewTemplate = $("#thanks-view").html();

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

            submitResults();
        },
        CT: 0,
        trials: 1
    };
    
    return _thanks;
};

export {
    _intro,
    _instructions,
    _begin,
    _forcedChoice,
    _sliderRating,
    _textboxInput,
    _dropdownChoice,
    _ratingScale,
    _sentenceChoice,
    _imageSelection,
    _keyPress,
    _postTest,
    _thanks
};
