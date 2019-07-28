# \_magpie project
minimal architecture for the generation of portable interactive experiments

**Latest version: 0.1.1**

- Say hello to our new name \_magpie 
    - This project is now called `magpie-modules` on npm
	- Lodash is now included in magpie.full.js
    - Otherwise it is the same as 0.1.2 of babe-project


**Table of contents**

- [Create an experiment with \_magpie](#create-an-experiment-with-_magpie)
    - [Install and import \_magpie](#install-and-import_magpie)
    - [Experiment Initialisation](#experiment-initialisation)
    - [Views](#views-in-_magpie)
    - [Deploy configuraton](#deploy-configuration)
    - [Progress bar](#progress-bar)
- [Sample experiment](#sample-experiment)
- [Development](#development)
- [Deployment using Netlify](#deployment-using-netlify)


## Create an experiment with \_magpie

### Install and import \_magpie

#### Option 1: Install with npm (recommended)

1. Get \_magpie

You need to have npm installed in your machine. [Install npm](https://www.npmjs.com/get-npm).


```
# create a folder for your experiment

mkdir my-experiment

# move to the experiment's folder

cd my-experiment

# initialise npm (create a package.json file)

npm init

# install the dependencies with npm

npm install magpie-modules --save
```

the npm installation process creates a folder (named `node_modules`) in your experiment's directory where the npm dependencies are stored. After successfully installing \_magpie, the `node_modules` folder should contain `magpie-modules` and its dependencies `jquery` and `csv-js`.

2. Add \_magpie

The `magpie-modules` folder includes the following three files that you can add to your experiment:

- `magpie.full.js` - includes \_magpie functions and its dependencies (jquery nad csv-js), no need to install and import jquery and csv-js.
- `magpie.js` - includes only \_magpie functions (jquery nad csv-js), jquery and csv-js have to be included separately.
- `magpie.css` - includes magpie styles.

Import \_magpie with a script tag:

add `magpie.full.js`

`<script src='path/to/node_modules/magpie-modules/magpie.full.js'></script>`

or add `magpie.js`, `jquery` and `csv.js`

`<script src='path/to/node_modules/jquery/dist/jquery.min.js'></script>`

`<script src='path/to/node_modules/csv-js/csv.js'></script>`

`<script src='path/to/node_modules/magpie-modules/magpie.js'></script>`

3. Update \_magpie 

You can get newer versions of \_magpie with

`npm update`


#### Option 2: Download the magpie-modules (not reccommended)

1. Download the .zip from this repository

2. Unzip and move `magpie.full.js`, `magpie.js` and `magpie.css` in the `libraries/` folder of your experiment.

 Your experiment's structure should look like this:

- experiment/
    - libraries/
        - magpie.full.js
        - magpie.css
        - magpie.js

 `magpie.full.js` includes the dependencies that \_magpie uses (jQuery, and csv-js). There is no need to install and import jQuery, and csv-js.

 `magpie.js` includes only the \_magpie package, the dependencies should be installed separately for \_magpie to work.

 `magpie.css` includes styles for \_magpie experiments.

3. Import \_magpie in your main `html` file

 the full version or no-dependencies version:

 `<script src="libraries/magpie.full.js></script>` or `<script src="libraries/magpie.js></script>`

 and \_magpie-styles:

 `<link rel="stylesheet" type="text/css" href="libraries/magpie.css">`


## Usage

Once you have installed and included \_magpie in your files, you can start using \_magpie funcitons to create your experiment.
You can use:

* magpieInit({..}) - to initialize the experiment
* magpieViews._view_({..}) - to create an instance of a \_magpie view

### Experiment initialisation

Use `magpieInit({..})` to create a \_magpie experiment.

`magpieInit` takes an object as a parameter with the following properties:

* `views_seq` - an array of view objects in the sequence you want them to appear in your experiment. [more info](https://github.com/magpie-ea/magpie-modules#views-in-_magpie)
* `deploy` - an object with information about the deploy methods of your experiment. [more info](https://github.com/magpie-ea/magpie-modules#deploy-configuration)
* `progress_bar` - an object with information about the progress bars in the views of your experiment. [more info](https://github.com/magpie-ea/magpie-modules#progress-bar)


Sample `magpieInit` call:

```
$("document").ready(function() {
    magpieInit({
        views_seq: [
            intro,
            instructions,
            practice,
            main,
            thanks
        ],
        deploy: {
            "experimentID": "4",
            "serverAppURL": "https://magpie-demo.herokuapp.com/api/submit_experiment/",
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

### Views in \_magpie

\_magpie views get inserted in a html element with id `main`, you need to have an html tag (preferrably `div` or `main`)
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

\_magpie provides several ready-made views which you can access form the `magpieViews` object. The views use [js template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

* Trial Type Views (TTV):
    * `magpieViews.forcedChoice` - binary forced-choice task
    * `magpieViews.sliderRating` - slider rating task
    * `magpieViews.textboxInput` - textbox input task
    * `magpieViews.dropdownMenu` - dropdown menu task
    * `magpieViews.ratingScale` - Likert-scale rating task
    * `magpieViews.sentenceChoice` - text selection task
    * `magpieViews.imageSelection` - click-on-a-picture task
    * `magpieViews.keyPress`- press a button task
    * `magpieViews.selfPacedReading`
    * `magpieViews.selfPacedReading_ratingScale`

* Other Type Views (OTV):
    * `magpieViews.intro`  - introduction view
    * `magpieViews.instructions`-  instructions view
    * `magpieViews.begin` - begin experiment view; can be used between the practice and the main view
    * `magpieViews.postTest` - post-experiment questionnaire
    * `magpieViews.thanks` - the last view that handles the submission of the results of creates a table with the results in 'Debug Mode'


Each \_magpie view function takes an object as a parameter with obligatory and optional properties.
[Here](docs/views.md) you can find more information about how to use the \_magpie views.

#### Custom views

You can also create your own views.

The views are functions that return an object with the following properties:

* `name: string` - the name of the view (the progress bar uses the name)
* `trials: number` - the number of trials this view appears
* `CT: 0` - current trial, always starts from 0
* `render: function` - a function that renders the view
    * pass `CT` and `magpie` as parameters to render()

Add the data gathered from your custom trial type views to `magpie.trial_data`

Sample custom trial type view:

*The templates use [js template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)*

```
magpieViews.pressTheButton = function(config) {
    const _pressTheButton = {
        name: config.name,
        title: config.title, // 
        buttonText: config.buttonText,
        render(CT, magpie) {
            let startTime = Date.now();

            const viewTemplate =
            `<div class='view'>
                <h1 class="title">${title}</h1>
                <button id="the-button">${button}</button>
            </div>`;

            $("#main").html(viewTemplate);

            $('#the-button').on('click', function(e) {
                _magpie.trial_data.push({
                    trial_type: config.trial_type,
                    trial_number: CT+1,
                    RT: Date.now() - startTime
                });
                _magpie.findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _pressTheButton;
};

const mainTrial = magpieViews.pressTheButton({
    name: 'buttonPress',
    title: 'How quickly can you press this button?',
    buttonText: 'Press me!',
    trial_type: 'main',
    trials: 1
});

$("document").ready(function() {
    magpieInit({
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
magpieViews.sayHello = function(config) {
    const _sayHello = {
        name: config.name,
        title: config.title,
        render(CT, magpie) {
            const viewTemplate =
            `<div class='view'>
                <h1 class="title">${title}</h1>
                <button id="hello-button">Hello back!</button>
            </div>`;

            $("#main").html(viewTemplate);

            $('#hello-button').on('click', function(e) {
                _magpie.findNextView();
            });
        },
        CT: 0,
        trials: config.trials
    };

    return _sayHello;
};

const hello = magpieViews.sayHello({
    name: 'buttonPress',
    title: 'Hello!?',
    trials: 1
});

$("document").ready(function() {
    magpieInit({
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

magpie also includes a small library to create simple shapes as a picture for your experiment.

<img src='docs/images/canvas_samples/random.png' alt='random placement example' height='auto' width='400' />

<img src='docs/images/canvas_samples/split_grid.png' alt='random placement example' height='auto' width='400' />

Check the [canvas api](docs/canvas.md) for more information.

### Deploy configuration

The deploy config expects the following properties:

* `experimentID: string` - the experimentID is needed to recover data from the magpie server app. You receive the experimentID when you create the experiment using the magpie server app
* `serverAppURL: string` - if you use the _magpie server app, specify its URL here
* `deployMethod: string` - use one of 'debug', 'localServer', 'MTurk', 'MTurkSandbox', 'Prolific', 'directLink'
* `contact_email: string` - who to contact in case of trouble
* `prolificURL: string` - the prolific completion URL if the deploy method is "Prolific"

prolificURL is only needed if the experiment runs on Prolific.


### Progress Bar

\_magpie provides the option to include progress bars in the views specified in the `progress_bar.in` list passed to `magpieInit`. Use the names of the views in `progress_bar.in`.

You can use one of the following 3 styles (include pictues)

* `separate` - have separate progress bars in each type of views declared in `progress_bar.in`
* `default` - have one progress bar throughout the whole experiment
* `chunks` - have a separate progress chunk for each type of view in `progress_bar.in`

Use `progress_bar.width` to set the width (in pixels) of the progress bar or chunk

Sample progress bar

```
$("document").ready(function() {
    magpieInit({
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

[Here](https://github.com/magpie-ea/departure-point) you can find a minimal experiment created with \_magpie, you can use this template as a starting point for your experiment. [Showroom](https://github.com/magpie-ea/showroom) is an experiment which demonstrates most of \_magpie's functionalities including most views, hooks and the canvas-api.

## Development

To get the development version of the \_magpie package, clone this repository and install the dependencies by running `npm install` in the terminal.

### Workflow

branches:

- master - Current stable version.
- development - Development version. This is where new featues or bug fixes are pushed. When the version is stable, the branch is merged into master.

#### (1) Source files

- src/
    - `magpie-canvas.js`
    - `magpie-errors.js`
    - `magpie-init.js`
    - `magpie-progress-bar.js`
    - `magpie-submit.js`
    - `magpie-utils.js`
    - `magpie-views.js`

- `magpie.css`

#### (2) Create magpie.js and magpie.full.js

##### Option 1: Build the \_magpie package files while developing

Use `npm run watch` command from the `magpie-modules` folder to start a process which watches for changes in the files in `src` and builds (updates) `magpie.js` and `magpie.full.js`. This commands builds both `magpie.js` and `magpie.full.js` when a file  in `src` is saved.

##### Option 2: Make changes to the files and then build the \_magpie files

Run `npm run concat` from the `magpie-modules` folder. This command builds both `magpie.js` and `magpie.full.js`.

#### (3) Merge into master
- include a changelog information in the README
- merge to master
- [update the version of \_magpie](https://docs.npmjs.com/about-semantic-versioning) in `package.json`

#### (4) Publish to npm

Run `npm publish` from the `magpie-modules` folder to publish the new version of \_magpie.

## Deployment using Netlify 

1. Registration
    -  Go to https://www.netlify.com/ and sign up using GitHub
2. Deployment
    - Using git: Click on the `New site from Git`-Button, choose GitHub and authorize the netlify-app on GitHub, configure which repositories to give access to, (back on netlify) select the repository to deploy, enter the build command `rm -rf dist && mkdir dist && rsync -rv * dist --exclude ./dist` and the publish directory `dist` (this is a workaround for publishing `node_modules`, see [here](https://stackoverflow.com/questions/54527465/no-node-modules-from-netlify-deploy/54545546#54545546), another way of bundling the files may be appropriate), click on `Deploy site` 
    - Manual: Go to https://app.netlify.com/ and drag and drop your finished experiment folder (including node_modules) to the drag&drop area
3. Configuration
    - Change the domain name:
        - Click on the deployed site you want to configure, click on `Domain setting`, click on `Edit site name` and change to the name of choice.
