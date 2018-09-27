import {updateProgress} from "./babe-progress-bar.js";
import {views_seq as views} from "../../config/experiment.js";
import {config_deploy as config} from "../../config/config_deploy.js";
import {submit} from "./babe-submit.js";

// user does not (should not) change the following information
// checks the config _deploy.deployMethod is MTurk or MTurkSandbox,
// sets the submission url to MTukr's servers
config.MTurk_server = config.deployMethod == "MTurkSandbox" ?
"https://workersandbox.mturk.com/mturk/externalSubmit" : // URL for MTurk sandbox
config.deployMethod == 'MTurk' ?
"https://www.mturk.com/mturk/externalSubmit" : // URL for live HITs on MTurk
""; // blank if deployment is not via MTurk
// if the config_deploy.deployMethod is not debug, then liveExperiment is true
config.liveExperiment = config.deployMethod !== "debug";
config.is_MTurk = config.MTurk_server !== "";
config.submissionURL = config.deployMethod == "localServer" ? "http://localhost:4000/api/submit_experiment/" + config.experimentID : config.serverAppURL + config.experimentID;
console.log("deployMethod: " + config.deployMethod);
console.log("live experiment: " + config.liveExperiment);
console.log("runs on MTurk: " + config.is_MTurk);
console.log("MTurk server: " + config.MTurk_server);

// flattens the views_seq specified in /modules/experiment.js
const views_seq = _.flatten(views);

// insert a Current Trial (CT) counter for each view
_.map(views_seq, function(view) {
    view.CT = 0;
});

// prepare information about trials (procedure)
_babe.trial_info = {
    practice_trials: {
        forcedChoice: _.shuffle(practice_trials.forcedChoice),
        sliderRating: practice_trials.sliderRating
    },
    main_trials: {
        forcedChoice: _.shuffle(main_trials.forcedChoice),
        sliderRating: main_trials.sliderRating
    }
};

const submitResults = function() {
    return submit(_babe.trial_data, _babe.global_data, config);
};

// navigation through the views and steps in each view;
// shows each view (in the order defined in 'modules/experiment.js') for
// the given number of steps (as defined in the view's 'trial' property)
const findNextView = function() {
    let currentView = views_seq[_babe.currentViewCounter];

    if (_babe.currentTrialInViewCounter < currentView.trials) {
        currentView.render(currentView.CT, _babe.currentTrialInViewCounter);
    } else {
        _babe.currentViewCounter++;
        currentView = views_seq[_babe.currentViewCounter];
        _babe.currentTrialInViewCounter = 0;
        currentView.render(currentView.CT);
    }
    // increment counter for how many trials we have seen of THIS view during THIS occurrence of it
    _babe.currentTrialInViewCounter++;
    // increment counter for how many trials we have seen in the whole experiment
    _babe.currentTrialCounter++;
    // increment counter for how many trials we have seen of THIS view during the whole experiment
    currentView.CT++;
    // updates the progress bar if the view has one
    if (currentView.hasProgressBar) {
        updateProgress();
    }

    return currentView;
};

// renders the first view from experiment.js
findNextView();

export {config, findNextView, submitResults};
