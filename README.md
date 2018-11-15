# \_babe project
basic architecture for browser-based experiments

**_version 0.0.16**

**Table of contents**

- [Create an experiment with \_babe](#create-an-experiment-with-_babe)
    - [Install \_babe](#install-_babe)
    - [Experiment Initialisation](#experiment-initialisation)
    - [Views](#views-in-_babe)
    - [Deploy configuraton](#deploy-configuration)
    - [Progress bar](#progress-bar)
- [Sample experiment](#sample-experiment)
- [Development](#development)



## Create an experiment with \_babe

### Install \_babe

#### Option 1: Download the babe-project


1. Download the .zip from this repository

2. Unzip and move `_babe.full.min.js`, `_babe.min.js` and `_babe-styles.css` in the `libraries/` folder of your experiment.

 Your experiment's structure should look like this:

- experiment/
    - libraries/
        - _babe.full.min.js
        - _babe-styles.css
        - _babe.min.js

 `_babe.full.min.js` includes the dependencies that \_babe uses (jQuery, and csv-js). There is no need to install and import jQuery, and csv-js.

 `_babe.min.js` includes only the \_babe package, the dependencies should be installed separately for \_babe to work.

 `_babe-styles.css` includes styles for \_babe experiments.

3. Import \_babe in your `index.html`

 the full version or no-dependencies version:

 `<script src="libraries/_babe.full.min.js></script>` or `<script src="libraries/_babe.min.js></script>`

 and \_babe-styles:

 `<link rel="stylesheet" type="text/css" href="libraries/_babe-styles.css">`


#### Option 2: Install with git and npm

```
# clone the repo

git clone https://github.com/babe-project/babe-project.git

# move to the project's folder

cd babe-project

# install the dependencies with npm

npm install babe-project --save
```

You need to have npm installed in your machine. [Install npm](https://www.npmjs.com/get-npm).

\_babe dependencies:

 - jQuery
 - Mustache
 - csv-js


## Usage

Once you have installed \_babe, you can start using \_babe funcitons to create your experiment.
You can use:

* babeInit({..}) - to initialize the experiment
* babeViews._view_ - to create an instance of a \_babe view

### Experiment initialisation

Use `babeInit({..})` to create a \_babe experiment.

`babeInit` takes an object as a parameter with the following properties:

* `views_seq` - an array of view objects in the sequence you want them to appear in your experiment. [more info](https://github.com/babe-project/babe-base#views-in-_babe)
* `deploy` - an object with information about the deploy methods of your experiment. [more info](https://github.com/babe-project/babe-base#deploy-configuration)
* `progress_bar` - an object with information about the progress bars in the views of your experiment. [more info](https://github.com/babe-project/babe-base#progress-bar)


Sample `babeInit` call:

```
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

\_babe views get inserted in a html element with id `main`, you need to have an html tag (preferrably `div` or `main`)
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


#### Included views

\_babe provides several ready-made views which you can access form the `babeViews` object. The views use [js template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

* trial type views:
    * `babeViews.forcedChoice` - [binary forced-choice task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#forced-choice-binary-choice-task)
    * `babeViews.sliderRating` - [slider rating task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#slider-rating-task)
    * `babeViews.textboxInput` [textbox input task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#textbox-input-task)
    * `babeViews.dropdownMenu` - [dropdown menu task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#dropdown-choice-task)
    * `babeViews.ratingScale` - [Likert-scale rating task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#rating-scale-task)
    * `babeViews.sentenceSelection` - [text selection task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#sentence-selection-task)
    * `babeViews.imageSelection` - [click-on-a-picture task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#image-selection-task)
    * `babeViews.keyPress`- press a [button task](https://github.com/babe-project/babe-base/blob/master/docs/views.md#key-press-task)
    * `babeViews.selfPacedReading`
    * `babeViews.selfPacedReading_ratingScale`

* other views:
    * `babeViews.intro`  - introduction view
    * `babeViews.instructions`-  instructions view
    * `babeViews.begin` - begin experiment view; can be used between the practice and the main view
    * `babeViews.postTest` - post-experiment questionnaire
    * `babeViews.thanks` - the last view that handles the submission of the results of creates a table with the results in 'Debug Mode'


Each \_babe view function takes an object as a parameter with the following properties:

* `trials: int` - the number of trials this view will appear
* `name: string`

     * trial type views also have:

        * `trial_type: string` - the name of the trial type that will be in the final data (for example 'main binary choice');
        * `data: array` - an array of trial objects. see [the data format](docs/views.md)

    * other views also have:

        * `title: string` - the title in the view
        * `text: string` - the text in the view
        * `buttonText: string` - the text on the button that takes the user to the newxt view

    * thanks view

        * `prolificConfirmText: string` - text above the prolific submission url

Sample use of \_babe views:

```
// your_js_file.js

const intro = babeViews.intro({
    name: 'intro',
    title: 'Welcome!',
    text: 'This is an experiment!',
    buttonText: 'Begin the experiment',
    trials: 1
});

const instructions = babeViews.instructions({
    name: 'instuctions',
    title: 'Instructions',
    text: 'Choose an answer',
    buttonText: 'Next',
    trials: 1
});

const practice = babeViews.forcedChoice({
    name: 'practice_forced_choice',
    trial_type: 'practice',
    data: practice_trials,
    trials: 2
});

const main = babeViews.forcedChoice({
    name: 'main_forced_choice',
    trial_type: 'main',
    data: main_trials,
    trials: 4
});

const thanks = babeViews.thanks({
    name: 'thanks'
    title: 'Thank you for taking part in this experiment!',
    trials: 1
});

$("document").ready(function() {
    babeInit({
        views_seq: [
            intro,
            instructions,
            main,
            thanks
        ],
        deploy: {
            'experimentID': '4',
            'serverAppURL': 'https://babe-demo.herokuapp.com/api/submit_experiment/',
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

#### Custom views

You can also create your own views.

The views are functions that return an object with the following properties:

* `name: string` - the name of the view (the progress bar uses the name)
* `trials: number` - the number of trials this view appears
* `CT: 0` - current trial, always starts from 0
* `render: function` - a function that renders the view
    * pass `CT` and `babe` as parameters to render()

Add the data gathered from your custom trial type views to `babe.trial_data`

Sample custom trial type view:

*The templates use [js template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)*

```
babeViews.pressTheButton = function(config) {
    const _pressTheButton = {
        name: config.name,
        title: config.title, // 
        buttonText: config.buttonText,
        render(CT, babe) {
            let startTime = Date.now();

            const viewTemplate =
            `<div class='view'>
                <h1 class="title">${title}</h1>
                <button id="the-button">${button}</button>
            </div>`;

            $("#main").html(viewTemplate);

            $('#the-button').on('click', function(e) {
                _babe.trial_data.push({
                    trial_type: config.trial_type,
                    trial_number: CT+1,
                    RT: Date.now() - startTime
                });
                _babe.findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _pressTheButton;
};

const mainTrial = babeViews.pressTheButton({
    name: 'buttonPress',
    title: 'How quickly can you press this button?',
    buttonText: 'Press me!',
    trial_type: 'main',
    trials: 1
});

$("document").ready(function() {
    babeInit({
        ...
        views_seq: [
            ...
            mainTrial,
            ...
        ],
        ...
    });
});
```

Sample custom info view:

```
babeViews.sayHello = function(config) {
    const _sayHello = {
        name: config.name,
        title: config.title,
        render(CT, babe) {
            const viewTemplate =
            `<div class='view'>
                <h1 class="title">${title}</h1>
                <button id="hello-button">Hello back!</button>
            </div>`;

            $("#main").html(viewTemplate);

            $('#hello-button').on('click', function(e) {
                _babe.findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _sayHello;
};

const hello = babeViews.sayHello({
    name: 'buttonPress',
    title: 'Hello!?',
    trials: 1
});

$("document").ready(function() {
    babeInit({
        ...
        views_seq: [
            ...
            hello,
            ...
        ],
        ...
    });
});
```

##### Canvas

babe also includes a small library to create simple shapes as a picture for your experiment.

<img src='docs/images/canvas_samples/random.png' alt='random placement example' height='auto' width='400' />

<img src='docs/images/canvas_samples/split_grid.png' alt='random placement example' height='auto' width='400' />

Check the [canvas api](docs/canvas.md) for more information.

### Deploy configuration

The deploy config expects the following properties:

* `experimentID: string` - the experimentID is needed to recover data from the babe server app. You receive the experimentID when you create the experiment using the babe server app
* `serverAppURL: string` - if you use the _babe server app, specify its URL here
* `deployMethod: string` - use one of 'debug', 'localServer', 'MTurk', 'MTurkSandbox', 'Prolific', 'directLink'
* `contact_email: string` - who to contact in case of trouble
* `prolificURL: string` - the prolific completion URL if the deploy method is "Prolific"

prolificURL is only needed if the experiment runs on Prolific.


### Progress Bar

\_babe provides the option to include progress bars in the views specified in the `progress_bar.in` list passed to `babeInit`. Use the names of the views in `progress_bar.in`.

You can use one of the following 3 styles (include pictues)

* `separate` - have separate progress bars in each type of views declared in `progress_bar.in`
* `default` - have one progress bar throughout the whole experiment
* `chunks` - have a separate progress chunk for each type of view in `progress_bar.in`

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
            ],                  // only the practice and the main view will have progress bars in this experiment
            style: "chunks",    // there will be two chunks - one for the practice and one for the main view
            width: 100          // each one of the two chunks will be 100 pixels long
        }
    });
});
```

[samples](docs/progress.md)

## Sample experiment

[Here](https://github.com/babe-project/MinimalTemplate/tree/modularized) you can find a sample forced-choice experiment created with \_babe.

## Development

To get the development version of the \_babe package, clone this repository and install the dependencies by running `npm install` in the terminal. This will install:

**Dependencies**

- [jQuery](https://www.npmjs.com/package/jquery)
- [csv-js](https://www.npmjs.com/package/csv-js)

**Development dependencies**

- [prettier](https://www.npmjs.com/package/prettier)
- [eslint](https://www.npmjs.com/package/eslint)

### Make changes to the files

You can find the development files in the `src/` folder

- src/
    - babe-errors.js
    - babe-init.js
    - babe-progress-bar.js
    - babe-submit.js
    - babe-utils.js
    - babe-views.js
    - _babe-styles.css

**Code format**

...

### Create \_babe.min.js and \_babe.full.min.js

`\_babe.min.js` includes only the babe project package

`_babe.full.min.js` includes the babe project package + jQuery and csv-js

You can use [uglify-es](https://www.npmjs.com/package/uglify-es) to minify the files.

```
#install uglify-es with npm

npm install -g uglify-es

#minify the files

npm run uglify
```
