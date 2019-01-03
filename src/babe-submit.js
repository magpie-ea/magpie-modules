function babeSubmit(babe) {
    const submit = {
        // submits the data
        // trials - the data collected from the experiment
        // global_data - other data (start date, user agent, etc.)
        // config - information about the deploy method and URLs
        submit: function(babe) {
            // construct data object for output
            let data = {
                experiment_id: babe.deploy.experimentID,
                trials: addEmptyColumns(babe.trial_data)
            };

            // merge in global_data accummulated so far
            // this could be unsafe if 'global_data' contains keys used in 'trials'!!
            data = _.merge(babe.global_data, data);

            // add more fields depending on the deploy method
            if (babe.deploy.is_MTurk) {
                const HITData = getHITData();
                data["assignment_id"] = HITData["assignmentId"];
                data["worker_id"] = HITData["workerId"];
                data["hit_id"] = HITData["hitId"];

                // creates a form with assignmentId input for the submission ot MTurk
                var form = jQuery("<form/>", {
                    id: "mturk-submission-form",
                    action: babe.deploy.MTurk_server,
                    method: "POST"
                }).appendTo(".babe-thanks-view");
                jQuery("<input/>", {
                    type: "hidden",
                    name: "trials",
                    value: JSON.stringify(data)
                }).appendTo(form);
                // MTurk expects a key 'assignmentId' for the submission to work,
                // that is why is it not consistent with the snake case that the other keys have
                jQuery("<input/>", {
                    type: "hidden",
                    name: "assignmentId",
                    value: HITData["assignmentId"]
                }).appendTo(form);
            }

            // if the experiment is set to live (see config liveExperiment)
            // the results are sent to the server
            // if it is set to false
            // the results are displayed on the thanks slide
            if (babe.deploy.liveExperiment) {
                //submitResults(config_deploy.contact_email, config_deploy.submissionURL, data);
                submitResults(
                    babe.deploy.contact_email,
                    babe.deploy.submissionURL,
                    flattenData(data),
                    babe.deploy
                );
            } else {
                const flattenedData = flattenData(data);
                jQuery("<div/>", {
                    class: "babe-debug-results",
                    html: formatDebugData(flattenedData)
                }).appendTo($("#babe-debug-table-container"));
                createCSVForDownload(flattenedData);
            }
        }
    };

    // submits data to the server and MTurk's server if the experiment runs on MTurk
    function submitResults(contactEmail, submissionURL, data, config) {
        // set a default contact email
        contactEmail =
            typeof contactEmail !== "undefined" ? contactEmail : "not provided";

        $.ajax({
            type: "POST",
            url: submissionURL,
            crossDomain: true,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(responseData, textStatus, jqXHR) {
                $("#warning-message").addClass("babe-nodisplay");
                $("#thanks-message").removeClass("babe-nodisplay");
                $("#extra-message").removeClass("babe-nodisplay");

                if (config.is_MTurk) {
                    // submits to MTurk's server if isMTurk = true
                    setTimeout(function() {
                        submitToMTurk(data), 500;
                    });
                }
            },
            error: function(responseData, textStatus, errorThrown) {
                // There is this consideration about whether we should still allow such a submission that failed on our side to proceed on submitting to MTurk. Maybe we should after all.
                if (config.is_MTurk) {
                    // submits to MTurk's server if isMTurk = true
                    submitToMTurk(data);

                    // shows a thanks message after the submission
                    $("#thanks-message").removeClass("babe-nodisplay");
                } else {
                    // It seems that this timeout (waiting for the server) is implemented as a default value in many browsers, e.g. Chrome. However it is really long (1 min) so timing out shouldn't be such a concern.
                    if (textStatus == "timeout") {
                        alert(
                            "Oops, the submission timed out. Please try again. If the problem persists, please contact " +
                                contactEmail +
                                ", including your ID"
                        );
                    } else {
                        alert(
                            "Oops, the submission failed. The server says: " +
                                responseData.responseText +
                                "\nPlease try again. If the problem persists, please contact " +
                                contactEmail +
                                "with this error message, including your ID"
                        );
                    }
                }
            }
        });
    }

    // submits to MTurk's servers
    // and the correct url is given in config.MTurk_server
    const submitToMTurk = function() {
        var form = $("#mturk-submission-form");
        form.submit();
    };

    // adds columns with NA values
    const addEmptyColumns = function(trialData) {
        var columns = [];

        for (var i = 0; i < trialData.length; i++) {
            for (var prop in trialData[i]) {
                if (
                    trialData[i].hasOwnProperty(prop) &&
                    columns.indexOf(prop) === -1
                ) {
                    columns.push(prop);
                }
            }
        }

        for (var j = 0; j < trialData.length; j++) {
            for (var k = 0; k < columns.length; k++) {
                if (!trialData[j].hasOwnProperty(columns[k])) {
                    trialData[j][columns[k]] = "NA";
                }
            }
        }

        return trialData;
    };

    // prepare the data form debug mode
    const formatDebugData = function(flattenedData) {
        var output = "<table id='babe-debug-table'>";

        var t = flattenedData[0];

        output += "<thead><tr>";

        for (var key in t) {
            if (t.hasOwnProperty(key)) {
                output += "<th>" + key + "</th>";
            }
        }

        output += "</tr></thead>";

        output += "<tbody><tr>";

        var entry = "";

        for (var i = 0; i < flattenedData.length; i++) {
            var currentTrial = flattenedData[i];
            for (var k in t) {
                if (currentTrial.hasOwnProperty(k)) {
                    entry = String(currentTrial[k]);
                    output += "<td>" + entry.replace(/ /g, "&nbsp;") + "</td>";
                }
            }

            output += "</tr>";
        }

        output += "</tbody></table>";

        return output;
    };

    const createCSVForDownload = function(flattenedData) {
        var csvOutput = "";

        var t = flattenedData[0];

        for (var key in t) {
            if (t.hasOwnProperty(key)) {
                csvOutput += '"' + String(key) + '",';
            }
        }
        csvOutput += "\n";
        for (var i = 0; i < flattenedData.length; i++) {
            var currentTrial = flattenedData[i];
            for (var k in t) {
                if (currentTrial.hasOwnProperty(k)) {
                    csvOutput += '"' + String(currentTrial[k]) + '",';
                }
            }
            csvOutput += "\n";
        }

        var blob = new Blob([csvOutput], {
            type: "text/csv"
        });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, "results.csv");
        } else {
            jQuery("<a/>", {
                class: "babe-view-button",
                html: "Download the results as CSV",
                href: window.URL.createObjectURL(blob),
                download: "results.csv"
            }).appendTo($(".babe-thanks-view"));
        }
    };

    const flattenData = function(data) {
        var trials = data.trials;
        delete data.trials;

        // The easiest way to avoid name clash is just to check the keys one by one and rename them if necessary.
        // Though I think it's also the user's responsibility to avoid such scenarios...
        var sample_trial = trials[0];
        for (var trial_key in sample_trial) {
            if (sample_trial.hasOwnProperty(trial_key)) {
                if (data.hasOwnProperty(trial_key)) {
                    // Much easier to just operate it once on the data, since if we also want to operate on the trials we'd need to loop through each one of them.
                    var new_data_key = "glb_" + trial_key;
                    data[new_data_key] = data[trial_key];
                    delete data[trial_key];
                }
            }
        }

        var out = _.map(trials, function(t) {
            // Here the data is the general informatoin besides the trials.
            return _.merge(t, data);
        });
        return out;
    };

    // parses the url to get the assignmentId and workerId
    const getHITData = function() {
        const url = window.location.href;
        let qArray = url.split("?");
        let HITData = {};

        if (qArray[1] === undefined) {
            throw new Error(
                "Cannot get participant' s assignmentId from the URL (happens if the experiment does NOT run on MTurk or MTurkSandbox)."
            );
        } else {
            qArray = qArray[1].split("&");

            for (var i = 0; i < qArray.length; i++) {
                HITData[qArray[i].split("=")[0]] = qArray[i].split("=")[1];
            }
        }

        return HITData;
    };

    return submit;
}
