import {submit} from "./babe-submit.js";
import {_babe} from './babe-init.js';
import {updateProgress} from './babe-progress-bar.js';

function submitResults() {
    return submit(_babe.trial_data, _babe.global_data, _babe.deploy);
};

// navigation through the views and steps in each view;
// shows each view (in the order defined in 'modules/experiment.js') for
// the given number of steps (as defined in the view's 'trial' property)
function findNextView() {
    let currentView = _babe.views_seq[_babe.currentViewCounter];

    if (_babe.currentTrialInViewCounter < currentView.trials) {
        currentView.render(currentView.CT);
    } else {
        _babe.currentViewCounter++;
        currentView = _babe.views_seq[_babe.currentViewCounter];
        _babe.currentTrialInViewCounter = 0;
        if (currentView !== undefined) {
            currentView.render(currentView.CT);
        } else {
            noMoreViews();
        }
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
};

function noMoreViews() {
    const viewTemplate =
    `<div class='view'>
        <h1 class="title">Nothing more to show</h1>
    </div>`;

    $("#main").html(
        Mustache.render(viewTemplate)
    );
};

export { findNextView, submitResults };
