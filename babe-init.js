import {findNextView} from './babe-main.js';
import {addProgressBars} from './babe-progress-bar.js';

const _babe = {};

function babeInit(config) {
    // views handler
    _babe.views_seq = _.flatten(config.views_seq);
    _babe.currentViewCounter = 0;
    _babe.currentTrialCounter = 0;
    _babe.currentTrialInViewCounter = 0;

    // progress bar information
    _babe.progress_bar = config.progress_bar;

    // results collection
    _babe.global_data = {
        startDate: Date(),
        startTime: Date.now()
    };
    _babe.trial_data = [];

    // deploy informaiton
    _babe.deploy = config.deploy;
    _babe.deploy.MTurk_server = _babe.deploy.deployMethod == "MTurkSandbox" ?
    "https://workersandbox.mturk.com/mturk/externalSubmit" : // URL for MTurk sandbox
    _babe.deploy.deployMethod == 'MTurk' ?
    "https://www.mturk.com/mturk/externalSubmit" : // URL for live HITs on MTurk
    ""; // blank if deployment is not via MTurk
    // if the config_deploy.deployMethod is not debug, then liveExperiment is true
    _babe.deploy.liveExperiment = _babe.deploy.deployMethod !== "debug";
    _babe.deploy.is_MTurk = _babe.deploy.MTurk_server !== "";
    _babe.deploy.submissionURL = _babe.deploy.deployMethod == "localServer" ? "http://localhost:4000/api/submit_experiment/" + _babe.deploy.experimentID : _babe.deploy.serverAppURL + _babe.deploy.experimentID;

    if (_babe.deploy.deployMethod === 'MTurk' || _babe.deploy.deployMethod === 'MTurkSandbox') {
        console.log(
`The experiment runs on MTurk (or MTurk's sandbox)
----------------------------

The ID of your experiment is ${_babe.deploy.experimentID}

The results will be submitted ${_babe.deploy.submissionURL}

and

MTurk's server: ${_babe.deploy.MTurk_server}`
);
    } else if (_babe.deploy.deployMethod === 'Prolific') {
        console.log(
`The experiment runs on Prolific
-------------------------------

The ID of your experiment is ${_babe.deploy.experimentID}

The results will be submitted to ${_babe.deploy.submissionURL}

with

Prolific URL (must be the same as in the website): ${_babe.deploy.prolificURL}`
);
    } else if (_babe.deploy.deployMethod === 'directLink') {
        console.log(
`The experiment uses Direct Link
-------------------------------

The ID of your experiment is ${_babe.deploy.experimentID}

The results will be submitted to ${_babe.deploy.submissionURL}`
);
    } else if (_babe.deploy.deployMethod === 'debug') {
        console.log(
`The experiment is in Debug Mode
-------------------------------

The results will be displayed in a table at the end of the experiment and available to download in CSV format.`
);
    } else {

        throw new Error(
`There is no such deployMethod.

Please use 'debug', 'directLink', 'Mturk', 'MTurkSandbox' or 'Prolific'.

The deploy method you provided is '${_babe.deploy.deployMethod}'.

You can find more information at https://github.com/babe-project/babe-base`);
    }

    // adds progress bars to the views
    addProgressBars();

    // renders the first view
    findNextView();
};

export { _babe, babeInit }