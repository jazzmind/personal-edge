# Global Skills Passport App
based on Practera SDK
Overview

Docs

1. [Front-end Architecture](https://docs.google.com/document/d/1-6rO7WrnBSGQtbmnIXe-AukzQVsrDpPFM9YeS9r44X8/edit#heading=h.973rokhhmjm5)

1. [Naming Convention Planning](https://docs.google.com/document/d/1Q77qYA9IPTXmjhEMizZYNEBbJkEcbJbD34_1wyEY6iI/edit)


## Requirements

For development environment, here are mandatory utilities.
    - __Npm (Nodejs)__ : Refer to https://nodejs.org/download/
    - __Ionic v2__ : version 2.*

## Setup Notes

1. Install dependencies
    ```shell
    npm install -g ionic #install ionic-cli globally
    ```
1. Make sure your ionic is running at v2 by `ionic -v`
    ```shell
    ionic -v
    2.2.1 # example version number (> 2.2) from the command above
    ```

1. If you have problem installing ionic v2, please uninstall current version of ionic with the following and repeat the step 1 & 2 above again to install ionic v2 correctly.
    ```shell
    npm uninstall -g ionic
    ```

1. after git clone with `git clone git@github.com:jazzmind/practera-ionic.git`

1. change directory into the project folder `cd practera-ionic`

1. Install node dependencies
    ```shell
    npm install
    ```

1. To run app locally
    ```shell
    ionic serve
    ```

## Configuration Notes

To update webapp with different set of activities, you'll need to also add in extra steps after Backend configuration is done. We have a few hardcoded list of IDs in the webapp, so in order to make them display correctly, you'll need to update the IDs according to the new set of activity IDs obtained from the new configuration (from API response or directly dig them out from direct database access)

File involved: `src/configs/config.ts`

Different set of hardcoded IDs would be used depend on the domain name on the client side/browser.

### Spinwheel Color

Color of each segments can be changed to different color by passing different color code from Practera config.

The format should be followed exactly as below. The *general*, *normal*, *rare*, and *ultimate* indicates a particular segment being configured.

```json
{
    "general": [
      {
        "textFontFamily": "Roboto",
        "textFontSize": 26,
        "strokeStyle": null,
        "lineWidth": 0,
        "fillStyle" : "#00c4dd",
        "text" : "100",
        "value" : 100
      }
    ],
    "normal": [
      {
        "textFontFamily": "Roboto",
        "textFontSize": 26,
        "strokeStyle": null,
        "lineWidth": 0,
        "fillStyle": "#008ddd",
        "text" : "200",
        "value" : 200
      }
    ],
    "rare": [
      {
        "textFontFamily": "Roboto",
        "textFontSize": 26,
        "strokeStyle": null,
        "lineWidth": 0,
        "fillStyle": "#a37ff1",
        "text": "300",
        "value": 300
      }
    ],
    "ultimate": [
      {
        "textFontFamily": "Roboto",
        "textFontSize": 26,
        "strokeStyle": null,
        "lineWidth": 0,
        "fillStyle": "#713ae9",
        "text": "400",
        "value" : 400
      }
    ]
  }
```

### Custom Branding - Custom Template

#### Header bar on home page (Activity list)

    Go to [Experience configuration - sandbox](https://sandbox.practera.com/admin/experiences/edit/120), and scroll down to `Customised configurations` section.

    Add additional (if it doesn't exist) or edit `html_branding` item as following:
    ```json
    "html_branding": {
      "header": "<div>Example HTML code</div>"
    }
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

1. Dev environment - Sandbox experience configuration: [Link](https://sandbox.practera.com/admin/experiences/edit/120)

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
