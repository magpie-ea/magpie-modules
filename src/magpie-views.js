const magpieViews = {
    // Every view_generator needs a view_type and a config dict as input
    // In addition you can pass an optional dict with custom (or from other trial_types) view_template,
    // answer_container and enable_response generators,
    // if you don't pass this dict, it will use the default generators for this trial_type
    // With this options you can customize views,
    // otherwise you could create full custom views
    // (you do everything you own, the "only" constraints are that you have a render function
    // and you have to call magpie.findNextView(), e.g. you don't need to use magpieUtils.view.createTrialDOM)
    view_generator: function(view_type, config,
                              {
                                  stimulus_container_generator=view_info_dict[view_type].default_view_temp,
                                  answer_container_generator=view_info_dict[view_type].default_answer_temp,
                                  handle_response_function=view_info_dict[view_type].default_handle_response
                              } = {}
    ) {
        // First it will inspect, if the parameters and the config dict passed are correct
        if (view_info_dict[view_type].type === "trial") {
            magpieUtils.view.inspector.missingData(config, view_type);
        }
        magpieUtils.view.inspector.params(config, view_type);
        // Now, it will set the title of the view to the default title if no title is set and the button
        // (otherwise we would get a Undefined error in the view_template)
        config.title = magpieUtils.view.setter.title(config.title, view_info_dict[view_type].default_title);
        config.button = magpieUtils.view.setter.buttonText(config.buttonText);

        // Here, the view gets constructed, every view has a name, CT (current trial in view counter),
        // trials (number of trials of this view) and a render function
        const view = {
            name: config.name,
            CT: 0,
            trials: config.trials,
            // The render function gets the magpie object as well as the current trial in view counter as input
            render: function(CT, magpie){

                // If no data is passed (e.g. wrapping views), generate empty config.data[CT] objects
                if (typeof config.data === 'undefined'){
                    config.data = _.fill(Array(config.trials), {});
                }

                // First we will set the question and the QUD to "", to avoid Undefined
                if (view_info_dict[view_type].type === "trial") {
                    config.data[CT].question = magpieUtils.view.setter.question(config.data[CT].question);
                    config.data[CT].QUD = magpieUtils.view.setter.QUD(config.data[CT].QUD);
                }


                // Now we will display the view template
                $("#main").html(stimulus_container_generator(config, CT));

                // And measure the starting time
                let startingTime = Date.now();

                // Finally we create the TrialDOM (including the trial life cycle and hooks)
                magpieUtils.view.createTrialDOM(
                    {
                        pause: config.pause,
                        fix_duration: config.fix_duration,
                        stim_duration: config.stim_duration,
                        data: config.data[CT],
                        evts: config.hook,
                        view: view_type
                    },
                    // After the first three steps of the trial view lifecycle (can all be empty)
                    // We call the following function and interactions are now enabled
                    function() {
                        handle_response_function(config, CT, magpie, answer_container_generator, startingTime)
                    }
                );
            }
        };
        // We return the created view, so that it can be used in 05_views.js
        return view;
    }
};
