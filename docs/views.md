# \_magpie views

**Table of contents**

* [List of the available \_magpie views](#magpie-views)
* [Properties of \_magpie's Trial Type Views](#trial-views-properties)
* [Properties of \_magpie's Wraping views Type Views](#wrapping-views-properties)
* [Trial views' lifecycle](#trial-views-lifecycle)
* [Trial views' hooks](#trial-views-hooks)
* [Trial views data format](#trial-views-data-format)
    * [Forced-choice data format](#forced-choice-task)
    * [Textbox Input data format](#textbox-input-task)
    * [Slider Rating data format](#slider-rating-task)
    * [Dropdown choice data format](#dropdown-choice-task)
    * [Rating scale data format](#rating-scale-task)
    * [Sentence choice data format](#sentence-choice-task)
    * [Image selection data format](#image-selection-task)
    * [Key press data format](#key-press-task)
    * [Self-paced reading with forced choice response data format](#self-paced-reading-with-forced-choice-response)
    * [Self-paced reading with slider rating response data format](#self-paced-reading-with-rating-scale-response)
* [Sample use of \_magpie views](#sample-use-of-_magpie-views)

## Views \_magpie provide

### Trial views

* magpieViews.forcedChoice
    * [image of the view](images/views_samples/view_fc.png)
* magpieViews.sliderRating
    * [image of the view](images/views_samples/view_sr.png)
* magpieViews.dropdownChoice
    * [image of the view](images/views_samples/view_dc.png)
* magpieViews.textboxInput
    * [image of the view](images/views_samples/view_ti.png)
* magpieViews.ratingScale
    * [image of the view](images/views_samples/view_rc.png)
* magpieViews.imageSelection
    * [image of the view](images/views_samples/view_is.png)
* magpieViews.sentenceChoice
    * [image of the view](images/views_samples/view_ss.png)
* magpieViews.keyPress
    * [image of the view](images/views_samples/view_kp.png)
* magpieViews.selfPacedReading
* magpieViews.selfPacedReading_ratingScale

### Wrapping views

* magpieViews.intro
    * gives general information about the experiment
    * records the participant's prolific id if the experiment runs on [Prolific](prolific.ac)
* magpieViews.instructions
    * gives experiment-specific instructions
* magpieViews.begin
    * warns the participant the experiment is about to begin
    * can be used between the practice trial and the main trial
* magpieViews.postTest
    * collects extra information about the participant (age, gender, etc.)
* magpieViews.thanks (and submit the data)
    * Debug mode: displays the data
    * submits the data of the live experiments

## Trial views' properties

### **Obligatory fields**
* `trials: int` - the number of trials this view will appear
* `name: string`
* `trial_type: string` - the name of the trial type as you want it to appear in the submitted the final data (for example 'main binary choice')
* `data: array` - an array of trial objects

### **Optional fields (can be skipped)**
* `title: string` - the title at the top of the view 
* `pause: number (in ms)` - blank screen before the fixation point or stimulus show
* `fix_duration: number (in ms)` - blank screen with fixation point in the middle
* `stim_duration: number (in ms)` - for how long to have the stimulus on the screen
* `hook: object` - option to hook and add custom functions to the view. [more about hooks](hooks.md)

## Wrapping views' properties

### **Obligatory fields**
* `trials: int` - the number of trials this view will appear
* `name: string`

### **Optional fields by view type**:
* magpieViews.intro:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Welcome!'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* magpieViews.instructions:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Instructions'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* magpieViews.begin:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Begin'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* magpieViews.postTest:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Additional Information'
    * `text: string`
        * the text of the view
        * default: *there is no default*
    * `age_question: string`
        * question about participant's age
        * default: 'Age',
    * `gender_question: string`
        * question about participant's gender
        * default: 'Gender'
    * `gender_male: string`
        * answer option for the gender question
        * default: 'male'
    * `gender_female: string`
        * answer option for the gender question
        * default: 'female'
    * `gender_other: string`
        * answer option for the gender question
        * default: 'other'
    * `edu_question: string`
        * question about participant's level of education
        * default: 'Level of Education'
    * `edu_graduated_high_school: string`
        * answer option for the education question
        * default: 'Graduated High School'
    * `edu_graduated_college: string`
        * answer option for the education question
        * default: 'Graduated College'
    * `edu_higher_degree: string`
        * answer option for the education question
        * default: 'Higher Degree'
    * `languages_question: string`
        * question about participant's native languages
        * default: 'Native Languages'
    * `languages_more: string`
        * more info about what native languages are
        * default: '(i.e. the language(s) spoken at home when you were a child)'

* magpieViews.thanks:
    * `title: string`
        * the title of the view
        * default: 'Thank you for taking part in this experiment!'
    * `prolificConfirmText: string`
        * text asking the participant to press the 'confirm' button
        * default: 'Please press the button below to confirm that you completed the experiment with Prolific'

## Trial views lifecycle

All the trial views go through 4 steps.

1. pause step - blank screen

    * enable by passing `pause: number (in miliseconds)` (will show a pause for after number amount of time)
    * shows nothing but a blank screen and the `QUD` if there is such

2. fixation point step - a cross in the middle where the stimulus appears

    * passed to the trial view as `fix_duration: number (in miliseconds)`
    * shows a cross in the middle of the stimulus and the `QUD` if there is such

3. stimulus shown step - stimulus appears

3.5 (optional) stimulus hidden step - hides the stimulus from the screen
    * hide the stimulus after certain amount of time by passing `stim_duration: number (in miliseconds)` to the view creation
    * hide the stimulus when SPACE gets pressed with `stim_duration: 'space'`
    * skip this step by not defining `stim_duration`

4. interactions are enabled - the participant can interact with the view (respond, read the sentence etc.)

The views you created do not need to use these timeouts, however, each trial view still goes through these steps on the background and you can still [hook](#trial-view-hooks) and call locally defined functions

## Trial views hooks

You can create functions in your local js files and hook these functions to the trial view. To understand how hooks work, first learn about magpie's [trial views lifecycle](#trial-views-lifecycle)

**Hooks**

* after the pause is finished
    enable with `hook.after_pause: _function_`

* after the fixation point hides
    enable with `hook.after_fin_point: _function_`

* after the stimulus is shown
    enable with `hook.after_stim_shown: _function_`

* after the stimulus hides
    enable with `hook.after_stim_hidden: _function_`

* after the interactions are enabled
    enable with `hook.after_response_enabled: _function_`


Your custom functions get the trial `data` for each trial view and `next` as arguments. You can use the `data` if you need to. To proceed to the next step of the lifecycle, you have to call `next()`

**Full lifecycle - hook sample**

1. pause shows
2. pause finishes
3. after_pause function called
4. fixation point shows
5. fixation point disappears
6. after_fix_point function called
7. stimulus shows
8. after_stim_shown function called
9. stimlus hides
10. after_stim_hidden function called
11. response is enabled
12. after_response_enabled function called

**Real example**

Imagine you want to tell the participants whether their repsonse was correct while they are getting familiar with the experiment, for example in the practice trial view. To do that you need to get the answer they chose and check it for correctness. You can define a funciton that gets their response and hook to the trial view after the response is enabled. In the example below, assume that `option1` is always the correct answer.


```
// compares the chosen answer to the value of `option1`
function checkResponse(data, next) {
    $('input[name=answer]').on('change', function(e) {
        if (e.target.value === data.option1) {
            alert('Your answer is correct! Yey!');
        } else {
            alert('Sorry, this answer is incorrect :(');
        }
        next();
    })
}
```

and add a `after_response_enabled` hook to the view:

```
const practice = magpieViews.forcedChoice({
    trials: 20,
    name: 'practice',
    trial_type: 'practice',
    data: practice_trials.forcedChoice,
    fix_duration: 500,
    pause: 500,
    hook: {
        after_response_enabled: checkResponse
    }
});
```

## Trial views' data format

### Forced-choice task

[image of the view](images/views_samples/view_fc.png)

#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `question: string`
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`

#### Sample data

```
const forced_choice_trials = [
    {
        picture: "path/to/picture_of_bread.jpg",
        question: "What's on the bread?",
        option1: "jam",
        option2: "ham"
    },
    {
        question: "What's the weather?",
        option1: "shiny",
        option2: "rainbow"
    }
];
```

### Textbox Input task

[image of the view](images/views_samples/view_ti.png)

#### Data properties

* **Obligatory Fileds**
    * `question: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`
    * `min_chars: number`
        * the minumum number of characters in the textarea field before proceeding is available
        * default - *10*

#### Sample data

```
const textbox_input_trials = [
    {
        picture: "path/to/picture.jpg",
        question: "What's on the bread?",
        min_chars: 100
    },
    {
        question: "What's the weather?",
        min_chars: 50
    }
];
```

### Slider Rating task

[image of the view](images/views_samples/view_sr.png)

#### Data properties

* **Obligatory Fileds**
    * `optionLeft: string`
    * `optionRight: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`
    * `question: string`

#### Sample data

```
const slider_rating_trials = [
    {
        picture: 'path/to/picture_of_bread.jpg',
        question: "What's on the bread?",
        optionLeft: 'jam',
        optionRight: 'ham'
    },
    {
        question: "What's the weather?",
        optionLeft: 'shiny',
        optionRight: 'rainbow'
    }
];
```

### Dropdown Choice task

[image of the view](images/views_samples/view_dc.png)


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`
    * `question_left_part: string`
    * `question_right_part: string`

#### Sample data

```
const dropdown_choice_trials = [
    {
        picture: 'path/to/picture_of_bread.jpg',
        question: "What's on the bread?",
        option1: 'jam',
        option2: 'ham'
    },
    {
        question: "What's the weather?",
        option1: 'shiny',
        option2: 'rainbow'
    }
];
```

### Rating Scale task

[image of the view](images/views_samples/view_rc.png)

#### Data properties

* **Obligatory Fileds**
    * `optionLeft: string`
    * `optionRight: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`
    * `question: string`

#### Sample data

```
const rating_scale_trials = [
    {
        picture: 'path/to/picture_of_bread.jpg',
        question: 'What\'s on the bread?',
        option1: 'jam',
        option2: 'ham'
    },
    {
        question: "What's the weather?",
        option1: 'shiny',
        option2: 'rainbow'
    }
];
```

### Sentence Choice task

[image of the view](images/views_samples/view_ss.png)


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `picture: string (link)`
    * `question: string`

#### Sample data

```
const sentence_choice_trials = [
    {
        picture: 'path/to/picture_of_bread.jpg',
        question: "What's on the bread?",
        option1: 'jam',
        option2: 'ham'
    },
    {
        picture: 'path/to/picture_of_bread.jpg',
        option1: 'jam',
        option2: 'ham'
    },
    {
        question: "What's the weather?",
        option1: 'shiny',
        option2: 'rainbow'
    }
];
```

### Image Selection task

[image of the view](images/views_samples/view_is.png)


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`
    * `picture1: string (link)` - refers to `option1`
    * `picture2: string (link)` - refers to `option2`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `question: string`
    * `canvas: object` [more about magpie canvas](canvas.md)

#### Sample data

```
const image_selection_trials = [
    {
        picture1: 'path/to/picture1.jpg',
        picture2: 'path/to/picture2.jpg',
        option1: 'yes',
        option2: 'no'
    },
    {
        picture1: 'path/to/picture_of_bread1.jpg',
        picture2: 'path/to/picture_of_bread2.jpg',
        question: "What's on the bread?",
        option1: 'jam',
        option2: 'ham'
    }
];
```

### Key Press task

[image of the view](images/views_samples/view_kp.png)


#### Data properties

* **Obligatory Fileds**
    * `key1: string`
    * `key2: string`
    * `<key-specified in key1, e.g. f>: string`
    * `<key specified in key2, e.g. j>: string`
    * `expected: string`

* **Optional Fields**
    * `question: string`
    * `picture: string (link)`
    * `canvas: object` [more about magpie canvas](canvas.md)

#### Sample data

```
const key_press_trials = [
    {
        question: "What's the weather like?",
        key1: 'f',
        key2: 'j',
        f: 'shiny',
        j: 'rainbow',
        expected: 'shiny'
    },
    {
        question: "What's on the bread?",
        picture: 'path/to/picture.jpg',
        key1: 'f',
        key2: 'j',
        f: 'ham',
        j: 'jam',
        expected: 'jam'
    }
];
```

### Self-paced reading with forced choice response

#### Data properties

* **Obligatory Fileds**
    * `sentence: string`
        * the spr parts are separated by ' | '
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `help_text: string`
        * instructions to press SPACE above the spr sentence lines
        * default - *Press the SPACE bar to reveal the words*
    * `picture: string`
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `question: string`

#### Sample data

```
const spr_trials = [
    {
        QUD: "Johnny says: 'I want you to bring me the box where ...",
        picture: "images/all-false3.png"
        help_text: 'just press SPACE',
        question: "Should you bring Johnny this box or not?",
        sentence: "all | of | the | yellow | marbles | are | inside | the | case.'",
        option1: "Bring it",
        option2: "Leave it",
    },
    {
        question: "Should you bring Johnny this box or not?",
        sentence: "some | of the | black marbles | are | inside | the case.'",
        option1: "Bring it",
        option2: "Leave it"
    }
];
```

### Self-paced reading task with rating scale response

#### Data properties

* **Obligatory Fileds**
    * `sentence: string`
        * the spr parts are separated by ' | '
    * `optionLeft: string`
    * `optionRight: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `help_text: string` - SPACE press text above the spr sentence
    * `picture: string`
    * `canvas: object` [more about magpie canvas](canvas.md)
    * `question: string`

#### Sample data

```
const spr_rc_trials = [
    {
        QUD: "Johnny says: 'I want you to bring me the box where ...",
        picture: "images/all-false3.png"
        help_text: 'SPACEEEE',
        sentence: "all | of the | yellow marbles | are | inside | the case.'",
        question: "Should you bring Johnny this box or not?",
        optionLeft: "Bring it",
        optionRight: "Leave it",
    },
    {
        question: "Should you bring Johnny this box or not?",
        sentence: "some | of the | black marbles | are | inside | the case.'",
        optionLeft: "Bring it",
        optionRight: "Leave it"
    }
];
```

## Sample use of \_magpie views

Sample use of \_magpie views:

```
// your_js_file.js

const intro = magpieViews.intro({
    name: 'intro',
    title: 'Welcome!',
    text: "Let's start!",
    buttonText: 'Begin the experiment',
    trials: 1
});

const instructions = magpieViews.instructions({
    name: 'instuctions',
    title: 'Instructions',
    text: 'Choose an answer',
    buttonText: 'Next',
    trials: 1
});

const practice = magpieViews.forcedChoice({
    name: 'practice_forced_choice',
    trial_type: 'practice',
    data: practice_trials,
    trials: 2
});

const main = magpieViews.forcedChoice({
    name: 'main_forced_choice',
    trial_type: 'main',
    data: main_trials,
    trials: 4
});

const thanks = magpieViews.thanks({
    name: 'thanks'
    title: 'Thank you for taking part in this experiment!',
    trials: 1
});

$("document").ready(function() {
    magpieInit({
        views_seq: [
            intro,
            instructions,
            main,
            thanks
        ],
        deploy: {
            'experimentID': '4',
            'serverAppURL': 'https://magpie-demo.herokuapp.com/api/submit_experiment/',
            'deployMethod': 'debug',
            'contact_email": 'YOUREMAIL@wherelifeisgreat.you',
            'prolificURL": 'https://app.prolific.ac/submissions/complete?cc=ABCD1234'

        },
        progress_bar: {
            in: [
                'practice_forced_choice',
                'main_forced_choice'
            ],
            style: 'default',
            width: 100
        }
    });
});
```
