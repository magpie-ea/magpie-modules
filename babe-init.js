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

    // insert a Current Trial (CT) counter for each view
    _.map(_babe.views_seq, function(view) {
        view.CT = 0;
    });

    addProgressBars();
    findNextView();
};

export { _babe, babeInit }