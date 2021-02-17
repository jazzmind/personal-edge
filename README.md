# RMIT Personal Edge App
based on Practera SDK
Overview

Docs

1. [Front-end Architecture](https://docs.google.com/document/d/1-6rO7WrnBSGQtbmnIXe-AukzQVsrDpPFM9YeS9r44X8/edit#heading=h.973rokhhmjm5)

1. [Naming Convention Planning](https://docs.google.com/document/d/1Q77qYA9IPTXmjhEMizZYNEBbJkEcbJbD34_1wyEY6iI/edit)


## Requirements

For development environment, here are mandatory utilities.
    - __Npm (Nodejs)__ : Refer to https://nodejs.org/download/
    - __Ionic v2__ : version 3.*
    - __docker__: version ^3.0

## Setup Notes

1. Install dependencies
    ```shell
    npm install -g ionic #install ionic-cli globally
    ```
1. Make sure your ionic is running at v3 by `ionic -v`
    ```shell
    ionic -v
    ```

1. If you have problem installing ionic v3, please uninstall current version of ionic with the following and repeat the step 1 & 2 above again to install ionic v3 correctly.
    ```shell
    npm uninstall -g ionic
    ```
1. Setup Docker and run the app locally
    ```shell
    docker-compose build # to setup docker container locally
    npm run start-server
    ```

## Development Notes

1. Ionic Deeplinking/Routing
    Deeplinking allow a URL to auto redirect user into a specific page in the App.
    We also use named url parameters in URL, for example, ```http://example.com?parameter_name=example_value``` for specific feature to adapt backward-compatible consideration.

    For example, using pagename in _do_ parameter:

    - Reset password: `http://example.com?do=resetpassword&email=test@example.com&key=abcdefg`

    - Registration: `http://example.com?do=registration&email=test@example.com&key=abcdefg`

1. Copy `src/configs/config.ts.default` to `src/configs/config.ts`. Change your appkey inside `config.ts` based on the appkey in your database.

1. Start server or initiate app
    ```
    ionic serve
    ```

## Troubleshooting

1. **Cached web content** - If you found what you see in browser isn't updated as expected after you've changed the codebase, you can try:
    1. Make sure `ionic serve` in your terminal if it is still running
    1. Activate browser `Developer Mode` in Chrome/Safari/Firefox - `OPT + CMD + I`
    1. Empty cache
        1. Chrome
            1. Application Tab
            1. Clear Storage
            1. click '[*Clear selected*]' button
        1. Safari
            1. Select `Develop`
            1. Disable cache
            1. Empty cache or `OPT + CMD + E`
        1. Firefox
            1. Get into `Preference` (use shortcut key `CMD + ,`)
            1. Select `Advanced`
            1. At the `Cached Web Content` click '[*Clear Now*]' button
