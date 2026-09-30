# @lmn/dynamic-button

Snc Custom Component V1

Component Authors, provide some documentation for your users here!

# Next Experience Dynamic Button Component

A lightweight, reactive Next Experience custom UI primitive (`x-665953-dynamic-button`) built for ServiceNow Workspace Record Producers and Catalog Items. Features configurable styling, dark-mode popover tooltips, responsive alignment, loading states, and shadow-DOM-aware event dispatching.

---

## 1. Installation & Setup

### You will need ServiceNow CLI Installed on Your Local Machine! Get from SN Store.

### Step A: Import & Commit

To bring a GitHub repository into Visual Studio Code, you will need to **clone** it. This downloads a local copy of the project to your computer and automatically connects it to VS Code.

Here are the step-by-step instructions:

### Step 1: Copy the Repository URL from GitHub

1. Copy the repository URL (it will look like `https://github.com/Austin-Blake/servicenow-dynamic-button-component.git`).

### Step 2: Clone the Repository in VS Code

You can do this using either the built-in interface or the terminal.

#### Option A: Using the Command Palette (Easiest)

1. Open **Visual Studio Code**.
2. Open the Command Palette by pressing **`Ctrl + Shift + P`** on Windows/Linux or **`Cmd + Shift + P`** on Mac.
3. Type `Git: Clone` and select the **Git: Clone** command.
4. Paste the GitHub repository URL you copied in Step 1 and press **Enter**.
5. Select a local folder on your computer where you want to save the project files and click **Select as Repository Destination**.

#### Option B: Using the Integrated Terminal

1. Open **Visual Studio Code**.
2. Open a new terminal by navigating to **Terminal > New Terminal** in the top menu, or press **`Ctrl + \``**.
3. Type `git clone `, paste your URL, and press **Enter**:
   ```bash
   git clone https://github.com/Austin-Blake/servicenow-dynamic-button-component.git
   ```

### Step 3: Open the Project

1. Once the downloading finishes, a notification window will pop up in the bottom right corner of VS Code asking if you want to open the repository.
2. Click **Open** (or _Open in new window_).
3. If prompted with a "Workspace Trust" window, click **Yes, I trust the authors**.

Your GitHub repository is now fully integrated into your VS Code workspace! You can use the **Source Control** tab (`Ctrl + Shift + G`) on the left-side Activity Bar to track changes, stage commits, and push/pull updates in the future.

## Option 1: Store In Update Set

1. Log into the target ServiceNow instance. (I used PDI)
2. Log into your instance or profile connected to your instance via CLI.
3. In your Instance Open (make current) an Update Set in the Components Scope. (Alternately you can change the components scope in the files to match a scope that exists in your Instance.)
4. In Editior Navigate and Open folder/file of the Project. Verify your in the folder.
5. Run Command Line `sn ui-component deploy`.
6. This will automatically load the files into your update set, ready for deployment to target Instance. (Only needed if not deploying directly to target Instance.)
7. Install Update set.(If you loaded straight to instance component is there (Dependant on Scope Existing)).

### Step B: Link Component to a Record Producer Variable

1. Navigate to **Service Catalog > Catalog Definitions > Record Producers**.
2. Open your target Record Producer.
3. Under the **Variables** related list, create a new variable or edit an existing one:
   - **Type**: `Custom` (or `Custom UI`)
   - **Macroponent**: Select `Dynamic UI Button`
4. Click **Update** to save changes.

---

## 2. Single Button Catalog Client Script Implementation

To initialize, style, and handle click events for the button, add an `onLoad` Catalog Client Script to your Record Producer.

### Required Script Record Settings

- **Name**: `Dynamic Button Handler - [Action Name]`
- **UI Type**: `All` _(Required for CSM / SOW Workspace execution)_
- **Isolate script**: `False` (Unchecked) _(Required for top.document Shadow DOM traversal)_
- **Type**: `onLoad`

### Script Template

Copy the code below into your Catalog Client Script. Edit the values in the `COMPONENT CONFIGURATION` section at the top to match your use case.

