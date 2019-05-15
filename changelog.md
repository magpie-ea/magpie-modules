# Changelog

## Latest version: 0.1.0

- Major view restructuring (non-backwards compatible)
    - All template views are now instantiated by `babeViews.view_generator(<view_type>, <config>)`
        - You can pass a dict as an optional third parameter `{stimulus_container_generator: <custom_func>, answer_container_generator: <custom_func>, handle_response_function: <custom_func>}`
        - With this parameter, you can customize views
    - `trial_type` is no longer used and is replaced by `trial_name`

## Older versions

- version 0.0.32 + 0.0.33

    - Fix bug #59, spr-template now ignores non space keypresses

- version 0.0.30 + 0.0.31

    - Delete irrelevant files from npm
    
- version: 0.0.29

	- Bugfix hook after\_response\_enabled works again #52

- version: 0.0.28

	- Add an inactivity tracker/timer (inactive per default) #28
	- Fix localServer deployment
	- babeInit now returns the babe-object in debug mode, for easier debugging

- version: 0.0.27
 
	- Fix submission of views containing canvas elements (flattened)


