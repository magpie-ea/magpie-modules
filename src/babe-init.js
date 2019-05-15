const babeInit = function(config) {
    const babe = {};

    // views handler
    babe.views_seq = _.flatten(config.views_seq);
    babe.currentViewCounter = 0;
    babe.currentTrialCounter = 0;
    babe.currentTrialInViewCounter = 0;

    // progress bar information
    babe.progress_bar = config.progress_bar;

    // results collection
    // --
    // general data
    babe.global_data = {
        startDate: Date(),
        startTime: Date.now()
    };
    // data from trial views
    babe.trial_data = [];

    // more deploy information added
    babe.deploy = config.deploy;
    babe.deploy.MTurk_server =
        babe.deploy.deployMethod === "MTurkSandbox"
            ? "https://workersandbox.mturk.com/mturk/externalSubmit" // URL for MTurk sandbox
            : babe.deploy.deployMethod === "MTurk"
                ? "https://www.mturk.com/mturk/externalSubmit" // URL for live HITs on MTurk
                : ""; // blank if deployment is not via MTurk
    // if the config_deploy.deployMethod is not debug, then liveExperiment is true
    babe.deploy.liveExperiment = babe.deploy.deployMethod !== "debug";
    babe.deploy.is_MTurk = babe.deploy.MTurk_server !== "";
    babe.deploy.submissionURL =
        babe.deploy.deployMethod === "localServer"
            ? "http://localhost:4000/api/submit_experiment/" +
              babe.deploy.experimentID
            : babe.deploy.serverAppURL + babe.deploy.experimentID;

    // This is not ideal. Should have specified the "serverAppURL" as the base URL, instead of the full URL including "submit_experiment". That naming can be misleading.
    const regex = "/submit_experiment/";
    babe.deploy.checkExperimentURL = babe.deploy.submissionURL.replace(
        regex,
        "/check_experiment/"
    );

    if (typeof config.timer === 'undefined') {
        babe.timer = "";
    } else {
        babe.timer = config.timer;
        babeTimer(babe);
    }

    // adds progress bars to the views
    babe.progress = babeProgress(babe);
    // makes the submit available
    babe.submission = babeSubmit(babe);

    // handles the views rendering
    babe.findNextView = function() {
        let currentView = babe.views_seq[babe.currentViewCounter];

        if (babe.currentTrialInViewCounter < currentView.trials) {
            currentView.render(currentView.CT, babe);
        } else {
            babe.currentViewCounter++;
            currentView = babe.views_seq[babe.currentViewCounter];
            babe.currentTrialInViewCounter = 0;
            if (currentView !== undefined) {
                currentView.render(currentView.CT, babe);
            } else {
                $("#main").html(
                    `<div class='babe-view'>
                        <h1 class="title">Nothing more to show</h1>
                    </div>`
                );
                return;
            }
        }
        // increment counter for how many trials we have seen of THIS view during THIS occurrence of it
        babe.currentTrialInViewCounter++;
        // increment counter for how many trials we have seen in the whole experiment
        babe.currentTrialCounter++;
        // increment counter for how many trials we have seen of THIS view during the whole experiment
        currentView.CT++;

        // updates the progress bar if the view has one
        if (currentView.hasProgressBar) {
            babe.progress.update();
        }
    };

    // checks the deployMethod
    (function() {
        if (
            babe.deploy.deployMethod === "MTurk" ||
            babe.deploy.deployMethod === "MTurkSandbox"
        ) {
            console.info(
                `The experiment runs on MTurk (or MTurk's sandbox)
----------------------------

The ID of your experiment is ${babe.deploy.experimentID}

The results will be submitted ${babe.deploy.submissionURL}

and

MTurk's server: ${babe.deploy.MTurk_server}`
            );
        } else if (babe.deploy.deployMethod === "Prolific") {
            console.info(
                `The experiment runs on Prolific
-------------------------------

The ID of your experiment is ${babe.deploy.experimentID}

The results will be submitted to ${babe.deploy.submissionURL}

with

Prolific URL (must be the same as in the website): ${babe.deploy.prolificURL}`
            );
        } else if (babe.deploy.deployMethod === "directLink") {
            console.info(
                `The experiment uses Direct Link
-------------------------------

The ID of your experiment is ${babe.deploy.experimentID}

The results will be submitted to ${babe.deploy.submissionURL}`
            );
        } else if (babe.deploy.deployMethod === "debug") {
            console.info(
                `The experiment is in Debug Mode
-------------------------------

The results will be displayed in a table at the end of the experiment and available to download in CSV format.`
            );
        } else if (babe.deploy.deployMethod !== "localServer") {
            throw new Error(
                `There is no such deployMethod.

Please use 'debug', 'directLink', 'Mturk', 'MTurkSandbox', 'localServer' or 'Prolific'.

The deploy method you provided is '${babe.deploy.deployMethod}'.

You can find more information at https://github.com/babe-project/babe-base`
            );
        }

        if (
            babe.deploy.deployMethod === "Prolific" &&
            (babe.deploy.prolificURL === undefined ||
                babe.deploy.prolificURL === "")
        ) {
            throw new Error(errors.prolificURL);
        }

        if (
            babe.deploy.contact_email === undefined ||
            babe.deploy.contact_email === ""
        ) {
            throw new Error(errors.contactEmail);
        }
    })();

    // Checks whether the experiment is valid and reachable on the server before proceeding.

    if (babe.deploy.deployMethod !== "debug") {
        $.ajax({
            type: "GET",
            url: babe.deploy.checkExperimentURL,
            crossDomain: true,
            success: function(responseData, textStatus, jqXHR) {
                // adds progress bars
                babe.progress.add();

                // renders the first view
                babe.findNextView();
            },
            error: function(jqXHR, textStatus, error) {
                alert(
                    `Sorry, there is an error communicating with our server and the experiment cannot proceed. Please return the HIT immediately and contact the author at ${
                        babe.deploy.contact_email
                    }. Please include the following error message: "${
                        jqXHR.responseText
                    }". Thank you for your understanding.`
                );
            }
        });
    } else {
        // adds progress bars
        babe.progress.add();

        // renders the first view
        babe.findNextView();
    }

    // return the babe-object in debug mode to make debugging easier
    if (babe.deploy.deployMethod === 'debug'){
        return babe;
    } else {
        return null;
    }
};
