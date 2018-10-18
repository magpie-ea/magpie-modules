const errors = {
    contactEmail:
`There is no contact_email given. Please give a contact_email to the babeInit function,

for example:

babeInit({
    ...
    deploy: {
        ...
        contact_email: 'yourcontactemail@email.sample',
        ...
    },
    ...
});`,

    prolificURL:
`There is no prolificURL given. Please give a prolificURL to the babeInit function,

for example:

babeInit({
    ...
    deploy: {
        ...
        prolificURL: 'https://app.prolific.ac/submissions/complete?cc=SAMPLE',
        ...
    },
    ...
});`,

    noTrials:
`No trials given. Each _babe view takes an object with an obligatory 'trial' property.

for example:

const introView = intro({
    ...
    trials: 1,
    ...
});

You can find more information at https://github.com/babe-project/babe-base#views-in-_babe`,

    noName:
`No name given. Each _babe view takes an object with an obligatory 'name' property

for example:

const introView = intro({
    ...
    name: 'introView',
    ...
});

You can find more information at https://github.com/babe-project/babe-base#views-in-_babe`,

    noData:
`No data given. Each _babe view takes an object with an obligatory 'data' property

for example:

const mainTrials = forcedChoice({
    ...
    data: my_main_trials,
    ...
});

The data is a list of objects defined in your local js file.

_babe's trial views expect each trial object to have specific properties. Here is an example of a forcedCoice view trial:

{
    question: 'How are you today?',
    option1: 'fine',
    option2: 'good'
}

You can find more information at https://github.com/babe-project/babe-base#views-in-_babe`,

    noTrialType:
`No trial_type given. Each _babe view takes an object with an obligatory 'trial_type' property

for example:

const mainTrials = forcedChoice({
    ...
    trial_type: 'main trials',
    ...
});

The trial type is needed for recording the results of your experiment.

You can find more information at https://github.com/babe-project/babe-base#views-in-_babe`,

    notAnArray:
`The data is not an array. Trial views get an array of objects.

for example:

const mainTrials = forcedChoice({
    ...
    data: [
        {
            prop: val,
            prop: val
        },
        {
            prop: val,
            prop:val
        }
    ],
    ...
});`,
    noSuchViewName:
`The view name listed in progress_bar.in does not exist. Use the view names to reference the views in progress_bar.in.

for example:

const mainView = forcedChoice({
    ...
    name: 'myMainView',
    ...
});

const introView = intro({
    ...
    name: 'intro',
    ...
});

babeInit({
    ...
    progress_bar: {
        in: [
            "myMainView"
        ],
        style: "chunks"
        width: 100
    },
    ...
});
`,
    canvasSort:
`No such 'canvas.sort' value. canvas.sort can be 'grid', 'split_grid' or 'random'.

for example:

const myTrials = [
    {
        question: 'Are there circles on the picture',
        option1: 'yes',
        option2: 'yes',
        canvas: {
            ...
            sort: 'split_grid'
            ...
        }
    }
];`,
    canvasTooSmall:
`The canvas is too small and the shapes don't fit. Make your canvas bigger.

For example:

const myTrials = [
    ...
    {
        question: 'Are there circles on the picture',
        option1: 'yes',
        option2: 'yes',
        canvas: {
            ...
            canvasSize: {
                height: int,
                width: int
            },
            ...
        }
    },
    ...
];`
};