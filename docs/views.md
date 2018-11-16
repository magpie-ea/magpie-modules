# \_babe views

## Properties

### Trial type views
* babeViews.forcedChoice
* babeViews.sliderRating
* babeViews.dropdownChoice
* babeViews.textboxInput
* babeViews.ratingScale
* babeViews.imageSelection
* babeViews.sentenceChoice
* babeViews.keyPress
* babeViews.selfPacedReading
* babeViews.selfPacedReading_ratingScale

#### **Obligatory Fields**
* `trials: int` - the number of trials this view will appear
* `name: string`
* `trial_type: string` - the name of the trial type as you want it to appear in the submitted the final data (for example 'main binary choice')
* `data: array` - an array of trial objects

#### **Optional Fields (can be skipped)**
* `pause: number (in ms)` - blank screen before the fixation point or stimulus show
* `fix_duration: number (in ms)` - blank screen with fixation point in the middle
* `stim_duration: number (in ms)` - for how long to have the stimulus on the screen
* `custom_events: object` - option to add custom events to the view. [more about custom events](custom_events.md)

### Other views
* babeViews.intro
* babeViews.instructions
* babeViews.begin
* babeViews.postTest
* babeViews.thanks (and submit the data)

#### **Obligatory Fields**
* `trials: int` - the number of trials this view will appear
* `name: string`

#### Optional Fields:
* babeViews.intro:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Welcome!'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* babeViews.instructions:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Instructions'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* babeViews.begin:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Begin'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* babeViews.postTest:
    * `buttonText: string`
        * the text of the button that takes the participant to the next view
        * default: 'Next'
    * `title: string`
        * the title of the view
        * default: 'Additional Information'
    * `text: string`
        * the text of the view
        * default: *there is no default*

* babeViews.thanks:
    * `title: string`
        * the title of the view
        * default: 'Thank you for taking part in this experiment!'
    * `prolificConfirmText: string`
        * text asking the participant to press the 'confirm' button
        * default: 'Please press the button below to confirm that you completed the experiment with Prolific'

## Trial Data Format

### Forced-choice (binary choice) task

<img src='images/views_samples/view_fc.png' alt='view sample' height='auto' width='500' />

#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `question: string`
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_ti.png' alt='view sample' height='auto' width='500' />

#### Data properties

* **Obligatory Fileds**
    * `question: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_sr.png' alt='view sample' height='auto' width='500' />

#### Data properties

* **Obligatory Fileds**
    * `optionLeft: string`
    * `optionRight: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_dc.png' alt='view sample' height='auto' width='500' />


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_rc.png' alt='view sample' height='auto' width='500' />

#### Data properties

* **Obligatory Fileds**
    * `optionLeft: string`
    * `optionRight: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_ss.png' alt='view sample' height='auto' width='500' />


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `canvas: object` [more about babe canvas](canvas.md)
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

<img src='images/views_samples/view_is.png' alt='view sample' height='auto' width='500' />


#### Data properties

* **Obligatory Fileds**
    * `option1: string`
    * `option2: string`
    * `picture1: string (link)` - refers to `option1`
    * `picture2: string (link)` - refers to `option2`

* **Optional Fields**
    * `QUD: string` - text that is always present on the slide
    * `question: string`
    * `canvas: object` [more about babe canvas](canvas.md)

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

<img src='images/views_samples/view_kp.png' alt='view sample' height='auto' width='500' />


#### Data properties

* **Obligatory Fileds**
    * `key1: string`
    * `key2: string`
    * `f: string`
    * `j: string`
    * `expected: string`

* **Optional Fields**
    * `question: string`
    * `picture: string (link)`
    * `canvas: object` [more about babe canvas](canvas.md)

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

### Self-paced reading wirh forced choice response buttons

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
    * `canvas: object` [more about babe canvas](canvas.md)
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
    * `canvas: object` [more about babe canvas](canvas.md)
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