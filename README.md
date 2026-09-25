# @lmn/dynamic-button

Snc Custom Component V1

Component Authors, provide some documentation for your users here!

# Next Experience Dynamic Button Component

A lightweight, reactive Next Experience custom UI primitive (`x-665953-dynamic-button`) built for ServiceNow Workspace Record Producers and Catalog Items. Features configurable styling, dark-mode popover tooltips, responsive alignment, loading states, and shadow-DOM-aware event dispatching.

---

## 1. Installation & Setup

### Step A: Import & Commit the Update Set

1. Log into the target ServiceNow instance.
2. Navigate to **System Update Sets > Retrieved Update Sets**.
3. Click **Import Update Set from XML** and select the provided Update Set XML file.
4. Open the imported record, click **Preview Update Set**, and resolve any non-blocking warnings.
5. Click **Commit Update Set**.

### Step B: Link Component to a Record Producer Variable

1. Navigate to **Service Catalog > Catalog Definitions > Record Producers**.
2. Open your target Record Producer.
3. Under the **Variables** related list, create a new variable or edit an existing one:
   - **Type**: `Custom` (or `Custom UI`)
   - **Macroponent**: Select `x-665953-dynamic-button`
4. Click **Update** to save changes.

---

## 2. Catalog Client Script Implementation

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
 */
function onLoad() {
  // =========================================================================
  // COMPONENT CONFIGURATION (Customize these values)
  // =========================================================================
  var BUTTON_ID = "verify_account_btn";
  var LABEL = "Verify Account";
  var TOOLTIP = "Click to validate account status via API";
  var VARIANT = "primary";
  var SIZE = "medium";
  var ALIGN = "left";

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
      buttonEl.setAttribute("size", SIZE);
      buttonEl.setAttribute("align", ALIGN);
      buttonEl.setAttribute("visible", "true");

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

| Property          | Accepted Values                           | Default            | Description                                                 |
| ----------------- | ----------------------------------------- | ------------------ | ----------------------------------------------------------- |
| **id / buttonId** | String                                    | `""`               | Unique identifier used for DOM targeting and event routing. |
| **label**         | String                                    | `"Execute Action"` | Text displayed on the button face.                          |
| **visible**       | `"true"`, `"false"`                       | `"false"`          | Controls rendering. Keep false until attributes are set.    |
| **loading**       | `"true"`, `"false"`                       | `"false"`          | Displays Processing state and blocks clicks.                |
| **disabled**      | `"true"`, `"false"`                       | `"false"`          | Applies dimmed opacity and disables button.                 |
| **variant**       | `"primary"`, `"secondary"`, `"danger"`    | `"primary"`        | Background color and button color theme.                    |
| **size**          | `"small"`, `"medium"`, `"large"`          | `"medium"`         | Button scale and padding.                                   |
| **align**         | `"left"`, `"center"`, `"right"`, `"full"` | `"left"`           | Flexbox container placement inside form layout.             |
| **tooltip**       | String                                    | `""`               | Custom dark popover hint displayed on hover.                |

---

## 4. Event Payload Structure

The component dispatches a native CustomEvent (`DYNAMIC_BUTTON_CLICKED`) configured with `bubbles: true` and `composed: true` to cross Shadow DOM boundaries.

### Callback evt.detail Payload

```json
{ "buttonId": "verify_account_btn", "id": "verify_account_btn", "label": "Verify Account", "timestamp": 1773582410000 }
```

---

## 5. Multi-Button Routing

When multiple dynamic buttons are placed on a single form or Record Producer:

1. Assign distinct ID attributes to each instance (`buttonEl.id = 'btn_one'`).
2. Filter event callbacks inside the `DYNAMIC_BUTTON_CLICKED` listener using `evt.detail.buttonId`:

```javascript
buttonEl.addEventListener("DYNAMIC_BUTTON_CLICKED", function (evt) {
  if (evt.detail.buttonId === "btn_one") {
    // Execute Button 1 logic
  } else if (evt.detail.buttonId === "btn_two") {
    // Execute Button 2 logic
  }
});
```

```

```