```javascript
/**
 * Catalog Client Script: Dynamic Button Handler Template
 * Type: onLoad | UI Type: All | Isolate script: FALSE
 * Example of a single button existance.
 */
function onLoad() {
  // =========================================================================
  // COMPONENT CONFIGURATION (Customize these values)
  // =========================================================================
  var BUTTON_ID = "verify_account_btn";
  var LABEL = "Verify Account";
  var TOOLTIP = "Click to validate account status via API";
  var VARIANT = "primary";
  var ARIALABEL = "Button to Verify Account.";
  var SIZE = "medium";
  var ALIGN = "left";
  var DISABLED = "false";
  var VISIBLE = "false";

  // System constants
  var COMPONENT_TAG = "x-665953-dynamic-button";
  var MAX_RETRIES = 300;
  var retries = 0;

  function findInShadowDOM(selector, root) {
    root = root || top.document;
    if (!root) return null;

    try {
      if (typeof root.querySelector === "function") {
        var element = root.querySelector(selector);
        if (element) return element;
      }
    } catch (e) {}

    var allElements;
    try {
      allElements = root.querySelectorAll("*");
    } catch (e) {
      return null;
    }

    for (var i = 0; i < allElements.length; i++) {
      var child = allElements[i];
      if (child && child.shadowRoot) {
        var found = findInShadowDOM(selector, child.shadowRoot);
        if (found) return found;
      }
    }
    return null;
  }

  var checkExist = setInterval(function () {
    retries++;
    var buttonEl = findInShadowDOM(COMPONENT_TAG);

    if (buttonEl) {
      clearInterval(checkExist);

      buttonEl.id = BUTTON_ID;
      buttonEl.setAttribute("id", BUTTON_ID);
      buttonEl.setAttribute("label", LABEL);
      buttonEl.setAttribute("tooltip", TOOLTIP);
      buttonEl.setAttribute("variant", VARIANT);
      buttonEl.setAttribute("ariaLabel", ARIALABEL);
      buttonEl.setAttribute("size", SIZE);
      buttonEl.setAttribute("align", ALIGN);
      buttonEl.setAttribute("visible", VISIBLE);

      buttonEl.addEventListener("DYNAMIC_BUTTON_CLICKED", function (evt) {
        var detail = evt.detail || {};
        var clickedId = detail.buttonId || detail.id;

        if (clickedId === BUTTON_ID) {
          buttonEl.setAttribute("loading", "true");
          g_form.clearMessages();

          // =========================================================
          // CUSTOM BUSINESS LOGIC HERE
          // =========================================================
          var accountNum = g_form.getValue("account_number");
          var ga = new GlideAjax("AccountUtils");
          ga.addParam("sysparm_name", "validateAccount");
          ga.addParam("sysparm_account", accountNum);

          ga.getXMLAnswer(function (response) {
            buttonEl.setAttribute("loading", "false");
            if (response === "valid") {
              g_form.addInfoMessage("✓ Account successfully verified.");
            } else {
              g_form.addErrorMessage("✕ Invalid Account Number.");
            }
          });
        }
      });
    } else if (retries >= MAX_RETRIES) {
      clearInterval(checkExist);
      console.warn("✕ Could not locate " + COMPONENT_TAG);
    }
  }, 50);
}
```

## 3. Component Property Reference

Component properties can be updated dynamically at runtime via JavaScript.

| Property          | Accepted Values                                      | Default            | Description                                                                                                                                 |
| ----------------- | ---------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **id / buttonId** | String                                               | `""`               | Unique identifier used for DOM targeting and event routing.                                                                                 |
| **label**         | String                                               | `"Execute Action"` | Text displayed on the button face.                                                                                                          |
| **visible**       | `"true"`, `"false"`                                  | `"false"`          | Controls rendering. Keep false until attributes are set.                                                                                    |
| **loading**       | `"true"`, `"false"`                                  | `"false"`          | Displays Processing state and blocks clicks.                                                                                                |
| **disabled**      | `"true"`, `"false"`                                  | `"false"`          | Applies dimmed opacity and disables button.                                                                                                 |
| **variant**       | `"primary"`, `"secondary"`, `"danger"`               | `"primary"`        | Background color and button color theme.                                                                                                    |
| **size**          | `"small"`, `"medium"`, `"large"`,`"sm"`,`"md"`,`"lg` | `"medium"`         | Button scale and padding.                                                                                                                   |
| **align**         | `"left"`, `"center"`, `"right"`, `"full"`            | `"left"`           | Flexbox container placement inside form layout.                                                                                             |
| **tooltip**       | String                                               | `""`               | Custom dark popover hint displayed on hover.                                                                                                |
| **ariaLabel**     | String                                               | `""`               | Attribute used to provide an invisible text label for an element so that screen readers and other assistive technologies can read it aloud. |

---

## 4. Event Payload Structure

The component dispatches a native CustomEvent (`DYNAMIC_BUTTON_CLICKED`) configured with `bubbles: true` and `composed: true` to cross Shadow DOM boundaries.

### Callback evt.detail Payload

```json
{
  "buttonId": "verify_account_btn",
  "id": "verify_account_btn",
  "label": "Verify Account",
  "timestamp": 1773582410000,
  "value": "123456",
  "variant": "primary"
}
```

---

## 5. Multi-Button Routing

When multiple dynamic buttons are placed on a single form or Record Producer:

