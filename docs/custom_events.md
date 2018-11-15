# Custom Events

```
custom_events: {
    after_pause: eventAfterThePause,
    after_stim_shown: eventAfterTheStimIsShown
}
```

## Points

<!--  add info about the DOM at each stage to this docs -->
- `after_pause` - after the pause is finished
- `after_fix_point` - after the fixation point hides
- `after_stim_shown` - after the stimulus is shown
- `after_stim_hidden` - after the stimulus hides
- `after_response_enabled` - after the interactions are enabled


## Sample

1. Hide the QUD

babe trial views can have QUD? - a question or sentence that is always on the top of the trial view. Imagine you want to hide it when the stimulus gets hidden. You can define a function that adds 'display: none' to the QUD element:

```
function hideQUD(data) {
    $('.babe-view-qud').css('display', 'none');
};
```

and add a `custom_event` where the view is declared:

```
const main = babeViews.selfPacedReading_ratingScale({
    trials: 20,
    name: 'self_paced rating scale',
    trial_type: 'spr',
    data: main_trials.spr,
    fix_duration: 500,
    pause: 500,
    custom_events: {
        after_stim_hidddn: hideQUD
    }
});
```

2. Tell the participant if their answer was correct

You might want to tell the participants if their answer was correct in the practice trial view. You can define a funciton that compares gets their response and checks the correctness:

```
// assume that `option1` is always the correct answer.
// the view passes the trial `data` as an arg to all custom functions

function checkResponse(data) {
    $('input[name=answer]').on('change', function() {
        if ($("input[name=answer]:checked").val() === data.option1) {
            alert('Your answer is correct! Yey!');
        } else {
            alert('Sorry, you picked the wrong answer :(');
        }
    });
};
```

and add a `custom_event` after the response is enabled:

```
const main = babeViews.forcedChoice({
    trials: 20,
    name: 'binary choice',
    trial_type: 'spr',
    data: main_trials.forcedChoice,
    fix_duration: 500,
    pause: 500,
    custom_events: {
        after_response_enabled: checkResponse
    }
});
```
