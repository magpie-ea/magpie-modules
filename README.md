# \_babe project
basic architecture for browser-based experiments

## Creating a \_babe experiment with \_babe

#### Option 1: Download the \_babe project package

1. Download the [\_babe .zip](https://github.com/babe-project/babe-base)

2. Unzip and place the folder (babe-base-master) in the `libraries/` folder of your experiment.

Your experiment's structure should look something like this:
`experiment/`
    + `libraries/`
        + `babe-babe-master`
            + `_babe.full.min.js`
            + `_babe.min.js`
            + ...
            + ...

`_babe.full.min.js` includes the dependencies that \_babe uses (jQuery, Mustache and csv-js).
Using `_babe.full.min.js` there is no need to install and import jQuery, Mustache and csv-js.

`_babe.min.js` includes only the \_babe package, the dependencies should be installed separately for \_babe to work

3. Import \_babe in your `index.html`:

3.1 the full version:
`<script src="libraries/babe-base-master/_babe.full.min.js></script>"`

3.2 no-dependencies version:
`<script src="libraries/babe-base-master/_babe.full.min.js></script>"`

Note: You need to install jQuery, Mustache and csv-js in your experiment.

4. Use \_babe styles:

import \_babe-styles in your `index.html`:

`<link rel="stylesheet" type="text/css" href="libraries/babe-base-master/_babe-styles.css">`

#### Option 2: Install with npm

You need npm installed on your machine. Here is more information on how to [install npm](https://www.npmjs.com/get-npm)

If you have npm installed, run the following command from your experiment's directory

`npm install babe-project --save`

Import \_babe, jQuery, Mustache and csv-js in your main .html

```
<link rel="stylesheet" type="text/css" href="node_modules/babe-project/_babe-styles.css">

<script src="node_modules/mustache/mustache.min.js"></script>
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/csv-js/csv.js"></script>
<script src="node_modules/babe-project/_babe.min.js></script>"
```

## Usage

### \_babe Initialisation

`_babeInit` takes an object as a parameter with the following properties:

* `views_seq` - a list of view objects in the sequence you want the to appear in your experiment
* `deploy` - an object with information about the deploy methods of your experiment 
* `progress_bar` - an object with information about the progress bars in the views of your experiment


Sample `_babeInit` call:

```
$("document").ready(function() {
    _babeInit({
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

\_babe views get inserted in an html element with id `main`, you need to have an html tag (preferrably `div` or `main`)
with `id="main"`

Sample `index.html`

```
<!DOCTYPE html>
<html>
    <head>
        ...
        ...
        ...
    </head>

    <body>
        <-- ask the participants to enable JavaScript in their browser -->
        <noscript>This task requires JavaScript. Please enable JavaScript in your browser and reload the page. For more information on how to do that, please refer to
            <a href='https://enable-javascript.com' target='_blank'>enable-javascript.com</a>
        </noscript>

        <!-- views are inserted in here -->
        <main id='main'>
            Loading...
        </main>

    </body>
</html>
```


#### \_babe's ready-made views

\_babe provides several ready-made views which you can use by importing them in `your_js_file.js`.

* trial type views:
    * `forcedChoice` - [binary forced-choice task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#forced-choice-binary-choice-task)
    * `sliderRating` - [slider rating task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#slider-rating-task)
    * `textboxInput` [textbox input task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#textbox-input-task)
    * `dropdownMenu` - [dropdown menu task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#dropdown-choice-task)
    * `ratingScale` - [Likert-scale rating task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#rating-scale-task)
    * `sentenceSelection` - [text selection task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#sentence-selection-task)
    * `imageSelection` - [click-on-a-picture task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#image-selection-task)
    * `keyPress`- press a [button task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#key-press-task)

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

const intro = _babeViews.intro({
    title: 'Welcome!',
    text: 'This is an experiment!',
    buttonText: 'Begin the experiment',
    trials: 1
});

const instructions = _babeViews.instructions({
    title: 'Instructions',
    text: 'Choose an answer',
    buttonText: 'Next',
    trials: 1
});

const main = _babeViews.forcedChoice({
    trial_type: 'main',
    data: main_trials,
    trials: 4
});

const thanks = _babeViews.thanks({
    title: 'Thank you for taking part in this experiment!',
    trials: 1
});

$("document").ready(function() {
    _babeInit({
        views_seq: [
            intro,
            instructions,
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
                "main"
            ],
            style: "default",
            width: 100
        }
    });
});
```


#### Creating your own views

!!!

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
    _babeInit({
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

\_babe provides the option to include progress bars in the views specified in the `progress_bar.in` list passed to `_babeInit`.

You can use one of the following 3 styles (include pictues)

* `separate` - have separate progress bars in each views declared in `progress_bar.in`
* `default` - have one progress bar throughout the whole experiment
* `chunks` - have a separate progress chunk for each view in `progress_bar.in`

Use `progress_bar.width` to set the width (in pixels) of the progress bar or chunk

Sample progress bar 

```
$("document").ready(function() {
    _babeInit({
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