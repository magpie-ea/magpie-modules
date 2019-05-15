const babeTimer = function(babe) {
    // idle time in seconds, gets reset as soon as the user does something
    let idle_time = 0;
    // time in seconds a user can spent idle (default: 600)
    const max_time = typeof babe.timer.minutes !== 'undefined' ? babe.timer.minutes * 60 : 10 * 60;
    // percentage of timer time left, after which information is displayed, between 0 and 1 (default: 0.2, i.e. last 20% of timer)
    const show_info_time = typeof babe.timer.show_info_time !== 'undefined'? babe.timer.show_info_time : 0.2;
    // text displayed on the snackbar, to inform the user that he should do something (default: "Still here?")
    const snack_text = typeof babe.timer.snack_text!== 'undefined' ? babe.timer.snack_text : "Still here?";
    // whether to display the remaining time in seconds on the snachbar (default: true)
    const show_info_time_time = typeof babe.timer.show_info_time_time !== 'undefined' ? babe.timer.show_info_time_time : true;
    // information needed for blinking of page title
    let is_old_title = true;
    const old_title = document.title;
    // text displayed in the blinking page title (default: "Still here?")
    const new_title = typeof babe.timer.new_title !== 'undefined' ?  babe.timer.new_title : "Still here?";
    // function that is called after the timer is finished (default: function() {location.reload(true)}, i.e. page refresh)
    const end_function = typeof babe.timer.end_function !== 'undefined' ? babe.timer.end_function : function() {location.reload(true)};

    // function to add the information snackbar to the dom
    const add_timer = function(){
        const view = $("#main");
        const container = jQuery("<div/>", {
            id: "snackbar"
        });
        view.after(container);
    };

    // resets the timer, everytime this function is called
    const reset_timer = function() {
        idle_time = 0;
    };

    // reset the timer, everytime one of the events is triggered, i.e. user did somethign with the keyboard or mouse
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
    events.forEach(function(name) {
        document.addEventListener(name, reset_timer, true);
    });

    // function to increment the timer, display information about the remaining time and execution of the end_function
    function timer_increment() {
        // increment time by 0.5 seconds
        idle_time = idle_time + 0.5;
        // get the snackbar and update the content
        let snackbar = document.getElementById("snackbar");
        snackbar.innerHTML = `${snack_text} <br> ${show_info_time_time? `${max_time - Math.ceil(idle_time)} seconds remaining`: ''}`;
        // timer has still plenty of time left, hide snackbar (or fade it out)
        if (idle_time  < (1-show_info_time) * max_time) {
            snackbar.className = snackbar.className === "show"? "fade" : "hide";
            document.title = old_title;
        // last show_info_time percent of time, show snackbar and blink page title
        } else if (idle_time < max_time ) {
            snackbar.className = "show";
            document.title = is_old_title? old_title : new_title;
            is_old_title = !is_old_title;
        // timer is finished, reset the timer and call the end_function
        } else {
            reset_timer();
            end_function();
        }
    }

    add_timer(); // created the snackbar
    const idle_interval = setInterval(timer_increment, 500); // call the increment function every 500ms
};