1. Assign distinct ID attributes to each instance (`buttonEl.id = 'btn_one'`).
2. System Property Must Exist to ID each button component. (See `The System Property Configuration`).
3. Filter event callbacks inside the `DYNAMIC_BUTTON_CLICKED` listener using `evt.detail.buttonId`:
   Alternately Each Button can have its own Onload Script and Listener. (My Prefered Pattern).

```javascript
buttonEl.addEventListener("DYNAMIC_BUTTON_CLICKED", function (evt) {
  if (evt.detail.buttonId === "btn_one") {
    // Execute Button 1 logic
  } else if (evt.detail.buttonId === "btn_two") {
    // Execute Button 2 logic
  }
});
```

4. Fetch System Property and configure (See `Multiple Button Setup Example`);

```

```

## ⚠️ Known Constraint: Multiple Buttons, DOM Indexing, and UI Policies

Due to a platform limitation in ServiceNow's Next Experience (UI19+), Catalog Variable "Default Values" are not reliably passed down to Macroponents on the initial page load.

To bypass this and allow multiple custom buttons on a single form, this component utilizes a **DOM Indexing Strategy** backed by a System Property. The script calculates the button's physical top-to-bottom layout index in the DOM and maps it to a configuration object.

**CRITICAL:** Because this architecture relies on exact DOM ordering, **you cannot use standard ServiceNow UI Policies to dynamically hide or show these variables.** Hiding a variable physically removes it from Snabbdom (the Virtual DOM). If Button #1 is hidden by a UI policy, Button #2 shifts up to Index 0, breaking the mapping logic and causing scripts to target the wrong buttons.

---

### 1. The System Property Configuration

Instead of hardcoding indexes, configure your buttons in a System Property (e.g., `custom.dynamic_buttons.config`). Set the type to **string** and provide a JSON array.

The `order` value should match the top-to-bottom layout order of the variables on your Record Producer.

```json
[
  { "id": "run_test_btn", "order": 100 },
  { "id": "cancel_request_btn", "order": 200 }
]
```

### 2. Logic to Extract and Select the Correct Button

In your Catalog Client Script, use GlideAjax to fetch this property. The script parses the JSON, sorts it by the order key, and dynamically determines its own index before searching the DOM.

```JavaScript
// 1. Define the ID for the button this specific script will manage
var BUTTON_ID = "run_test_btn";

// 2. Fetch the JSON configuration via GlideAjax
var gaConfig = new GlideAjax('TestingClientUtils');
gaConfig.addParam('sysparm_name', 'getOrderedButtons');
gaConfig.getXMLAnswer(function(response) {
    if (!response) return;

    try {
        var allButtons = JSON.parse(response);

        // 3. Sort the array lowest-to-highest based on the 'order' property
        allButtons.sort(function(a, b) {
            return a.order - b.order;
        });

        // 4. Calculate this button's mathematical index in the physical DOM
        var targetIndex = -1;
        for (var i = 0; i < allButtons.length; i++) {
            if (allButtons[i].id === BUTTON_ID) {
                targetIndex = i;
                break;
            }
        }

        // 5. Pass the target index and expected total length to your DOM poller
        if (targetIndex !== -1) {
            claimAndConfigureButton(targetIndex, allButtons.length);
        } else {
            console.warn("✕ Button ID " + BUTTON_ID + " not found in config.");
        }

    } catch (e) {
        console.error("Failed to parse Dynamic Button JSON property:", e);
    }
});
```

### 3. State Management (The Alternative to UI Policies)

Since you cannot use UI Policies, you must control the button's visibility and interactability programmatically within your onLoad script.

Update the component's state using standard dot-notation once the button is claimed by the claimAndConfigureButton poller:

```JavaScript
// Example: Dynamically disable or hide the button based on form data
var currentState = g_form.getValue('state');

if (currentState === 'Closed') {
    // Correct way to hide the button without breaking DOM indexing
    buttonEl.visible = false;

    // OR: Keep it visible but prevent clicks
    buttonEl.disabled = true;
} else {
    buttonEl.visible = true;
    buttonEl.disabled = false;
}
```

### 4. Multiple Button Setup Example

If your Record Producer has multiple buttons, this is a way to identify your button from the other buttons. Dependant on the system property pattern that holds a list of buttons and their order based on the Record Producer.

