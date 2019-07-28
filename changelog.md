# Changelog

## Latest version: 0.1.1 

- Say hello to our new name \_magpie 
    - This project is now called `magpie-modules` on npm
    - Lodash is now included in magpie.full.js
    - Otherwise it is the same as 0.1.2 of babe-project

## Older versions (babe-project)

- version 0.1.1 + 0.1.2
    - Image display:
        - Bugfix: Images are now scaled down correctly, if they are high
        - Images do not scale up anymore, if they are smaller than the image container
        - The maximum width of the image container increased (350px -> 960px)
    - SPR:
        - New options how to display the sentence added
        - Option 'wordPos': 'next' or 'same'
        - Option 'underline': 'words', 'sentence' or 'none'

- version: 0.1.0
  
    - Major view restructuring (non-backwards compatible)
          - All template views are now instantiated by `magpieViews.view_generator(<view_type>, <config>)`
              - You can pass a dict as an optional third parameter `{stimulus_container_generator: <custom_func>, answer_container_generator: <custom_func>, handle_response_function: <custom_func>}`
              - With this parameter, you can customize views
          - `trial_type` is no longer used and is replaced by `trial_name`
      
- version 0.0.32 + 0.0.33

    - Fix bug #59, spr-template now ignores non space keypresses

- version 0.0.30 + 0.0.31

    - Delete irrelevant files from npm
    
- version: 0.0.29

	- Bugfix hook after\_response\_enabled works again #52

- version: 0.0.28

	- Add an inactivity tracker/timer (inactive per default) #28
	- Fix localServer deployment
	- babeInit now returns the magpie-object in debug mode, for easier debugging

- version: 0.0.27
 
	- Fix submission of views containing canvas elements (flattened)


