# \_babe project
basic architecture for browser-based experiments

## Installation
#### Install with npm (recommended)

You need npm installed on your machine. Here is more information on how to [install npm](https://www.npmjs.com/get-npm)

If you have npm installed, run the following command from your experiment's directory

`npm install babe-project --save`

#### Download the package
Alternatively you can get the package by cloning the repo in your experiment's directory (?)

## Usage

### \_babe Initialisation

To initialise the experiment import the babe `babeInit` function in `your_js_file.js`.
    
```
// your_js_file.js

import { babeInit } from './link_to_your_libraries/babe-project/babe-init.js';

...
...
...
```

`babeInit` takes an object as a parameter with the following properties:

* `views_seq` - a list of view objects in the sequence you want the to appear in your experiment
* `deploy` - an object with information about the deploy methods of your experiment 
* `progress_bar` - an object with information about the progress bars in the views of your experiment


Sample `babeInit` call:

```
import { babeInit } from './link_to_your_libraries/babe-project/babe-init.js';

$("document").ready(function() {
    babeInit({
        views_seq: [
            intro,
            instructions,
            practice,
            main,
            thanks
        ],
        deploy: {
            "experimentID": "4",
            "serverAppURL": "https://babe-demo.herokuapp.com/api/submit_experiment/",
            "deployMethod": "debug",
            "contact_email": "YOUREMAIL@wherelifeisgreat.you",
            "prolificURL": "https://app.prolific.ac/submissions/complete?cc=ABCD1234" 
        },
        progress_bar: {
            in: [
                "practice",
                "main"
            ],
            style: "default",
            width: 150
        }
    });
});
 ```

### Views in \_babe

For \_babe views to render, you need to have an html tag (preferrably `div` or `main`)
with `id="main"`


#### \_babe's ready-made views

\_babe provides several ready-made views which you can use by importing them in `your_js_file.js`.

* trial type views:
    * `forcedChoice` - [binary forced-choice task](docs/views.md#forced-choice-binary-choice-task)
    * `sliderRating` - [slider rating task](docs/views.md#slider-rating-task)
    * `textboxInput` [textbox input task](docs/views.md#textbox-input-task)
    * `dropdownMenu` - [dropdown menu task](docs/views.md#dropdown-choice-task)
    * `ratingScale` - [Likert-scale rating task](docs/views.md#rating-scale-task)
    * `sentenceSelection` - [text selection task](docs/views.md#sentence-selection_task)
    * `imageSelection` - [click-on-a-picture task](docs/views.md#image-selection-task)
    * `keyPress`- press a [button task](docs/views.md#key-press-task)

* other views:
    * `intro`  - introduction view 
    * `instructions`-  instructions view
    * `begin` - begin experiment view; can be used between the practice and the main view
    * `postTest` - post-experiment questionnaire
    * `thanks` - the last view that handles the submission of the results of creates a table with the results in 'Debug Mode'


Each \_babe view function takes an object as a parameter with the following properties:

* `trials` - the number of trials this view will appear

     * trial type views also have:

        * `trial_type` - the name of the trial type that will be in the final data (for example 'main binary choice');
        * `data` - a list of trials

    * other views also have:

        * `title` - the title in the view
        * `text` - the text in the view
        * `buttonText` - the text on the button that takes the user to the newxt view

Sample use of \_babe views:

```
// your_js_file.js

import { babeInit } from './link_to_your_libraries/babe-project/babe-init.js';
import { intro, instructions, forcedChoice, thanks } from './link_to_your_libraries/babe-project/babe-views.js';

const myIntro = intro({
    title: 'Welcome!',
    text: 'This is an experiment!',
    buttonText: 'Begin the experiment',
    trials: 1
});

const myInstructions = instructions({
    title: 'Instructions',
    text: 'Choose an answer',
    buttonText: 'Next',
    trials: 1
});

const main = forcedChoice({
    trial_type: 'main',
    data: main_trials,
    trials: 4
});

const thankYou = thanks({
    title: 'Thank you for taking part in this experiment!',
    trials: 1
});

$("document").ready(function() {
    babeInit({
        views_seq: [
            myIntro,
            myInstructions,
            main,
            thankYou
        ],
        deploy: {
            "experimentID": "4",
            "serverAppURL": "https://babe-demo.herokuapp.com/api/submit_experiment/",
            "deployMethod": "debug",
            "contact_email": "YOUREMAIL@wherelifeisgreat.you",
            "prolificURL": "https://app.prolific.ac/submissions/complete?cc=ABCD1234"

        },
        progress_bar: {
            in: [
                "practice",
                "main"
            ],
            style: "default",
            width: 150
        }
    });
});
```


#### Creating your own views

You can also create your own views. Here is what you need to know:

The view is an object that has the following properties:

* `trials: number` - the number of trials this view appears
* `CT: 0` - current trial, always starts from 0, ??
* `name: string` - the name of the view ??
* `render: function` - a function that renders the view

`for the trial type views`

* pass `CT` as a parameter to render()
* add the trial info for this trial and the gathered data to the trial data


Sample custom view:

```
// your_js_file.js

import { babeInit } from './link_to_your_libraries/babe-project/babe-init.js';

const sayHello = function(info) {
    const sayHello = {
        name: info.name,
        title: info.title,
        text: info.text,
        render() {
            const viewTemplate =
            `<div class='view'>
                {{# title }}
                <h1 class="title">{{ title }}</h1>
                {{/ title }}
                {{# text }}
                <section class="text-container">
                <p class="text">{{ text }}</p>
                </section>
                {{/ text }}
                <button id="hello-back">Hello to you, too!</button>
                <button id="next" class="nodisplay">Bye!</button>
            </div>`;

            $("#main").html(
                Mustache.render(viewTemplate, {
                    title: this.title,
                    text: this.text
                })
            );

            $('#hello-back').on('click', function(e) {
                $('#next').removeClass('nodisplay');
                $('.text').addClass('nodisplay');
                e.target.classList.add('nodisplay');
            });

            $('#next').on('click', function() {
                findNextView();
            })
        },
        CT: 0,
        trials: info.trials
    };

    return sayHello;
};

const mySayHello = sayHello({
    name: 'sayHello',
    title: 'Hello',
    text: 'I am here just to say Hello..',
    trials: 1
});

$("document").ready(function() {
    babeInit({
        ...
        views_seq: [
            ...
            mySayHello,
            ...
        ],
        ...
    });
});
```

### Deploy configuration

The deploy config has the following properties:

* `experimentID` - the experimentID is needed to recover data from the babe server app. You receive the experimentID when you create the experiment using the babe server app
* `serverAppURL` - if you use the _babe server app, specify its URL here
* `deployMethod` - use one of 'debug', 'localServer', 'MTurk', 'MTurkSandbox', 'Prolific', 'directLink'
* `contact_email` - who to contact in case of trouble
* `prolificURL` - the prolific completion URL if the deploy method is "Prolific"

### Progress Bar

\_babe provides the option to include progress bars in the views specified in the `progress_bar.in` list passed to `babeInit`.

You can use one of the following 3 styles (include pictues)

* `separate` - have separate progress bars in each views declared in `progress_bar.in`
* `default` - have one progress bar throughout the whole experiment
* `chunks` - have a separate progress chunk for each view in `progress_bar.in`

Use `progress_bar.width` to set the width (in pixels) of the progress bar or chunk

Sample progress bar 

```
$("document").ready(function() {
    babeInit({
        ...
        progress_bar: {
            in: [
                "practice",
                "main"
            ], // only the practice and the main view will have progress bars in this experiment
            style: "chunks", // there will be two chunks - one for the practice and one for the main view
            width: 100 // each one of the two chunks will be 100 pixels long
        }
    });
});
```