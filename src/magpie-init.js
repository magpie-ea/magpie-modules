const magpieInit = function(config) {
    const magpie = {};

    // views handler
    magpie.views_seq = _.flatten(config.views_seq);
    magpie.currentViewCounter = 0;
    magpie.currentTrialCounter = 0;
    magpie.currentTrialInViewCounter = 0;

    // progress bar information
    magpie.progress_bar = config.progress_bar;

    // results collection
    // --
    // general data
    magpie.global_data = {
        startDate: Date(),
        startTime: Date.now()
    };
    // data from trial views
    magpie.trial_data = [];

    // more deploy information added
    magpie.deploy = config.deploy;
    magpie.deploy.MTurk_server =
        magpie.deploy.deployMethod === "MTurkSandbox"
            ? "https://workersandbox.mturk.com/mturk/externalSubmit" // URL for MTurk sandbox
            : magpie.deploy.deployMethod === "MTurk"
                ? "https://www.mturk.com/mturk/externalSubmit" // URL for live HITs on MTurk
                : ""; // blank if deployment is not via MTurk
    // if the config_deploy.deployMethod is not debug, then liveExperiment is true
    magpie.deploy.liveExperiment = magpie.deploy.deployMethod !== "debug";
    magpie.deploy.is_MTurk = magpie.deploy.MTurk_server !== "";
    magpie.deploy.submissionURL =
        magpie.deploy.deployMethod === "localServer"
            ? "http://localhost:4000/api/submit_experiment/" +
              magpie.deploy.experimentID
            : magpie.deploy.serverAppURL + magpie.deploy.experimentID;

    // This is not ideal. Should have specified the "serverAppURL" as the base URL, instead of the full URL including "submit_experiment". That naming can be misleading.
    const regex = "/submit_experiment/";
    magpie.deploy.checkExperimentURL = magpie.deploy.submissionURL.replace(
        regex,
        "/check_experiment/"
    );

    if (typeof config.timer === 'undefined') {
        magpie.timer = "";
    } else {
        magpie.timer = config.timer;
        magpieTimer(magpie);
    }

    // adds progress bars to the views
    magpie.progress = magpieProgress(magpie);
    // makes the submit available
    magpie.submission = magpieSubmit(magpie);

    // handles the views rendering
    magpie.findNextView = function() {
        let currentView = magpie.views_seq[magpie.currentViewCounter];

        if (magpie.currentTrialInViewCounter < currentView.trials) {
            currentView.render(currentView.CT, magpie);
        } else {
            magpie.currentViewCounter++;
            currentView = magpie.views_seq[magpie.currentViewCounter];
            magpie.currentTrialInViewCounter = 0;
            if (currentView !== undefined) {
                currentView.render(currentView.CT, magpie);
            } else {
                $("#main").html(
                    `<div class='magpie-view'>
                        <h1 class="title">Nothing more to show</h1>
                    </div>`
                );
                return;
            }
        }
        // increment counter for how many trials we have seen of THIS view during THIS occurrence of it
        magpie.currentTrialInViewCounter++;
        // increment counter for how many trials we have seen in the whole experiment
        magpie.currentTrialCounter++;
        // increment counter for how many trials we have seen of THIS view during the whole experiment
        currentView.CT++;

        // updates the progress bar if the view has one
        if (currentView.hasProgressBar) {
            magpie.progress.update();
        }
    };

    // checks the deployMethod
    (function() {
        if (
            magpie.deploy.deployMethod === "MTurk" ||
            magpie.deploy.deployMethod === "MTurkSandbox"
        ) {
            console.info(
                `The experiment runs on MTurk (or MTurk's sandbox)
----------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted ${magpie.deploy.submissionURL}

and

MTurk's server: ${magpie.deploy.MTurk_server}`
            );
        } else if (magpie.deploy.deployMethod === "Prolific") {
            console.info(
                `The experiment runs on Prolific
-------------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted to ${magpie.deploy.submissionURL}

with

Prolific URL (must be the same as in the website): ${magpie.deploy.prolificURL}`
            );
        } else if (magpie.deploy.deployMethod === "directLink") {
            console.info(
                `The experiment uses Direct Link
-------------------------------

The ID of your experiment is ${magpie.deploy.experimentID}

The results will be submitted to ${magpie.deploy.submissionURL}`
            );
        } else if (magpie.deploy.deployMethod === "debug") {
            console.info(
                `The experiment is in Debug Mode
-------------------------------

The results will be displayed in a table at the end of the experiment and available to download in CSV format.`
            );
        } else if (magpie.deploy.deployMethod !== "localServer") {
            throw new Error(
                `There is no such deployMethod.

Please use 'debug', 'directLink', 'Mturk', 'MTurkSandbox', 'localServer' or 'Prolific'.

The deploy method you provided is '${magpie.deploy.deployMethod}'.

You can find more information at https://github.com/magpie-ea/magpie-modules`
            );
        }

        if (
            magpie.deploy.deployMethod === "Prolific" &&
            (magpie.deploy.prolificURL === undefined ||
                magpie.deploy.prolificURL === "")
        ) {
            throw new Error(errors.prolificURL);
        }

        if (
            magpie.deploy.contact_email === undefined ||
            magpie.deploy.contact_email === ""
        ) {
            throw new Error(errors.contactEmail);
        }
    })();

    // Checks whether the experiment is valid and reachable on the server before proceeding.

    if (magpie.deploy.deployMethod !== "debug") {
        $.ajax({
            type: "GET",
            url: magpie.deploy.checkExperimentURL,
            crossDomain: true,
            success: function(responseData, textStatus, jqXHR) {
                // adds progress bars
                magpie.progress.add();

                // renders the first view
                magpie.findNextView();
            },
            error: function(jqXHR, textStatus, error) {
                alert(
                    `Sorry, there is an error communicating with our server and the experiment cannot proceed. Please return the HIT immediately and contact the author at ${
                        magpie.deploy.contact_email
                    }. Please include the following error message: "${
                        jqXHR.responseText
                    }". Thank you for your understanding.`
                );
            }
        });
    } else {
        // adds progress bars
        magpie.progress.add();

        // renders the first view
        magpie.findNextView();
    }

    // return the magpie-object in debug mode to make debugging easier
    if (magpie.deploy.deployMethod === 'debug'){
        return magpie;
    } else {
        return null;
    }
};