```JavaScript
// =========================================================================
    //   COMPONENT CONFIGURATION (Customize these values)
    // =========================================================================
    var BUTTON_ID = "test_btn";
    var LABEL = "Run Test";
    var TOOLTIP = "Run Test";
    var VARIANT = "primary";
	var ARIALABEL = "Button to Run Test.";
    var SIZE = "medium";
    var ALIGN = "left";
    var DISABLED = 'false';
    var VISIBLE = 'false';
    var COMPONENT_TAG = 'x-665953-dynamic-button';

    // ============================================================================
    //   FETCH SYSTEM PROPERTY CONFIG
	// (If only one button on page will exist this is not nessisary and can forfiet
	// the property and fetch. Just grab the custom component.)
    // Connects to the backend to figure out which DOM index belongs to this button
    // ============================================================================
    var gaConfig = new GlideAjax('');
    gaConfig.addParam('sysparm_name', 'getOrderedButtons');
    gaConfig.getXMLAnswer(function(response) {
        if (!response) return;
        console.log(response)
        try {
            var allButtons = JSON.parse(response);

            // Sort the array by the 'order' property (lowest to highest)
            allButtons.sort(function(a, b) {
                return a.order - b.order;
            });

            // Find this script's index in the sorted array
            var targetIndex = -1;
            for (var i = 0; i < allButtons.length; i++) {
                if (allButtons[i].id === BUTTON_ID) {
                    targetIndex = i;
                    break;
                }
            }

            // If we found our index, claim the button
            if (targetIndex !== -1) {
                claimAndConfigureButton(targetIndex, allButtons.length);
            } else {
                console.warn("✕ Button ID " + BUTTON_ID + " not found in System Property config.");
            }

        } catch (e) {
            console.error("Failed to parse Dynamic Button JSON property:", e);
        }
    });
```

```Javascript

function claimAndConfigureButton(targetIndex,expectedTotal) {
        var MAX_RETRIES = 300;
        var retries = 0;

        var checkExist = setInterval(function() {
            retries++;
            var topDoc = top.document;
            var unclaimedButtons = [];

            function collectButtons(selector, root, results) {
                root = root || top.document;
                results = results || [];

                // Bail immediately if we've already found all expected buttons
                if (!root || results.length >= expectedTotal) return results;

                // Check current level
                try {
                    if (typeof root.querySelectorAll === "function") {
                        var matches = root.querySelectorAll(selector);
                        for (var i = 0; i < matches.length; i++) {
                            if (results.indexOf(matches[i]) === -1) {
                                results.push(matches[i]);
                            }
                            if (results.length >= expectedTotal) return results; // Bail early
                        }
                    }
                } catch (e) {}

                var allElements;
                try {
                    allElements = root.querySelectorAll("*");
                } catch (e) {
                    return results;
                }

                for (var j = 0; j < allElements.length; j++) {
                    if (results.length >= expectedTotal) break; // Bail early

                    var child = allElements[j];

                    //Only search elements that have a hyphen in their tag name (Custom Web Components).
                    // This skips standard divs, spans, and inputs.
                    if (child && child.tagName && child.tagName.indexOf('-') > -1 && child.shadowRoot) {
                        collectButtons(selector, child.shadowRoot, results);
                    }
                }
                return results;
            }
            var allDynamicButtons = collectButtons(COMPONENT_TAG, top.document, []);

            // Target the specific button element based on the layout index
            var buttonEl = allDynamicButtons[targetIndex];

            if (buttonEl) {
                clearInterval(checkExist);

                // Only configure the button if it hasn't been claimed yet
                if (buttonEl.dataset.initialized !== "true") {
                    buttonEl.dataset.initialized = "true";

                    // --- APPLY PROPERTIES VIA DOT NOTATION ---
                    // This directly updates the Snabbdom state in Next Experience
                    buttonEl.id = BUTTON_ID;
                    buttonEl.buttonId = BUTTON_ID;
                    buttonEl.label = LABEL;
                    buttonEl.tooltip = TOOLTIP;
                    buttonEl.variant = VARIANT;
					buttonEl.ariaLabel= ARIALABEL;
                    buttonEl.size = SIZE;
                    buttonEl.align = ALIGN;
                    buttonEl.disabled = DISABLED;
                    buttonEl.visible = VISIBLE; // Set last so the button appears fully styled

                    // =========================================================
                    //    CLICK EVENT HANDLER & BACKEND TEST INITIATION
                    // =========================================================
                    buttonEl.addEventListener("DYNAMIC_BUTTON_CLICKED", function(evt) {
                        var detail = evt.detail || {};
                        var clickedId = detail.buttonId || detail.id;

                        // Ensure we only act on clicks for THIS specific button
                        if (clickedId === BUTTON_ID) {

                            // Set Loading Indicator, scroll to message, clear old messages
                            buttonEl.loading = true; // Shows the spinner
                            buttonEl.disabled = true;

                            //Trigger Backend Test via GlideAjax or Anything
                            var gaTest = new GlideAjax('');
                            gaTest.addParam('sysparm_name', '');


                            gaTest.getXMLAnswer(function(testResponse) {
                                var result = JSON.parse(testResponse);

                                if (result.status === 'success') {


                                }
                            });
                        }
                    });
                }
            } else if (retries >= MAX_RETRIES) {
                clearInterval(checkExist);
                console.warn("✕ Could not locate " + COMPONENT_TAG + " at index: " + targetIndex);
            }
        }, 50);
    }
```
