import { config as config_deploy, findNextView, submitResults } from "./babe-main.js";

const intro = {
    name: "intro",
    title: "Welcome!",
    text:
        "This is a template to showcase different means of recording behavioral data.",
    buttonText: "Begin experiment",
    render: function() {
        const viewTemplate = $("#intro-view").html();
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

        if (config_deploy.deployMethod !== "Prolific") {
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
            if (config_deploy.deployMethod === "Prolific") {
                _babe.global_data.prolific_id = prolificId.val().trim();
            }

            findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

const instructionsForcedChoice = {
    name: "instructionsForcedChoice",
    title: "Binary choice task with buttons",
    text:
        "We start with a forced-choice task with two options. Click on a labelled button to select an option.",
    buttonText: "Start binary choice task",
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
    trials: 1
};

const practiceForcedChoice = {
    name: "practiceForcedChoice",
    render: function(CT) {
        const viewTemplate = $("#trial-view-buttons-response").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.forcedChoice[CT].question,
                option1:
                    _babe.trial_info.practice_trials.forcedChoice[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.forcedChoice[CT].option2,
                picture:
                    _babe.trial_info.practice_trials.forcedChoice[CT].picture
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
                trial_type: "practiceForcedChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.forcedChoice[CT].question,
                option1:
                    _babe.trial_info.practice_trials.forcedChoice[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.forcedChoice[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainForcedChoice = {
    name: "mainForcedChoice",
    render: function(CT) {
        const viewTemplate = $("#trial-view-buttons-response").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.forcedChoice[CT].question,
                option1: _babe.trial_info.main_trials.forcedChoice[CT].option1,
                option2: _babe.trial_info.main_trials.forcedChoice[CT].option2,
                picture: _babe.trial_info.main_trials.forcedChoice[CT].picture
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
                trial_type: "mainForcedChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.forcedChoice[CT].question,
                option1: _babe.trial_info.main_trials.forcedChoice[CT].option1,
                option2: _babe.trial_info.main_trials.forcedChoice[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsSliderRating = {
    name: "instructionsSliderRating",
    title: "Slider rating task",
    text:
        "In the next part you will adjust sliders. You have to click or drag the slider button. Only if you do will a button appear that you need to click to proceed.",
    buttonText: "Start slider task",
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
    trials: 1
};

const practiceSliderRating = {
    name: "practiceSliderRating",
    render: function(CT) {
        const viewTemplate = $("#trial-view-slider-response").html();
        let response;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.sliderRating[CT].question,
                option1:
                    _babe.trial_info.practice_trials.sliderRating[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.sliderRating[CT].option2,
                picture:
                    _babe.trial_info.practice_trials.sliderRating[CT].picture
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
                trial_type: "practiceSliderRating",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.sliderRating[CT].question,
                option1:
                    _babe.trial_info.practice_trials.sliderRating[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.sliderRating[CT].option2,
                rating_slider: response.val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainSliderRating = {
    name: "mainSliderRating",
    render: function(CT) {
        const viewTemplate = $("#trial-view-slider-response").html();
        let response;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.sliderRating[CT].question,
                option1: _babe.trial_info.main_trials.sliderRating[CT].option1,
                option2: _babe.trial_info.main_trials.sliderRating[CT].option2,
                picture: _babe.trial_info.main_trials.sliderRating[CT].picture
            })
        );
        var startingTime = Date.now();
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
                trial_type: "mainSliderRating",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.sliderRating[CT].question,
                option1: _babe.trial_info.main_trials.sliderRating[CT].option1,
                option2: _babe.trial_info.main_trials.sliderRating[CT].option2,
                rating_slider: response.val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsTextboxInput = {
    name: "instructionsTextboxInput",
    title: "Textbox Input Task",
    text:
        "In this part, you will write a text in a textbox field. In order to proceed to the next slide, please provide at least 10 characters of text.",
    buttonText: "Start textbox input task",
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
    trials: 1
};

const practiceTextboxInput = {
    name: "practiceTextboxInput",
    render: function(CT) {
        const viewTemplate = $("#trial-view-textbox-input").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.textboxInput[CT].question,
                picture:
                    _babe.trial_info.practice_trials.textboxInput[CT].picture
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
            const RT = Date.now() - startingTime; // measure RT before anything else
            const trial_data = {
                trial_type: "practiceTextboxInput",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.textboxInput[CT].question,
                text_input: textInput.val().trim(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainTextboxInput = {
    name: "mainTextboxInput",
    render: function(CT) {
        const viewTemplate = $("#trial-view-textbox-input").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.textboxInput[CT].question,
                picture: _babe.trial_info.main_trials.textboxInput[CT].picture
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
                trial_type: "mainTextboxInput",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.textboxInput[CT].question,
                text_input: textInput.val().trim(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsDropdownChoice = {
    name: "instructionsDropdownChoice",
    title: "Drop-down menu selection",
    text:
        "Select an option from a drop-down menu. Only after your selection will a button appear that allows you to proceed.",
    buttonText: "Start dropdown task",
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
            _babe.findNextView();
        });
    },
    trials: 1
};

const practiceDropdownChoice = {
    name: "practiceDropdownChoice",
    render: function(CT) {
        const viewTemplate = $("#trial-view-dropdown-response").html();
        let response;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.dropdownChoice[CT].question,
                questionLeftPart:
                    _babe.trial_info.main_trials.dropdownChoice[CT]
                        .questionLeftPart,
                questionRightPart:
                    _babe.trial_info.main_trials.dropdownChoice[CT]
                        .questionRightPart,
                option1:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option1,
                option2:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option2,
                picture: _babe.trial_info.main_trials.dropdownChoice[CT].picture
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
                trial_type: "practiceDropdownChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.dropdownChoice[CT]
                        .question,
                option1:
                    _babe.trial_info.practice_trials.dropdownChoice[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.dropdownChoice[CT].option2,
                dropdown_choice: $(response).val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainDropdownChoice = {
    name: "mainDropdownChoice",
    render: function(CT) {
        const viewTemplate = $("#trial-view-dropdown-response").html();
        let response;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.dropdownChoice[CT].question,
                questionLeftPart:
                    _babe.trial_info.main_trials.dropdownChoice[CT]
                        .questionLeftPart,
                questionRightPart:
                    _babe.trial_info.main_trials.dropdownChoice[CT]
                        .questionRightPart,
                option1:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option1,
                option2:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option2,
                picture: _babe.trial_info.main_trials.dropdownChoice[CT].picture
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
                trial_type: "mainDropdownChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.dropdownChoice[CT].question,
                option1:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option1,
                option2:
                    _babe.trial_info.main_trials.dropdownChoice[CT].option2,
                dropdown_choice: $(response).val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsRatingScale = {
    name: "instructionsRatingScale",
    title: "Rating scale task",
    text:
        "Next you will select a degree from a rating scale. Just click on your prefered number from 1 to 7.",
    buttonText: "Start rating task",
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
    trials: 1
};

const practiceRatingScale = {
    name: "practiceRatingScale",
    render: function(CT) {
        const viewTemplate = $("#trial-view-rating-response").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.ratingScale[CT].question,
                option1:
                    _babe.trial_info.practice_trials.ratingScale[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.ratingScale[CT].option2,
                picture:
                    _babe.trial_info.practice_trials.ratingScale[CT].picture
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
                trial_type: "practiceRatingScale",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.ratingScale[CT].question,
                option1:
                    _babe.trial_info.practice_trials.ratingScale[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.ratingScale[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainRatingScale = {
    name: "mainRatingScale",
    render: function(CT) {
        const viewTemplate = $("#trial-view-rating-response").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question: _babe.trial_info.main_trials.ratingScale[CT].question,
                option1: _babe.trial_info.main_trials.ratingScale[CT].option1,
                option2: _babe.trial_info.main_trials.ratingScale[CT].option2,
                picture: _babe.trial_info.main_trials.ratingScale[CT].picture
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
                trial_type: "mainRatingScale",
                trial_number: CT + 1,
                question: _babe.trial_info.main_trials.ratingScale[CT].question,
                option1: _babe.trial_info.main_trials.ratingScale[CT].option1,
                option2: _babe.trial_info.main_trials.ratingScale[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsSentenceChoice = {
    namе: "instructionsSentenceChoice",
    title: "Sentence selection task",
    text: "Next you will select a sentence from a set of given sentences.",
    buttonText: "Start sentence selection task",
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
    trials: 1
};

const practiceSentenceChoice = {
    name: "practiceSentenceChoice",
    render: function(CT) {
        var viewTemplate = $("#trial-view-sentence-choice").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.sentenceChoice[CT]
                        .question,
                option1:
                    _babe.trial_info.practice_trials.sentenceChoice[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.sentenceChoice[CT].option2,
                picture:
                    _babe.trial_info.practice_trials.sentenceChoice[CT].picture
            })
        );
        const startingTime = Date.now();

        $("input[name=answer]").on("change", function() {
            const RT = Date.now() - startingTime; // measure RT before anything else
            const trial_data = {
                trial_type: "practiceSentenceChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.sentenceChoice[CT]
                        .question,
                option1:
                    _babe.trial_info.practice_trials.sentenceChoice[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.sentenceChoice[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainSentenceChoice = {
    name: "mainSentenceChoice",
    render: function(CT) {
        var viewTemplate = $("#trial-view-sentence-choice").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.sentenceChoice[CT].question,
                option1:
                    _babe.trial_info.main_trials.sentenceChoice[CT].option1,
                option2:
                    _babe.trial_info.main_trials.sentenceChoice[CT].option2,
                picture: _babe.trial_info.main_trials.sentenceChoice[CT].picture
            })
        );
        var startingTime = Date.now();

        $("input[name=answer]").on("change", function() {
            var RT = Date.now() - startingTime; // measure RT before anything else
            var trial_data = {
                trial_type: "mainSentenceChoice",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.sentenceChoice[CT].question,
                option1:
                    _babe.trial_info.main_trials.sentenceChoice[CT].option1,
                option2:
                    _babe.trial_info.main_trials.sentenceChoice[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsImageSelection = {
    name: "instructionsImageSelection",
    title: "Image selection task",
    text: "Just click on a picture.",
    buttonText: "Start image selection task",
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
    trials: 1
};

const practiceImageSelection = {
    name: "practiceImageSelection",
    render: function(CT) {
        const viewTemplate = $("#trial-view-image-selection").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.imageSelection[CT]
                        .question,
                option1:
                    _babe.trial_info.practice_trials.imageSelection[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.imageSelection[CT].option2,
                picture1:
                    _babe.trial_info.practice_trials.imageSelection[CT]
                        .picture1,
                picture2:
                    _babe.trial_info.practice_trials.imageSelection[CT].picture2
            })
        );
        const startingTime = Date.now();

        $("input[name=answer]").on("change", function() {
            const RT = Date.now() - startingTime; // measure RT before anything else
            const trial_data = {
                trial_type: "practiceImageSelection",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.practice_trials.imageSelection[CT]
                        .question,
                option1:
                    _babe.trial_info.practice_trials.imageSelection[CT].option1,
                option2:
                    _babe.trial_info.practice_trials.imageSelection[CT].option2,
                picture1:
                    _babe.trial_info.practice_trials.imageSelection[CT]
                        .picture1,
                picture2:
                    _babe.trial_info.practice_trials.imageSelection[CT]
                        .picture2,
                image_selected: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const mainImageSelection = {
    name: "mainImageSelection",
    render: function(CT) {
        const viewTemplate = $("#trial-view-image-selection").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.main_trials.imageSelection[CT].question,
                option1:
                    _babe.trial_info.main_trials.imageSelection[CT].option1,
                option2:
                    _babe.trial_info.main_trials.imageSelection[CT].option2,
                picture1:
                    _babe.trial_info.main_trials.imageSelection[CT].picture1,
                picture2:
                    _babe.trial_info.main_trials.imageSelection[CT].picture2
            })
        );
        const startingTime = Date.now();

        $("input[name=answer]").on("change", function() {
            const RT = Date.now() - startingTime; // measure RT before anything else
            const trial_data = {
                trial_type: "mainImageSelection",
                trial_number: CT + 1,
                question:
                    _babe.trial_info.main_trials.imageSelection[CT].question,
                option1:
                    _babe.trial_info.main_trials.imageSelection[CT].option1,
                option2:
                    _babe.trial_info.main_trials.imageSelection[CT].option2,
                picture1:
                    _babe.trial_info.main_trials.imageSelection[CT].picture1,
                picture2:
                    _babe.trial_info.main_trials.imageSelection[CT].picture2,
                image_selected: $("input[name=answer]:checked").val(),
                RT: RT
            };
            _babe.trial_data.push(trial_data);
            findNextView();
        });
    },
    trials: 2
};

const instructionsKeyPress = {
    name: "instructionsKeyPress",
    title: "Binary choice with keys",
    text:
        "Make a binary choice by pressing keys 'f' or 'j'. Good method for reaction time measurements.",
    buttonText: "Start key press task",
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
    trials: 1
};

const practiceKeyPress = {
    name: "practiceKeyPress",
    render: function(CT) {
        const viewTemplate = $("#trial-view-key-press").html();
        const key1 = _babe.trial_info.practice_trials.keyPress[CT].key1;
        const key2 = _babe.trial_info.practice_trials.keyPress[CT].key2;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question:
                    _babe.trial_info.practice_trials.keyPress[CT].question,
                picture: _babe.trial_info.practice_trials.keyPress[CT].picture,
                key1: key1,
                key2: key2,
                value1: _babe.trial_info.practice_trials.keyPress[CT][key1],
                value2: _babe.trial_info.practice_trials.keyPress[CT][key2]
            })
        );
        const startingTime = Date.now();

        function handleKeyPress(e) {
            const keyPressed = String.fromCharCode(e.which).toLowerCase();

            if (keyPressed === key1 || keyPressed === key2) {
                let correctness;
                const RT = Date.now() - startingTime; // measure RT before anything else

                if (
                    _babe.trial_info.practice_trials.keyPress[CT].expected ===
                    _babe.trial_info.practice_trials.keyPress[CT][
                        keyPressed.toLowerCase()
                    ]
                ) {
                    correctness = "correct";
                } else {
                    correctness = "incorrect";
                }

                const trial_data = {
                    trial_type: "practiceKeyPress",
                    trial_number: CT + 1,
                    question:
                        _babe.trial_info.practice_trials.keyPress[CT].question,
                    expected:
                        _babe.trial_info.practie_trials.keyPress[CT].expected,
                    key_pressed: keyPressed,
                    correctness: correctness,
                    RT: RT
                };

                trial_data["key1"] =
                    _babe.trial_info.practice_trials.keyPress[CT][key1];
                trial_data["key2"] =
                    _babe.trial_info.practice_trials.keyPress[CT][key2];

                // question or/and picture are optional
                if (
                    _babe.trial_info.main_trials.keyPress[CT].picture !==
                    undefined
                ) {
                    trial_data["picture"] =
                        _babe.trial_info.practice_trials.keyPress[CT].picture;
                }

                if (
                    _babe.trial_info.main_trials.keyPress[CT].question !==
                    undefined
                ) {
                    trial_data["question"] =
                        _babe.trial_info.practice_trials.keyPress[CT].question;
                }

                _babe.trial_data.push(trial_data);
                $("body").off("keydown", handleKeyPress);
                findNextView();
            }
        }

        $("body").on("keydown", handleKeyPress);
    },
    trials: 3
};

const mainKeyPress = {
    name: "mainKeyPress",
    render: function(CT) {
        const viewTemplate = $("#trial-view-key-press").html();
        const key1 = _babe.trial_info.main_trials.keyPress[CT].key1;
        const key2 = _babe.trial_info.main_trials.keyPress[CT].key2;
        $("#main").html(
            Mustache.render(viewTemplate, {
                question: _babe.trial_info.main_trials.keyPress[CT].question,
                picture: _babe.trial_info.main_trials.keyPress[CT].picture,
                key1: key1,
                key2: key2,
                value1: _babe.trial_info.main_trials.keyPress[CT][key1],
                value2: _babe.trial_info.main_trials.keyPress[CT][key2]
            })
        );
        const startingTime = Date.now();

        function handleKeyPress(e) {
            const keyPressed = String.fromCharCode(e.which).toLowerCase();

            if (keyPressed === key1 || keyPressed === key2) {
                let correctness;
                const RT = Date.now() - startingTime; // measure RT before anything else

                if (
                    _babe.trial_info.main_trials.keyPress[CT].expected ===
                    _babe.trial_info.main_trials.keyPress[CT][
                        keyPressed.toLowerCase()
                    ]
                ) {
                    correctness = "correct";
                } else {
                    correctness = "incorrect";
                }

                const trial_data = {
                    trial_type: "mainKeyPress",
                    trial_number: CT + 1,
                    question:
                        _babe.trial_info.main_trials.keyPress[CT].question,
                    expected:
                        _babe.trial_info.main_trials.keyPress[CT].expected,
                    key_pressed: keyPressed,
                    correctness: correctness,
                    RT: RT
                };

                trial_data["key1"] =
                    _babe.trial_info.main_trials.keyPress[CT][key1];
                trial_data["key2"] =
                    _babe.trial_info.main_trials.keyPress[CT][key2];

                // question or/and picture are optional
                if (
                    _babe.trial_info.main_trials.keyPress[CT].picture !==
                    undefined
                ) {
                    trial_data["picture"] =
                        _babe.trial_info.main_trials.keyPress[CT].picture;
                }

                if (
                    _babe.trial_info.main_trials.keyPress[CT].question !==
                    undefined
                ) {
                    trial_data["question"] =
                        _babe.trial_info.main_trials.keyPress[CT].question;
                }

                _babe.trial_data.push(trial_data);
                $("body").off("keydown", handleKeyPress);
                findNextView();
            }
        }

        $("body").on("keydown", handleKeyPress);
    },
    trials: 3
};

const postTest = {
    name: "postTest",
    title: "Additional Info",
    text:
        "Answering the following questions is optional, but will help us understand your answers.",
    buttonText: "Continue",
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
    trials: 1
};

const thanks = {
    name: "thanks",
    message: "Thank you for taking part in this experiment!",
    render: function() {
        var viewTemplate = $("#thanks-view").html();

        // what is seen on the screen depends on the used deploy method
        //    normally, you do not need to modify this
        if (
            config_deploy.is_MTurk ||
            config_deploy.deployMethod === "directLink"
        ) {
            // updates the fields in the hidden form with info for the MTurk's server
            $("#main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message
                })
            );
        } else if (config_deploy.deployMethod === "Prolific") {
            $("main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message,
                    extraMessage: "Please press the button below to confirm that you completed the experiment with Prolific<br />".concat(
                        "<a href=",
                        config_deploy.prolificURL,
                        ' class="prolific-url">Confirm</a>'
                    )
                })
            );
        } else if (config_deploy.deployMethod === "debug") {
            $("main").html(Mustache.render(viewTemplate, {}));
        } else {
            console.log("no such config_deploy.deployMethod");
        }

        submitResults();
    },
    trials: 1
};

export {
    intro,
    instructionsForcedChoice,
    practiceForcedChoice,
    mainForcedChoice,
    instructionsTextboxInput,
    practiceTextboxInput,
    mainTextboxInput,
    instructionsSliderRating,
    practiceSliderRating,
    mainSliderRating,
    instructionsDropdownChoice,
    practiceDropdownChoice,
    mainDropdownChoice,
    instructionsRatingScale,
    practiceRatingScale,
    mainRatingScale,
    instructionsSentenceChoice,
    practiceSentenceChoice,
    mainSentenceChoice,
    instructionsImageSelection,
    practiceImageSelection,
    mainImageSelection,
    instructionsKeyPress,
    practiceKeyPress,
    mainKeyPress,
    postTest,
    thanks
};
